import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { HydrationEntry, CaffeineEntry, AppSettings, AppData, ReminderSchedule, CaffeineSettings } from '@/types';

// Database schema
interface BeWetDB extends DBSchema {
  entries: {
    key: string;
    value: HydrationEntry;
    indexes: { 'by-date': string };
  };
  caffeineEntries: {
    key: string;
    value: CaffeineEntry;
    indexes: { 'by-date': string };
  };
  settings: {
    key: string;
    value: AppSettings & { key: string };
  };
}

const DB_NAME = 'bewet-db';
const DB_VERSION = 2; // Bumped for caffeine entries store

let dbPromise: Promise<IDBPDatabase<BeWetDB>> | null = null;

// Default reminder schedule
const DEFAULT_REMINDER_SCHEDULE: ReminderSchedule = {
  enabled: false,
  startHour: 9,
  startMinute: 0,
  endHour: 22,
  endMinute: 0,
  intervalMinutes: 120,
};

// Default caffeine settings
const DEFAULT_CAFFEINE_SETTINGS: CaffeineSettings = {
  enabled: true,
  teaPenaltyMl: 250,
  coffeePenaltyMl: 250,
};

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  dailyGoal: 2000,
  language: 'en',
  onboardingComplete: false,
  reminderSchedule: DEFAULT_REMINDER_SCHEDULE,
  caffeineSettings: DEFAULT_CAFFEINE_SETTINGS,
};

// Initialize database
export async function getDB(): Promise<IDBPDatabase<BeWetDB>> {
  if (!dbPromise) {
    dbPromise = openDB<BeWetDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        // Version 1: entries and settings
        if (oldVersion < 1) {
          // Entries store with date index
          const entryStore = db.createObjectStore('entries', { keyPath: 'id' });
          entryStore.createIndex('by-date', 'date');

          // Settings store
          db.createObjectStore('settings', { keyPath: 'key' });
        }

        // Version 2: caffeine entries
        if (oldVersion < 2) {
          const caffeineStore = db.createObjectStore('caffeineEntries', { keyPath: 'id' });
          caffeineStore.createIndex('by-date', 'date');
        }
      },
    });
  }
  return dbPromise;
}

// ===== ENTRIES =====

export async function addEntry(entry: HydrationEntry): Promise<void> {
  const db = await getDB();
  await db.put('entries', entry);
}

export async function getEntriesByDate(date: string): Promise<HydrationEntry[]> {
  const db = await getDB();
  return db.getAllFromIndex('entries', 'by-date', date);
}

export async function getEntriesForDateRange(
  startDate: string,
  endDate: string
): Promise<HydrationEntry[]> {
  const db = await getDB();
  const range = IDBKeyRange.bound(startDate, endDate);
  return db.getAllFromIndex('entries', 'by-date', range);
}

export async function getAllEntries(): Promise<HydrationEntry[]> {
  const db = await getDB();
  return db.getAll('entries');
}

export async function deleteEntry(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('entries', id);
}

// ===== CAFFEINE ENTRIES =====

export async function addCaffeineEntry(entry: CaffeineEntry): Promise<void> {
  const db = await getDB();
  await db.put('caffeineEntries', entry);
}

export async function getCaffeineEntriesByDate(date: string): Promise<CaffeineEntry[]> {
  const db = await getDB();
  return db.getAllFromIndex('caffeineEntries', 'by-date', date);
}

export async function getCaffeineEntriesForDateRange(
  startDate: string,
  endDate: string
): Promise<CaffeineEntry[]> {
  const db = await getDB();
  const range = IDBKeyRange.bound(startDate, endDate);
  return db.getAllFromIndex('caffeineEntries', 'by-date', range);
}

export async function getAllCaffeineEntries(): Promise<CaffeineEntry[]> {
  const db = await getDB();
  return db.getAll('caffeineEntries');
}

export async function deleteCaffeineEntry(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('caffeineEntries', id);
}

export async function updateCaffeineEntry(entry: CaffeineEntry): Promise<void> {
  const db = await getDB();
  await db.put('caffeineEntries', entry);
}

// ===== SETTINGS =====

export async function getSettings(): Promise<AppSettings> {
  const db = await getDB();
  const stored = await db.get('settings', 'main');
  if (stored) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { key, ...settings } = stored;
    return settings;
  }
  return DEFAULT_SETTINGS;
}

export async function updateSettings(
  updates: Partial<AppSettings>
): Promise<AppSettings> {
  const current = await getSettings();
  const updated: AppSettings = { ...current, ...updates };
  const db = await getDB();
  await db.put('settings', { ...updated, key: 'main' });
  return updated;
}

// ===== DATA MANAGEMENT =====

export async function exportAllData(): Promise<AppData> {
  const [settings, entries, caffeineEntries] = await Promise.all([
    getSettings(),
    getAllEntries(),
    getAllCaffeineEntries(),
  ]);

  return {
    settings,
    entries,
    caffeineEntries,
    exportDate: new Date().toISOString(),
    version: '1.1.0',
  };
}

export async function importData(data: AppData): Promise<void> {
  const db = await getDB();

  // Clear existing data
  const tx = db.transaction(['entries', 'settings', 'caffeineEntries'], 'readwrite');
  await Promise.all([
    tx.objectStore('entries').clear(),
    tx.objectStore('settings').clear(),
    tx.objectStore('caffeineEntries').clear(),
  ]);
  await tx.done;

  // Import settings
  await updateSettings(data.settings);

  // Import entries
  for (const entry of data.entries) {
    await addEntry(entry);
  }

  // Import caffeine entries (if present)
  if (data.caffeineEntries) {
    for (const entry of data.caffeineEntries) {
      await addCaffeineEntry(entry);
    }
  }
}

export async function resetAllData(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['entries', 'settings', 'caffeineEntries'], 'readwrite');
  await Promise.all([
    tx.objectStore('entries').clear(),
    tx.objectStore('settings').clear(),
    tx.objectStore('caffeineEntries').clear(),
  ]);
  await tx.done;
}

// ===== HELPERS =====

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDateDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

export function downloadJSON(data: object, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

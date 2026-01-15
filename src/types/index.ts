// Single hydration entry
export interface HydrationEntry {
  id: string;
  amount: number; // ml
  timestamp: number; // Unix ms
  date: string; // 'YYYY-MM-DD'
}

// Daily summary (computed)
export interface DailySummary {
  date: string;
  total: number;
  goal: number;
  entries: number;
  goalReached: boolean;
}

// Reminder schedule configuration
export interface ReminderSchedule {
  enabled: boolean;
  startHour: number; // 0-23
  startMinute: number; // 0-59
  endHour: number;
  endMinute: number;
  intervalMinutes: number; // e.g., 120 for 2 hours
}

// Reminder runtime state
export interface ReminderState {
  nextDueTime: number | null;
  snoozedUntil: number | null;
  lastShownTime: number | null;
}

// App settings
export interface AppSettings {
  dailyGoal: number; // ml
  language: Language;
  onboardingComplete: boolean;
  reminderSchedule: ReminderSchedule;
}

// Supported languages
export type Language = 'en' | 'ru';

// Tab navigation
export type TabId = 'home' | 'history' | 'settings';

// Full app data for export
export interface AppData {
  settings: AppSettings;
  entries: HydrationEntry[];
  exportDate: string;
  version: string;
}

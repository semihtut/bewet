// Single hydration entry
export interface HydrationEntry {
  id: string;
  amount: number; // ml
  timestamp: number; // Unix ms
  date: string; // 'YYYY-MM-DD'
}

// Caffeine entry (tea or coffee)
export interface CaffeineEntry {
  id: string;
  type: 'tea' | 'coffee';
  servings: number; // number of servings (1 serving = 250ml)
  note?: string; // optional note (e.g., "green tea", "espresso")
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
  // Caffeine penalty data
  caffeineEntries?: number;
  caffeinePenalty?: number;
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

// Caffeine penalty settings
export interface CaffeineSettings {
  enabled: boolean;
  teaPenaltyMl: number; // ml penalty per serving (0, 125, 250, 375, 500)
  coffeePenaltyMl: number; // ml penalty per serving
}

// App settings
export interface AppSettings {
  dailyGoal: number; // ml
  language: Language;
  onboardingComplete: boolean;
  reminderSchedule: ReminderSchedule;
  caffeineSettings: CaffeineSettings;
}

// Supported languages
export type Language = 'en' | 'ru';

// Tab navigation
export type TabId = 'home' | 'history' | 'settings';

// Full app data for export
export interface AppData {
  settings: AppSettings;
  entries: HydrationEntry[];
  caffeineEntries: CaffeineEntry[];
  exportDate: string;
  version: string;
}

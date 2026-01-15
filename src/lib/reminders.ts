import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ReminderSchedule, ReminderState } from '@/types';

// Default values
const DEFAULT_SCHEDULE: ReminderSchedule = {
  enabled: false,
  startHour: 9,
  startMinute: 0,
  endHour: 22,
  endMinute: 0,
  intervalMinutes: 120,
};

const DEFAULT_STATE: ReminderState = {
  nextDueTime: null,
  snoozedUntil: null,
  lastShownTime: null,
};

// Reminder check result
interface ReminderCheckResult {
  isDue: boolean;
  message: string;
}

// Reminder store interface
interface ReminderStore {
  schedule: ReminderSchedule;
  state: ReminderState;
  setSchedule: (schedule: Partial<ReminderSchedule>) => void;
  checkReminder: () => ReminderCheckResult;
  snooze: (minutes?: number) => void;
  dismiss: () => void;
  resetState: () => void;
}

// Helper: Check if time is in active window
function isInActiveWindow(
  now: Date,
  schedule: ReminderSchedule
): boolean {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = schedule.startHour * 60 + schedule.startMinute;
  const endMinutes = schedule.endHour * 60 + schedule.endMinute;

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

// Helper: Calculate next due time
function calculateNextDue(
  schedule: ReminderSchedule,
  state: ReminderState,
  now: Date
): number {
  // Get today's start time
  const todayStart = new Date(now);
  todayStart.setHours(schedule.startHour, schedule.startMinute, 0, 0);

  // Get today's end time
  const todayEnd = new Date(now);
  todayEnd.setHours(schedule.endHour, schedule.endMinute, 0, 0);

  // Base time is either last shown or start of day
  const baseTime = state.lastShownTime || todayStart.getTime();
  const intervalMs = schedule.intervalMinutes * 60 * 1000;

  // Calculate next time based on interval
  let nextTime = baseTime + intervalMs;

  // If we're before start time, first reminder is at start
  if (now.getTime() < todayStart.getTime()) {
    return todayStart.getTime();
  }

  // Make sure it's not in the past
  while (nextTime <= now.getTime()) {
    nextTime += intervalMs;
  }

  // If past end time, schedule for tomorrow
  if (nextTime > todayEnd.getTime()) {
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    return tomorrowStart.getTime();
  }

  return nextTime;
}

// Create reminder store
export const useReminderStore = create<ReminderStore>()(
  persist(
    (set, get) => ({
      schedule: DEFAULT_SCHEDULE,
      state: DEFAULT_STATE,

      setSchedule: (updates) => {
        set((s) => ({
          schedule: { ...s.schedule, ...updates },
          // Reset next due time when schedule changes
          state: { ...s.state, nextDueTime: null },
        }));
      },

      checkReminder: () => {
        const { schedule, state } = get();
        const now = new Date();

        // Disabled = not due
        if (!schedule.enabled) {
          return { isDue: false, message: '' };
        }

        // Check if snoozed
        if (state.snoozedUntil && now.getTime() < state.snoozedUntil) {
          return { isDue: false, message: '' };
        }

        // Check if in active window
        if (!isInActiveWindow(now, schedule)) {
          return { isDue: false, message: '' };
        }

        // Calculate next due if not set
        let nextDue = state.nextDueTime;
        if (!nextDue) {
          nextDue = calculateNextDue(schedule, state, now);
          // Update state with calculated next due
          set((s) => ({
            state: { ...s.state, nextDueTime: nextDue },
          }));
        }

        // Check if due
        if (now.getTime() >= nextDue) {
          return { isDue: true, message: 'Time for water!' };
        }

        return { isDue: false, message: '' };
      },

      snooze: (minutes = 30) => {
        const snoozedUntil = Date.now() + minutes * 60 * 1000;
        set((s) => ({
          state: {
            ...s.state,
            snoozedUntil,
            lastShownTime: Date.now(),
          },
        }));
      },

      dismiss: () => {
        const { schedule, state } = get();
        const now = new Date();
        const nextDue = calculateNextDue(schedule, { ...state, lastShownTime: Date.now() }, now);

        set({
          state: {
            lastShownTime: Date.now(),
            nextDueTime: nextDue,
            snoozedUntil: null,
          },
        });
      },

      resetState: () => {
        set({ state: DEFAULT_STATE });
      },
    }),
    {
      name: 'bewet-reminders',
      partialize: (s) => ({
        schedule: s.schedule,
        state: s.state,
      }),
    }
  )
);

// Hook for checking reminders on app open
export function useReminderCheck() {
  const { checkReminder, snooze, dismiss, schedule } = useReminderStore();
  const result = checkReminder();

  return {
    isDue: result.isDue,
    message: result.message,
    isEnabled: schedule.enabled,
    snooze,
    dismiss,
  };
}

// Generate schedule times for display
export function generateScheduleTimes(schedule: ReminderSchedule): string[] {
  const times: string[] = [];
  const start = schedule.startHour * 60 + schedule.startMinute;
  const end = schedule.endHour * 60 + schedule.endMinute;
  const interval = schedule.intervalMinutes;

  for (let mins = start; mins <= end; mins += interval) {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    times.push(
      `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    );
  }

  return times;
}

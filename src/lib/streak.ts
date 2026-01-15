import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getToday, getDateDaysAgo } from './storage';

interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  // Actions
  recordGoalCompleted: () => void;
  checkAndUpdateStreak: () => void;
  resetStreak: () => void;
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null,

      recordGoalCompleted: () => {
        const today = getToday();
        const { lastCompletedDate, currentStreak, longestStreak } = get();

        // Already recorded today
        if (lastCompletedDate === today) return;

        const yesterday = getDateDaysAgo(1);

        let newStreak: number;

        if (lastCompletedDate === yesterday) {
          // Consecutive day - increment streak
          newStreak = currentStreak + 1;
        } else if (lastCompletedDate === null || lastCompletedDate < yesterday) {
          // First completion or streak broken - start new streak
          newStreak = 1;
        } else {
          newStreak = currentStreak;
        }

        const newLongest = Math.max(longestStreak, newStreak);

        set({
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastCompletedDate: today,
        });
      },

      checkAndUpdateStreak: () => {
        const yesterday = getDateDaysAgo(1);
        const { lastCompletedDate } = get();

        // If last completed was before yesterday, streak is broken
        if (lastCompletedDate && lastCompletedDate < yesterday) {
          set({ currentStreak: 0 });
        }
      },

      resetStreak: () => {
        set({
          currentStreak: 0,
          longestStreak: 0,
          lastCompletedDate: null,
        });
      },
    }),
    {
      name: 'bewet-streak',
    }
  )
);

// Streak level based on days
export type StreakLevel = 'none' | 'sprout' | 'growing' | 'thriving' | 'master';

export function getStreakLevel(streak: number): StreakLevel {
  if (streak === 0) return 'none';
  if (streak < 7) return 'sprout';
  if (streak < 14) return 'growing';
  if (streak < 30) return 'thriving';
  return 'master';
}

export function getStreakEmoji(level: StreakLevel): string {
  switch (level) {
    case 'none':
      return '🌰';
    case 'sprout':
      return '🌱';
    case 'growing':
      return '🌿';
    case 'thriving':
      return '🌳';
    case 'master':
      return '💎';
  }
}

export function getStreakTitle(level: StreakLevel, language: 'en' | 'ru'): string {
  const titles = {
    none: { en: 'Start your streak!', ru: 'Начни серию!' },
    sprout: { en: 'Sprout', ru: 'Росток' },
    growing: { en: 'Growing', ru: 'Растёт' },
    thriving: { en: 'Thriving', ru: 'Цветёт' },
    master: { en: 'Hydration Master', ru: 'Мастер гидратации' },
  };
  return titles[level][language];
}

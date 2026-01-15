import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from '@/types';

export type AchievementId =
  | 'first_glass'
  | 'first_goal'
  | 'streak_3'
  | 'streak_7'
  | 'streak_14'
  | 'streak_30'
  | 'early_bird'
  | 'night_owl'
  | 'perfectionist';

interface Achievement {
  id: AchievementId;
  emoji: string;
  name: { en: string; ru: string };
  description: { en: string; ru: string };
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_glass',
    emoji: '💧',
    name: { en: 'First Drop', ru: 'Первая капля' },
    description: { en: 'Log your first glass of water', ru: 'Запиши первый стакан воды' },
  },
  {
    id: 'first_goal',
    emoji: '🎯',
    name: { en: 'Goal Getter', ru: 'Цель достигнута' },
    description: { en: 'Reach your daily goal for the first time', ru: 'Достигни дневную цель впервые' },
  },
  {
    id: 'streak_3',
    emoji: '🔥',
    name: { en: 'Getting Started', ru: 'Начало пути' },
    description: { en: 'Reach a 3-day streak', ru: 'Серия 3 дня' },
  },
  {
    id: 'streak_7',
    emoji: '⭐',
    name: { en: 'Week Warrior', ru: 'Недельный воин' },
    description: { en: 'Reach a 7-day streak', ru: 'Серия 7 дней' },
  },
  {
    id: 'streak_14',
    emoji: '🌟',
    name: { en: 'Hydration Hero', ru: 'Герой гидратации' },
    description: { en: 'Reach a 14-day streak', ru: 'Серия 14 дней' },
  },
  {
    id: 'streak_30',
    emoji: '💎',
    name: { en: 'Hydration Master', ru: 'Мастер гидратации' },
    description: { en: 'Reach a 30-day streak', ru: 'Серия 30 дней' },
  },
  {
    id: 'early_bird',
    emoji: '🌅',
    name: { en: 'Early Bird', ru: 'Ранняя пташка' },
    description: { en: 'Log water before 7 AM', ru: 'Запиши воду до 7 утра' },
  },
  {
    id: 'night_owl',
    emoji: '🌙',
    name: { en: 'Night Owl', ru: 'Ночная сова' },
    description: { en: 'Log water after 10 PM', ru: 'Запиши воду после 22:00' },
  },
  {
    id: 'perfectionist',
    emoji: '💯',
    name: { en: 'Perfectionist', ru: 'Перфекционист' },
    description: { en: 'Hit exactly 100% of your goal', ru: 'Достигни ровно 100% цели' },
  },
];

interface AchievementsState {
  unlockedIds: AchievementId[];
  newlyUnlocked: AchievementId | null;
  unlock: (id: AchievementId) => boolean;
  clearNewlyUnlocked: () => void;
  isUnlocked: (id: AchievementId) => boolean;
}

export const useAchievementsStore = create<AchievementsState>()(
  persist(
    (set, get) => ({
      unlockedIds: [],
      newlyUnlocked: null,

      unlock: (id) => {
        const { unlockedIds } = get();
        if (unlockedIds.includes(id)) return false;

        set({
          unlockedIds: [...unlockedIds, id],
          newlyUnlocked: id,
        });
        return true;
      },

      clearNewlyUnlocked: () => {
        set({ newlyUnlocked: null });
      },

      isUnlocked: (id) => {
        return get().unlockedIds.includes(id);
      },
    }),
    {
      name: 'bewet-achievements',
    }
  )
);

export function getAchievement(id: AchievementId): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

export function getAchievementName(id: AchievementId, language: Language): string {
  const achievement = getAchievement(id);
  return achievement?.name[language] || '';
}

export function getAchievementDescription(id: AchievementId, language: Language): string {
  const achievement = getAchievement(id);
  return achievement?.description[language] || '';
}

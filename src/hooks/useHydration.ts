import { useState, useEffect, useCallback, useRef } from 'react';
import {
  addEntry,
  getEntriesByDate,
  getEntriesForDateRange,
  getToday,
  generateId,
  getDateDaysAgo,
} from '@/lib/storage';
import { checkMilestoneCrossed, getLoveNote } from '@/lib/loveNotes';
import { useStreakStore } from '@/lib/streak';
import { useAchievementsStore, type AchievementId } from '@/lib/achievements';
import { useI18n } from '@/lib/i18n';
import type { HydrationEntry, DailySummary } from '@/types';

export function useHydration(goal: number) {
  const [todayEntries, setTodayEntries] = useState<HydrationEntry[]>([]);
  const [weekData, setWeekData] = useState<DailySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [milestoneCrossed, setMilestoneCrossed] = useState<25 | 50 | 75 | 100 | null>(null);
  const [loveNoteMessage, setLoveNoteMessage] = useState<string>('');

  const { language } = useI18n();
  const { recordGoalCompleted, checkAndUpdateStreak, currentStreak } = useStreakStore();
  const { unlock: unlockAchievement, newlyUnlocked, clearNewlyUnlocked } = useAchievementsStore();
  const previousPercentageRef = useRef<number>(0);

  // Calculate today's total
  const todayTotal = todayEntries.reduce((sum, e) => sum + e.amount, 0);
  const progress = goal > 0 ? Math.min((todayTotal / goal) * 100, 100) : 0;
  const goalReached = todayTotal >= goal;

  // Load today's data
  const loadTodayData = useCallback(async () => {
    const entries = await getEntriesByDate(getToday());
    setTodayEntries(entries);
  }, []);

  // Load week data
  const loadWeekData = useCallback(async () => {
    const startDate = getDateDaysAgo(6);
    const endDate = getToday();
    const entries = await getEntriesForDateRange(startDate, endDate);

    // Group entries by date
    const grouped = new Map<string, HydrationEntry[]>();

    // Initialize all 7 days
    for (let i = 6; i >= 0; i--) {
      const date = getDateDaysAgo(i);
      grouped.set(date, []);
    }

    // Add entries to their dates
    for (const entry of entries) {
      const existing = grouped.get(entry.date) || [];
      existing.push(entry);
      grouped.set(entry.date, existing);
    }

    // Convert to DailySummary array
    const summaries: DailySummary[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = getDateDaysAgo(i);
      const dayEntries = grouped.get(date) || [];
      const total = dayEntries.reduce((sum, e) => sum + e.amount, 0);

      summaries.push({
        date,
        total,
        goal,
        entries: dayEntries.length,
        goalReached: total >= goal,
      });
    }

    setWeekData(summaries);
  }, [goal]);

  // Initial load
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await Promise.all([loadTodayData(), loadWeekData()]);
      setIsLoading(false);
      checkAndUpdateStreak();
    };
    load();
  }, [loadTodayData, loadWeekData, checkAndUpdateStreak]);

  // Track previous percentage for milestone detection
  useEffect(() => {
    previousPercentageRef.current = progress;
  }, [progress]);

  // Add water
  const addWater = useCallback(
    async (amount: number) => {
      if (amount <= 0) return;

      const entry: HydrationEntry = {
        id: generateId(),
        amount,
        timestamp: Date.now(),
        date: getToday(),
      };

      // Calculate new percentage before adding
      const oldPercentage = previousPercentageRef.current;
      const newTotal = todayTotal + amount;
      const newPercentage = goal > 0 ? Math.min((newTotal / goal) * 100, 100) : 0;

      await addEntry(entry);
      setTodayEntries((prev) => [...prev, entry]);

      // Check if a milestone was crossed
      const milestone = checkMilestoneCrossed(oldPercentage, newPercentage);
      if (milestone) {
        const message = getLoveNote(milestone, language);
        setMilestoneCrossed(milestone);
        setLoveNoteMessage(message);
      }

      // If goal reached (100%), record it for streak
      if (newPercentage >= 100 && oldPercentage < 100) {
        recordGoalCompleted();
        unlockAchievement('first_goal');
      }

      // Check for achievements
      checkAchievements(entry, todayEntries.length === 0, newPercentage);

      // Reload week data to update chart
      await loadWeekData();
    },
    [loadWeekData, todayTotal, goal, language, recordGoalCompleted, todayEntries.length, unlockAchievement]
  );

  // Check and unlock achievements
  const checkAchievements = useCallback(
    (entry: HydrationEntry, isFirstEntry: boolean, percentage: number) => {
      const hour = new Date(entry.timestamp).getHours();

      // First glass ever
      if (isFirstEntry) {
        unlockAchievement('first_glass');
      }

      // Early bird (before 7 AM)
      if (hour < 7) {
        unlockAchievement('early_bird');
      }

      // Night owl (after 10 PM)
      if (hour >= 22) {
        unlockAchievement('night_owl');
      }

      // Perfectionist (exactly 100%)
      if (Math.abs(percentage - 100) < 0.5) {
        unlockAchievement('perfectionist');
      }

      // Streak achievements - check after goal is recorded
      const streakAchievements: [number, AchievementId][] = [
        [3, 'streak_3'],
        [7, 'streak_7'],
        [14, 'streak_14'],
        [30, 'streak_30'],
      ];

      for (const [days, id] of streakAchievements) {
        if (currentStreak >= days) {
          unlockAchievement(id);
        }
      }
    },
    [unlockAchievement, currentStreak]
  );

  // Clear milestone notification
  const clearMilestone = useCallback(() => {
    setMilestoneCrossed(null);
    setLoveNoteMessage('');
  }, []);

  // Calculate weekly stats
  const weeklyAverage = Math.round(
    weekData.reduce((sum, d) => sum + d.total, 0) / weekData.length || 0
  );
  const daysAtGoal = weekData.filter((d) => d.goalReached).length;

  return {
    // Today
    todayEntries,
    todayTotal,
    progress,
    goalReached,
    // Week
    weekData,
    weeklyAverage,
    daysAtGoal,
    // Milestones
    milestoneCrossed,
    loveNoteMessage,
    clearMilestone,
    // Achievements
    newlyUnlockedAchievement: newlyUnlocked,
    clearNewlyUnlockedAchievement: clearNewlyUnlocked,
    // Actions
    addWater,
    refresh: loadTodayData,
    // State
    isLoading,
  };
}

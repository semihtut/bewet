import { useState, useEffect, useCallback } from 'react';
import {
  addEntry,
  getEntriesByDate,
  getEntriesForDateRange,
  getToday,
  generateId,
  getDateDaysAgo,
} from '@/lib/storage';
import type { HydrationEntry, DailySummary } from '@/types';

export function useHydration(goal: number) {
  const [todayEntries, setTodayEntries] = useState<HydrationEntry[]>([]);
  const [weekData, setWeekData] = useState<DailySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    };
    load();
  }, [loadTodayData, loadWeekData]);

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

      await addEntry(entry);
      setTodayEntries((prev) => [...prev, entry]);

      // Reload week data to update chart
      await loadWeekData();
    },
    [loadWeekData]
  );

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
    // Actions
    addWater,
    refresh: loadTodayData,
    // State
    isLoading,
  };
}

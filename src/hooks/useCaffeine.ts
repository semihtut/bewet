import { useState, useEffect, useCallback } from 'react';
import {
  addCaffeineEntry,
  getCaffeineEntriesByDate,
  getCaffeineEntriesForDateRange,
  deleteCaffeineEntry,
  updateCaffeineEntry,
  getToday,
  generateId,
  getDateDaysAgo,
} from '@/lib/storage';
import type { CaffeineEntry, CaffeineSettings } from '@/types';

interface UseCaffeineResult {
  // Today's data
  todayEntries: CaffeineEntry[];
  todayPenalty: number;
  todayTeaCount: number;
  todayCoffeeCount: number;
  // Week data
  weekPenalties: Map<string, number>;
  // Actions
  addTea: (note?: string) => Promise<void>;
  addCoffee: (note?: string) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  updateEntryNote: (id: string, note: string) => Promise<void>;
  // State
  isLoading: boolean;
}

export function useCaffeine(settings: CaffeineSettings): UseCaffeineResult {
  const [todayEntries, setTodayEntries] = useState<CaffeineEntry[]>([]);
  const [weekEntries, setWeekEntries] = useState<CaffeineEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate today's penalty
  const todayPenalty = todayEntries.reduce((sum, entry) => {
    const penaltyPerServing = entry.type === 'tea'
      ? settings.teaPenaltyMl
      : settings.coffeePenaltyMl;
    return sum + (entry.servings * penaltyPerServing);
  }, 0);

  // Count tea and coffee
  const todayTeaCount = todayEntries
    .filter(e => e.type === 'tea')
    .reduce((sum, e) => sum + e.servings, 0);

  const todayCoffeeCount = todayEntries
    .filter(e => e.type === 'coffee')
    .reduce((sum, e) => sum + e.servings, 0);

  // Calculate week penalties by date
  const weekPenalties = new Map<string, number>();
  for (const entry of weekEntries) {
    const penaltyPerServing = entry.type === 'tea'
      ? settings.teaPenaltyMl
      : settings.coffeePenaltyMl;
    const current = weekPenalties.get(entry.date) || 0;
    weekPenalties.set(entry.date, current + (entry.servings * penaltyPerServing));
  }

  // Load today's data
  const loadTodayData = useCallback(async () => {
    const entries = await getCaffeineEntriesByDate(getToday());
    setTodayEntries(entries);
  }, []);

  // Load week data
  const loadWeekData = useCallback(async () => {
    const startDate = getDateDaysAgo(6);
    const endDate = getToday();
    const entries = await getCaffeineEntriesForDateRange(startDate, endDate);
    setWeekEntries(entries);
  }, []);

  // Initial load
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await Promise.all([loadTodayData(), loadWeekData()]);
      setIsLoading(false);
    };
    load();
  }, [loadTodayData, loadWeekData]);

  // Add tea
  const addTea = useCallback(async (note?: string) => {
    if (!settings.enabled) return;

    const entry: CaffeineEntry = {
      id: generateId(),
      type: 'tea',
      servings: 1,
      note,
      timestamp: Date.now(),
      date: getToday(),
    };

    await addCaffeineEntry(entry);
    setTodayEntries(prev => [...prev, entry]);
    await loadWeekData();
  }, [settings.enabled, loadWeekData]);

  // Add coffee
  const addCoffee = useCallback(async (note?: string) => {
    if (!settings.enabled) return;

    const entry: CaffeineEntry = {
      id: generateId(),
      type: 'coffee',
      servings: 1,
      note,
      timestamp: Date.now(),
      date: getToday(),
    };

    await addCaffeineEntry(entry);
    setTodayEntries(prev => [...prev, entry]);
    await loadWeekData();
  }, [settings.enabled, loadWeekData]);

  // Delete entry
  const deleteEntryFn = useCallback(async (id: string) => {
    await deleteCaffeineEntry(id);
    setTodayEntries(prev => prev.filter(e => e.id !== id));
    await loadWeekData();
  }, [loadWeekData]);

  // Update entry note
  const updateEntryNote = useCallback(async (id: string, note: string) => {
    const entry = todayEntries.find(e => e.id === id);
    if (!entry) return;

    const updated = { ...entry, note };
    await updateCaffeineEntry(updated);
    setTodayEntries(prev => prev.map(e => e.id === id ? updated : e));
  }, [todayEntries]);

  return {
    todayEntries,
    todayPenalty,
    todayTeaCount,
    todayCoffeeCount,
    weekPenalties,
    addTea,
    addCoffee,
    deleteEntry: deleteEntryFn,
    updateEntryNote,
    isLoading,
  };
}

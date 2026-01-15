import { useState, useEffect, useCallback } from 'react';
import { getSettings, updateSettings } from '@/lib/storage';
import { useI18n } from '@/lib/i18n';
import type { AppSettings, Language } from '@/types';

const DEFAULT_SETTINGS: AppSettings = {
  dailyGoal: 2000,
  language: 'en',
  onboardingComplete: false,
  reminderSchedule: {
    enabled: false,
    startHour: 9,
    startMinute: 0,
    endHour: 22,
    endMinute: 0,
    intervalMinutes: 120,
  },
  caffeineSettings: {
    enabled: true,
    teaPenaltyMl: 250,
    coffeePenaltyMl: 250,
  },
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const { setLanguage } = useI18n();

  // Load settings
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const loaded = await getSettings();
      setSettings(loaded);
      setLanguage(loaded.language);
      setIsLoading(false);
    };
    load();
  }, [setLanguage]);

  // Update settings
  const update = useCallback(
    async (updates: Partial<AppSettings>) => {
      const updated = await updateSettings(updates);
      setSettings(updated);

      // Sync language with i18n store
      if (updates.language) {
        setLanguage(updates.language);
      }

      return updated;
    },
    [setLanguage]
  );

  // Convenience methods
  const setGoal = useCallback(
    (goal: number) => update({ dailyGoal: goal }),
    [update]
  );

  const setLang = useCallback(
    (language: Language) => update({ language }),
    [update]
  );

  const completeOnboarding = useCallback(
    () => update({ onboardingComplete: true }),
    [update]
  );

  return {
    settings,
    isLoading,
    update,
    setGoal,
    setLanguage: setLang,
    completeOnboarding,
  };
}

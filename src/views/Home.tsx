import { useState, useCallback } from 'react';
import { ProgressRing, Chip, Button, BottomSheet, Input } from '@/components/ui';
import { ReminderBanner } from '@/components/ReminderBanner';
import { WaterDrop } from '@/components/WaterDrop';
import { Confetti } from '@/components/Confetti';
import { StreakBadge } from '@/components/StreakBadge';
import { LoveNoteModal } from '@/components/LoveNoteModal';
import { AchievementModal } from '@/components/AchievementModal';
import { CaffeineEntriesSheet } from '@/components/CaffeineEntriesSheet';
import { useI18n, getGreetingKey, pluralizeCup } from '@/lib/i18n';
import { useReminderCheck } from '@/lib/reminders';
import { useHydration } from '@/hooks/useHydration';
import { useCaffeine } from '@/hooks/useCaffeine';
import { haptic } from '@/lib/utils';
import type { CaffeineSettings } from '@/types';

interface HomeProps {
  goal: number;
  caffeineSettings: CaffeineSettings;
}

const QUICK_AMOUNTS = [200, 300, 500];

// Default caffeine settings for migration
const DEFAULT_CAFFEINE_SETTINGS: CaffeineSettings = {
  enabled: true,
  teaPenaltyMl: 250,
  coffeePenaltyMl: 250,
};

export function Home({ goal, caffeineSettings }: HomeProps) {
  const { t, language } = useI18n();
  const reminder = useReminderCheck();

  // Ensure caffeine settings exist
  const caffSettings = caffeineSettings || DEFAULT_CAFFEINE_SETTINGS;

  const {
    todayTotal,
    addWater,
    milestoneCrossed,
    loveNoteMessage,
    clearMilestone,
    newlyUnlockedAchievement,
    clearNewlyUnlockedAchievement
  } = useHydration(goal);

  const {
    todayEntries: caffeineEntries,
    todayPenalty,
    todayTeaCount,
    todayCoffeeCount,
    addTea,
    addCoffee,
    deleteEntry: deleteCaffeineEntry,
    updateEntryNote,
  } = useCaffeine(caffSettings);

  // Calculate effective goal with penalty
  const effectiveGoal = goal + (caffSettings.enabled ? todayPenalty : 0);
  const goalReached = todayTotal >= effectiveGoal;

  const [showSheet, setShowSheet] = useState(false);
  const [showCaffeineSheet, setShowCaffeineSheet] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showDrop, setShowDrop] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wasGoalReached, setWasGoalReached] = useState(goalReached);

  // Handle quick add
  const handleQuickAdd = useCallback(
    async (amount: number) => {
      haptic(15);
      setShowDrop(true);

      await addWater(amount);

      // Check if goal was just reached
      if (!wasGoalReached && todayTotal + amount >= effectiveGoal) {
        setShowConfetti(true);
        setWasGoalReached(true);
      }
    },
    [addWater, wasGoalReached, todayTotal, effectiveGoal]
  );

  // Handle sheet add
  const handleSheetAdd = useCallback(async () => {
    const amount = selectedAmount || parseInt(customAmount) || 0;
    if (amount <= 0) return;

    haptic(15);
    setShowSheet(false);
    setShowDrop(true);

    await addWater(amount);

    // Check if goal was just reached
    if (!wasGoalReached && todayTotal + amount >= effectiveGoal) {
      setShowConfetti(true);
      setWasGoalReached(true);
    }

    // Reset
    setSelectedAmount(null);
    setCustomAmount('');
  }, [selectedAmount, customAmount, addWater, wasGoalReached, todayTotal, effectiveGoal]);

  // Handle caffeine add
  const handleAddCoffee = useCallback(async () => {
    haptic(10);
    await addCoffee();
  }, [addCoffee]);

  const handleAddTea = useCallback(async () => {
    haptic(10);
    await addTea();
  }, [addTea]);

  // Handle chip select in sheet
  const handleChipSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  // Greeting based on time
  const greeting = t(getGreetingKey());

  return (
    <div className="flex flex-col items-center px-4 pt-6 pb-24 animate-page-in">
      {/* Reminder Banner */}
      {reminder.isDue && (
        <ReminderBanner
          onSnooze={() => reminder.snooze()}
          onDismiss={() => reminder.dismiss()}
        />
      )}

      {/* Streak Badge */}
      <div className="mb-4">
        <StreakBadge />
      </div>

      {/* Greeting */}
      <h1 className="text-2xl font-semibold text-text-primary mb-6">
        {greeting} 💕
      </h1>

      {/* Progress Ring */}
      <div className="relative mb-6">
        <ProgressRing
          value={todayTotal}
          max={effectiveGoal}
          size={220}
          strokeWidth={14}
        />
        <WaterDrop show={showDrop} onComplete={() => setShowDrop(false)} />
      </div>

      {/* Penalty indicator (only show when there's a penalty) */}
      {caffSettings.enabled && todayPenalty > 0 && (
        <button
          onClick={() => setShowCaffeineSheet(true)}
          className="mb-4 px-4 py-2 bg-amber-50 rounded-full border border-amber-200 flex items-center gap-2"
        >
          <span className="text-amber-600">
            ☕ +{todayPenalty} {t('units.ml')}
          </span>
          <span className="text-amber-500 text-sm">
            ({todayCoffeeCount + todayTeaCount} {pluralizeCup(todayCoffeeCount + todayTeaCount, language)})
          </span>
          <span className="text-amber-400">▸</span>
        </button>
      )}

      {/* Goal reached message */}
      {goalReached && (
        <p className="text-success font-semibold text-lg mb-6 animate-celebrate">
          {t('home.goalReached')} 🎉
        </p>
      )}

      {/* Quick add buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        {QUICK_AMOUNTS.map((amount) => (
          <Chip
            key={amount}
            onClick={() => handleQuickAdd(amount)}
          >
            💧 {amount} {t('units.ml')}
          </Chip>
        ))}
      </div>

      {/* Caffeine buttons */}
      {caffSettings.enabled && (
        <div className="flex justify-center gap-3 mb-4">
          <Chip
            onClick={handleAddCoffee}
            className="bg-amber-50 border-amber-200 text-amber-700"
          >
            ☕ {t('caffeine.coffee')}
          </Chip>
          <Chip
            onClick={handleAddTea}
            className="bg-green-50 border-green-200 text-green-700"
          >
            🍵 {t('caffeine.tea')}
          </Chip>
        </div>
      )}

      {/* Custom add button */}
      <Button
        variant="secondary"
        onClick={() => setShowSheet(true)}
      >
        + {t('home.custom')}
      </Button>

      {/* Confetti celebration */}
      <Confetti show={showConfetti} />

      {/* Love Note Modal */}
      <LoveNoteModal
        isOpen={milestoneCrossed !== null}
        message={loveNoteMessage}
        milestone={milestoneCrossed || 25}
        onClose={clearMilestone}
      />

      {/* Achievement Modal */}
      <AchievementModal
        achievementId={newlyUnlockedAchievement}
        onClose={clearNewlyUnlockedAchievement}
      />

      {/* Caffeine Entries Sheet */}
      <CaffeineEntriesSheet
        isOpen={showCaffeineSheet}
        onClose={() => setShowCaffeineSheet(false)}
        entries={caffeineEntries}
        totalPenalty={todayPenalty}
        onDelete={deleteCaffeineEntry}
        onUpdateNote={updateEntryNote}
      />

      {/* Add Water Bottom Sheet */}
      <BottomSheet
        isOpen={showSheet}
        onClose={() => setShowSheet(false)}
        title={t('home.addWater')}
      >
        <div className="space-y-6">
          {/* Quick amounts */}
          <div className="flex flex-wrap justify-center gap-3">
            {QUICK_AMOUNTS.map((amount) => (
              <Chip
                key={amount}
                selected={selectedAmount === amount}
                onClick={() => handleChipSelect(amount)}
              >
                {amount} {t('units.ml')}
              </Chip>
            ))}
          </div>

          {/* Custom input */}
          <Input
            type="number"
            inputMode="numeric"
            placeholder="350"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedAmount(null);
            }}
            suffix={t('units.ml')}
            min={1}
            max={2000}
          />

          {/* Add button */}
          <Button
            fullWidth
            onClick={handleSheetAdd}
            disabled={!selectedAmount && !customAmount}
          >
            {t('home.add')}{' '}
            {selectedAmount || customAmount || '...'}{' '}
            {t('units.ml')}
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}

import { useState } from 'react';
import { GlassCard, Button, Toggle, Slider, BottomSheet, Input } from '@/components/ui';
import { useI18n } from '@/lib/i18n';
import { useReminderStore, generateScheduleTimes } from '@/lib/reminders';
import { exportAllData, resetAllData, downloadJSON } from '@/lib/storage';
import { formatTime, parseTime } from '@/lib/utils';
import type { AppSettings, Language } from '@/types';

interface SettingsProps {
  settings: AppSettings;
  onUpdate: (updates: Partial<AppSettings>) => Promise<AppSettings>;
}

export function Settings({ settings, onUpdate }: SettingsProps) {
  const { t, language, setLanguage } = useI18n();
  const { schedule, setSchedule } = useReminderStore();

  const [showGoalSheet, setShowGoalSheet] = useState(false);
  const [showRemindersSheet, setShowRemindersSheet] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [goalValue, setGoalValue] = useState(settings.dailyGoal);

  // Handle goal save
  const handleGoalSave = async () => {
    await onUpdate({ dailyGoal: goalValue });
    setShowGoalSheet(false);
  };

  // Handle language change
  const handleLanguageChange = async (lang: Language) => {
    setLanguage(lang);
    await onUpdate({ language: lang });
  };

  // Handle export
  const handleExport = async () => {
    const data = await exportAllData();
    const filename = `bewet-export-${new Date().toISOString().split('T')[0]}.json`;
    downloadJSON(data, filename);
  };

  // Handle reset
  const handleReset = async () => {
    await resetAllData();
    setShowResetConfirm(false);
    window.location.reload();
  };

  // Generate schedule times display
  const scheduleTimes = schedule.enabled ? generateScheduleTimes(schedule) : [];

  return (
    <div className="px-4 pt-6 pb-24 animate-page-in">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-text-primary mb-6">
        {t('settings.title')}
      </h1>

      {/* Goal & Preferences Section */}
      <p className="text-sm text-text-secondary uppercase tracking-wide mb-2 px-1">
        {t('settings.goalPrefs')}
      </p>
      <GlassCard className="mb-6">
        {/* Daily Goal */}
        <button
          onClick={() => setShowGoalSheet(true)}
          className="flex items-center justify-between w-full px-4 py-3 text-left"
        >
          <span className="text-text-primary">{t('settings.goal')}</span>
          <span className="text-pink-500 font-medium">
            {settings.dailyGoal.toLocaleString()} {t('units.ml')}
          </span>
        </button>

        <div className="h-px bg-pink-100/50" />

        {/* Language */}
        <div className="px-4 py-3">
          <span className="block text-text-primary mb-3">{t('settings.language')}</span>
          <div className="flex gap-2">
            <Button
              variant={language === 'en' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleLanguageChange('en')}
            >
              🇬🇧 English
            </Button>
            <Button
              variant={language === 'ru' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleLanguageChange('ru')}
            >
              🇷🇺 Русский
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Reminders Section */}
      <p className="text-sm text-text-secondary uppercase tracking-wide mb-2 px-1">
        {t('settings.reminders')}
      </p>
      <GlassCard className="mb-6">
        <button
          onClick={() => setShowRemindersSheet(true)}
          className="flex items-center justify-between w-full px-4 py-3 text-left"
        >
          <span className="text-text-primary">{t('settings.remindersSetup')}</span>
          <span className="text-text-secondary">
            {schedule.enabled ? `${scheduleTimes.length}×` : 'Off'}
          </span>
        </button>
      </GlassCard>

      {/* Data Section */}
      <p className="text-sm text-text-secondary uppercase tracking-wide mb-2 px-1">
        {t('settings.data')}
      </p>
      <GlassCard className="mb-8">
        {/* Export */}
        <button
          onClick={handleExport}
          className="flex items-center justify-between w-full px-4 py-3 text-left"
        >
          <span className="text-text-primary">{t('settings.export')}</span>
          <span className="text-text-muted">→</span>
        </button>

        <div className="h-px bg-pink-100/50" />

        {/* Reset */}
        <button
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center justify-between w-full px-4 py-3 text-left"
        >
          <span className="text-error">{t('settings.reset')}</span>
          <span className="text-text-muted">→</span>
        </button>
      </GlassCard>

      {/* Footer */}
      <p className="text-center text-sm text-text-secondary">
        {t('settings.madeWith')}
      </p>

      {/* Goal Sheet */}
      <BottomSheet
        isOpen={showGoalSheet}
        onClose={() => setShowGoalSheet(false)}
        title={t('settings.goal')}
      >
        <div className="space-y-6">
          <Slider
            value={goalValue}
            min={1000}
            max={4000}
            step={100}
            onChange={setGoalValue}
            valueLabel={t('units.ml')}
          />
          <Button fullWidth onClick={handleGoalSave}>
            {t('action.save')}
          </Button>
        </div>
      </BottomSheet>

      {/* Reminders Sheet */}
      <BottomSheet
        isOpen={showRemindersSheet}
        onClose={() => setShowRemindersSheet(false)}
        title={t('settings.remindersSetup')}
      >
        <div className="space-y-4">
          <Toggle
            checked={schedule.enabled}
            onChange={(enabled) => setSchedule({ enabled })}
            label={t('reminders.enable')}
          />

          {schedule.enabled && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="time"
                  label={t('reminders.startTime')}
                  value={formatTime(schedule.startHour, schedule.startMinute)}
                  onChange={(e) => {
                    const { hours, minutes } = parseTime(e.target.value);
                    setSchedule({ startHour: hours, startMinute: minutes });
                  }}
                />
                <Input
                  type="time"
                  label={t('reminders.endTime')}
                  value={formatTime(schedule.endHour, schedule.endMinute)}
                  onChange={(e) => {
                    const { hours, minutes } = parseTime(e.target.value);
                    setSchedule({ endHour: hours, endMinute: minutes });
                  }}
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  {t('reminders.interval')}
                </label>
                <div className="flex gap-2">
                  {[60, 90, 120, 180].map((mins) => (
                    <Button
                      key={mins}
                      variant={schedule.intervalMinutes === mins ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setSchedule({ intervalMinutes: mins })}
                    >
                      {mins / 60}h
                    </Button>
                  ))}
                </div>
              </div>

              {/* Schedule preview */}
              <div className="pt-2">
                <p className="text-sm text-text-secondary mb-2">
                  {t('reminders.schedule')}:
                </p>
                <p className="text-sm text-text-primary">
                  {scheduleTimes.join(' · ')}
                </p>
              </div>

              <p className="text-xs text-text-muted pt-2">
                {t('reminders.note')}
              </p>
            </>
          )}
        </div>
      </BottomSheet>

      {/* Reset Confirmation */}
      <BottomSheet
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title={t('settings.reset')}
      >
        <div className="space-y-4">
          <p className="text-text-secondary text-center">
            {t('settings.resetConfirm')}
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowResetConfirm(false)}
            >
              {t('action.cancel')}
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={handleReset}
            >
              {t('action.delete')}
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

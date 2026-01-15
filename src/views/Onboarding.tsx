import { useState } from 'react';
import { Button, Slider } from '@/components/ui';
import { A2HSCard } from '@/components/A2HSCard';
import { useI18n } from '@/lib/i18n';
import { shouldShowA2HS } from '@/lib/utils';
import type { Language } from '@/types';

interface OnboardingProps {
  onComplete: (goal: number, language: Language) => void;
}

type Step = 'welcome' | 'language' | 'a2hs';

export function Onboarding({ onComplete }: OnboardingProps) {
  const { t, language, setLanguage } = useI18n();
  const [step, setStep] = useState<Step>('welcome');
  const [goal, setGoal] = useState(2000);
  const [selectedLang, setSelectedLang] = useState<Language>(language);

  // Handle language selection
  const handleLanguageSelect = (lang: Language) => {
    setSelectedLang(lang);
    setLanguage(lang);
  };

  // Handle step navigation
  const handleContinue = () => {
    if (step === 'welcome') {
      setStep('language');
    } else if (step === 'language') {
      if (shouldShowA2HS()) {
        setStep('a2hs');
      } else {
        onComplete(goal, selectedLang);
      }
    } else {
      onComplete(goal, selectedLang);
    }
  };

  return (
    <div className="min-h-screen bg-base flex flex-col">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {step === 'welcome' && (
          <div className="w-full max-w-sm animate-page-in">
            {/* Water drop icon */}
            <div className="text-center mb-8">
              <span className="text-7xl">💧</span>
            </div>

            {/* Welcome text */}
            <h1 className="text-2xl font-bold text-text-primary text-center mb-2">
              {t('onboarding.welcome')}
            </h1>
            <p className="text-text-secondary text-center mb-10">
              {t('app.tagline')}
            </p>

            {/* Goal slider */}
            <div className="bg-white/70 backdrop-blur-xl rounded-md p-6 border border-pink-100/50 shadow-lg mb-8">
              <Slider
                label={t('onboarding.setGoal')}
                value={goal}
                min={1000}
                max={4000}
                step={100}
                onChange={setGoal}
                valueLabel={t('units.ml')}
              />
            </div>

            {/* Continue button */}
            <Button fullWidth onClick={handleContinue}>
              {t('action.continue')}
            </Button>
          </div>
        )}

        {step === 'language' && (
          <div className="w-full max-w-sm animate-page-in">
            {/* Title */}
            <h1 className="text-2xl font-bold text-text-primary text-center mb-8">
              {t('onboarding.chooseLanguage')}
            </h1>

            {/* Language options */}
            <div className="space-y-3 mb-8">
              <button
                onClick={() => handleLanguageSelect('en')}
                className={`
                  w-full p-4 rounded-md border-2 transition-all
                  flex items-center gap-4
                  ${
                    selectedLang === 'en'
                      ? 'border-pink-400 bg-pink-50'
                      : 'border-pink-100 bg-white/70 hover:border-pink-200'
                  }
                `}
              >
                <span className="text-3xl">🇬🇧</span>
                <span className="text-lg font-medium text-text-primary">
                  English
                </span>
              </button>

              <button
                onClick={() => handleLanguageSelect('ru')}
                className={`
                  w-full p-4 rounded-md border-2 transition-all
                  flex items-center gap-4
                  ${
                    selectedLang === 'ru'
                      ? 'border-pink-400 bg-pink-50'
                      : 'border-pink-100 bg-white/70 hover:border-pink-200'
                  }
                `}
              >
                <span className="text-3xl">🇷🇺</span>
                <span className="text-lg font-medium text-text-primary">
                  Русский
                </span>
              </button>
            </div>

            {/* Continue button */}
            <Button fullWidth onClick={handleContinue}>
              {t('action.continue')}
            </Button>
          </div>
        )}

        {step === 'a2hs' && (
          <div className="w-full max-w-sm animate-page-in">
            <A2HSCard onDismiss={handleContinue} />

            <div className="mt-6">
              <Button fullWidth onClick={handleContinue}>
                {t('onboarding.letsGo')}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Step indicator */}
      <div className="flex justify-center gap-2 pb-8">
        {(['welcome', 'language', 'a2hs'] as const).map((s, i) => (
          <div
            key={s}
            className={`
              w-2 h-2 rounded-full transition-all
              ${
                step === s
                  ? 'w-6 bg-pink-500'
                  : i < ['welcome', 'language', 'a2hs'].indexOf(step)
                  ? 'bg-pink-300'
                  : 'bg-pink-100'
              }
            `}
          />
        ))}
      </div>
    </div>
  );
}

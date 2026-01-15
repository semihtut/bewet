import { useState, useCallback } from 'react';
import { TabBar } from '@/components/ui';
import { Home } from '@/views/Home';
import { History } from '@/views/History';
import { Settings } from '@/views/Settings';
import { Onboarding } from '@/views/Onboarding';
import { useSettings } from '@/hooks/useSettings';
import type { TabId, Language } from '@/types';

export function App() {
  const { settings, isLoading, update } = useSettings();
  const [activeTab, setActiveTab] = useState<TabId>('home');

  // Handle onboarding completion
  const handleOnboardingComplete = useCallback(
    async (goal: number, language: Language) => {
      await update({
        dailyGoal: goal,
        language,
        onboardingComplete: true,
      });
    },
    [update]
  );

  // Handle settings update
  const handleSettingsUpdate = useCallback(
    async (updates: Parameters<typeof update>[0]) => {
      return update(updates);
    },
    [update]
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <div className="text-4xl animate-pulse">💧</div>
      </div>
    );
  }

  // Show onboarding if not complete
  if (!settings.onboardingComplete) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Render active view
  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <Home goal={settings.dailyGoal} />;
      case 'history':
        return <History goal={settings.dailyGoal} />;
      case 'settings':
        return <Settings settings={settings} onUpdate={handleSettingsUpdate} />;
      default:
        return <Home goal={settings.dailyGoal} />;
    }
  };

  return (
    <div className="min-h-screen bg-base">
      {/* Main content */}
      <main className="pb-20">{renderView()}</main>

      {/* Tab bar */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;

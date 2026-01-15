import { cn } from '@/lib/utils';
import { haptic } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';
import type { TabId } from '@/types';

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; labelKey: string; icon: string }[] = [
  { id: 'home', labelKey: 'nav.home', icon: '💧' },
  { id: 'history', labelKey: 'nav.history', icon: '📊' },
  { id: 'settings', labelKey: 'nav.settings', icon: '⚙️' },
];

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const { t } = useI18n();

  const handleTabClick = (tab: TabId) => {
    haptic();
    onTabChange(tab);
  };

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0',
        'bg-white/90 backdrop-blur-lg',
        'border-t border-pink-100/50',
        'safe-area-bottom'
      )}
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom), 8px)',
      }}
    >
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center',
                'w-20 h-14',
                'transition-all duration-200',
                'active:scale-95'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className={cn(
                  'text-xl mb-0.5 transition-transform duration-200',
                  isActive && 'scale-110'
                )}
              >
                {tab.icon}
              </span>
              <span
                className={cn(
                  'text-xs font-medium transition-colors duration-200',
                  isActive ? 'text-pink-500' : 'text-text-secondary'
                )}
              >
                {t(tab.labelKey)}
              </span>

              {/* Active indicator dot */}
              <div
                className={cn(
                  'absolute -bottom-1 w-1 h-1 rounded-full bg-pink-500',
                  'transition-all duration-200',
                  isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                )}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

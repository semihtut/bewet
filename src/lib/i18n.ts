import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from '@/types';

// Translation dictionary
type TranslationDict = {
  [key: string]: {
    en: string;
    ru: string;
  };
};

const translations: TranslationDict = {
  // App
  'app.name': { en: 'BeWet', ru: 'BeWet' },
  'app.tagline': { en: 'Stay hydrated, beautiful', ru: 'Пей воду, красавица' },

  // Onboarding
  'onboarding.welcome': { en: 'Welcome to BeWet', ru: 'Добро пожаловать в BeWet' },
  'onboarding.setGoal': { en: 'Set your daily goal', ru: 'Установи дневную цель' },
  'onboarding.chooseLanguage': { en: 'Choose language', ru: 'Выбери язык' },
  'onboarding.letsGo': { en: "Let's go!", ru: 'Начнём!' },

  // A2HS
  'a2hs.title': { en: 'Add to Home Screen', ru: 'Добавь на экран «Домой»' },
  'a2hs.subtitle': {
    en: 'For the best experience',
    ru: 'Для лучшего опыта',
  },
  'a2hs.step1': { en: 'Tap the Share button', ru: 'Нажми кнопку «Поделиться»' },
  'a2hs.step2': { en: 'Scroll down', ru: 'Прокрути вниз' },
  'a2hs.step3': {
    en: 'Tap "Add to Home Screen"',
    ru: 'Нажми «На экран Домой»',
  },
  'a2hs.step4': { en: 'Tap "Add"', ru: 'Нажми «Добавить»' },
  'a2hs.skip': { en: 'Skip', ru: 'Пропустить' },
  'a2hs.done': { en: "I've done it", ru: 'Готово' },

  // Greetings
  'greeting.morning': { en: 'Good morning', ru: 'Доброе утро' },
  'greeting.afternoon': { en: 'Good afternoon', ru: 'Добрый день' },
  'greeting.evening': { en: 'Good evening', ru: 'Добрый вечер' },

  // Home
  'home.of': { en: 'of', ru: 'из' },
  'home.goalReached': { en: 'Goal reached!', ru: 'Цель достигнута!' },
  'home.addWater': { en: 'Add water', ru: 'Добавить воду' },
  'home.custom': { en: 'Custom', ru: 'Своё' },
  'home.add': { en: 'Add', ru: 'Добавить' },
  'home.todayProgress': { en: "Today's progress", ru: 'Прогресс за сегодня' },

  // Reminder
  'reminder.title': { en: 'Time for water', ru: 'Время попить воды' },
  'reminder.subtitle': {
    en: 'Stay hydrated, my love',
    ru: 'Не забывай пить воду, родная',
  },
  'reminder.snooze': { en: 'Snooze 30m', ru: 'Отложить 30м' },
  'reminder.dismiss': { en: 'Dismiss', ru: 'Закрыть' },
  'reminder.overdue': { en: "You're a bit overdue", ru: 'Пора попить воды' },

  // History
  'history.title': { en: 'This Week', ru: 'Эта неделя' },
  'history.weeklyAvg': { en: 'Weekly average', ru: 'Среднее за неделю' },
  'history.daysAtGoal': { en: 'Days at goal', ru: 'Дней с целью' },
  'history.today': { en: 'Today', ru: 'Сегодня' },
  'history.yesterday': { en: 'Yesterday', ru: 'Вчера' },
  'history.noData': { en: 'No data yet', ru: 'Пока нет данных' },

  // Settings
  'settings.title': { en: 'Settings', ru: 'Настройки' },
  'settings.goalPrefs': { en: 'Goal & Preferences', ru: 'Цель и настройки' },
  'settings.goal': { en: 'Daily goal', ru: 'Дневная цель' },
  'settings.language': { en: 'Language', ru: 'Язык' },
  'settings.reminders': { en: 'Reminders', ru: 'Напоминания' },
  'settings.remindersSetup': {
    en: 'Reminder schedule',
    ru: 'Расписание напоминаний',
  },
  'settings.data': { en: 'Data', ru: 'Данные' },
  'settings.export': { en: 'Export data', ru: 'Экспорт данных' },
  'settings.reset': { en: 'Reset all data', ru: 'Сбросить данные' },
  'settings.resetConfirm': {
    en: 'Are you sure? This cannot be undone.',
    ru: 'Вы уверены? Это нельзя отменить.',
  },
  'settings.madeWith': { en: 'Made with 💕 for you', ru: 'Сделано с 💕 для тебя' },

  // Reminders settings
  'reminders.enable': { en: 'Enable reminders', ru: 'Включить напоминания' },
  'reminders.startTime': { en: 'Start time', ru: 'Начало' },
  'reminders.endTime': { en: 'End time', ru: 'Конец' },
  'reminders.interval': { en: 'Interval', ru: 'Интервал' },
  'reminders.everyHours': { en: 'Every {{hours}} hours', ru: 'Каждые {{hours}} ч.' },
  'reminders.note': {
    en: 'Reminders appear when you open the app',
    ru: 'Напоминания появятся при открытии',
  },
  'reminders.schedule': { en: 'Your schedule', ru: 'Расписание' },

  // Units
  'units.ml': { en: 'ml', ru: 'мл' },

  // Days
  'days.mon': { en: 'Mon', ru: 'Пн' },
  'days.tue': { en: 'Tue', ru: 'Вт' },
  'days.wed': { en: 'Wed', ru: 'Ср' },
  'days.thu': { en: 'Thu', ru: 'Чт' },
  'days.fri': { en: 'Fri', ru: 'Пт' },
  'days.sat': { en: 'Sat', ru: 'Сб' },
  'days.sun': { en: 'Sun', ru: 'Вс' },

  // Actions
  'action.continue': { en: 'Continue', ru: 'Продолжить' },
  'action.save': { en: 'Save', ru: 'Сохранить' },
  'action.cancel': { en: 'Cancel', ru: 'Отмена' },
  'action.confirm': { en: 'Confirm', ru: 'Подтвердить' },
  'action.back': { en: 'Back', ru: 'Назад' },
  'action.delete': { en: 'Delete', ru: 'Удалить' },

  // Navigation
  'nav.home': { en: 'Home', ru: 'Главная' },
  'nav.history': { en: 'History', ru: 'История' },
  'nav.settings': { en: 'Settings', ru: 'Настройки' },

  // Streak
  'streak.days': { en: 'days', ru: 'дн.' },
  'streak.none': { en: 'Start your streak!', ru: 'Начни серию!' },
  'streak.sprout': { en: 'Sprout', ru: 'Росток' },
  'streak.growing': { en: 'Growing', ru: 'Растёт' },
  'streak.thriving': { en: 'Thriving', ru: 'Цветёт' },
  'streak.master': { en: 'Hydration Master', ru: 'Мастер гидратации' },
  'streak.longest': { en: 'Longest streak', ru: 'Лучшая серия' },
  'streak.current': { en: 'Current streak', ru: 'Текущая серия' },
};

// i18n store interface
interface I18nStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

// Create i18n store with persistence
export const useI18n = create<I18nStore>()(
  persist(
    (set, get) => ({
      language: 'en',

      setLanguage: (language) => set({ language }),

      t: (key, params) => {
        const { language } = get();
        const translation = translations[key]?.[language] || key;

        if (!params) return translation;

        // Replace {{param}} with values
        return Object.entries(params).reduce(
          (str, [k, v]) => str.replace(`{{${k}}}`, String(v)),
          translation
        );
      },
    }),
    {
      name: 'bewet-language',
      partialize: (state) => ({ language: state.language }),
    }
  )
);

// Russian pluralization helper
export function ruPlural(
  n: number,
  one: string,
  few: string,
  many: string
): string {
  const mod10 = n % 10;
  const mod100 = n % 100;

  if (mod100 >= 11 && mod100 <= 19) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

// Pluralization helpers
export function pluralizeHour(n: number, lang: Language): string {
  if (lang === 'en') return n === 1 ? 'hour' : 'hours';
  return ruPlural(n, 'час', 'часа', 'часов');
}

export function pluralizeDay(n: number, lang: Language): string {
  if (lang === 'en') return n === 1 ? 'day' : 'days';
  return ruPlural(n, 'день', 'дня', 'дней');
}

// Get greeting based on time of day
export function getGreetingKey(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'greeting.morning';
  if (hour < 18) return 'greeting.afternoon';
  return 'greeting.evening';
}

// Get day name key from date
export function getDayKey(date: Date): string {
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return `days.${days[date.getDay()]}`;
}

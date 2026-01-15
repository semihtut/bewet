import { type ClassValue, clsx } from 'clsx';

// Simple clsx implementation since we're not using the full library
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

// Format number with locale
export function formatNumber(n: number): string {
  return n.toLocaleString();
}

// Format time from hours and minutes
export function formatTime(hours: number, minutes: number): string {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Parse time string to hours and minutes
export function parseTime(time: string): { hours: number; minutes: number } {
  const [hours, minutes] = time.split(':').map(Number);
  return { hours: hours || 0, minutes: minutes || 0 };
}

// Check if running as installed PWA
export function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

// Check if iOS Safari
export function isIOSSafari(): boolean {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS/.test(ua);
  return isIOS && isSafari;
}

// Should show A2HS prompt
export function shouldShowA2HS(): boolean {
  if (isStandalone()) return false;
  if (!isIOSSafari()) return false;

  const dismissed = localStorage.getItem('bewet-a2hs-dismissed');
  return !dismissed;
}

// Dismiss A2HS prompt
export function dismissA2HS(): void {
  localStorage.setItem('bewet-a2hs-dismissed', 'true');
}

// Trigger haptic feedback if available
export function haptic(duration = 10): void {
  if (navigator.vibrate) {
    navigator.vibrate(duration);
  }
}

// Clamp a number between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Get dates for last N days
export function getLastNDays(n: number): string[] {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

// Format date as relative (Today, Yesterday, or weekday)
export function formatRelativeDate(
  dateStr: string,
  t: (key: string) => string
): string {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (dateStr === today) return t('history.today');
  if (dateStr === yesterday) return t('history.yesterday');

  const date = new Date(dateStr);
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return t(`days.${days[date.getDay()]}`);
}

// clsx implementation for class merging
type ClassDictionary = Record<string, unknown>;
type ClassArray = ClassValue[];

function clsx(...inputs: ClassValue[]): string {
  let result = '';

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string') {
      result += (result ? ' ' : '') + input;
    } else if (Array.isArray(input)) {
      const inner = clsx(...(input as ClassArray));
      if (inner) {
        result += (result ? ' ' : '') + inner;
      }
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input as ClassDictionary)) {
        if (value) {
          result += (result ? ' ' : '') + key;
        }
      }
    }
  }

  return result;
}

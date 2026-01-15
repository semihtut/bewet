// Love notes that appear at different milestones
// Romantic messages from you to Arina 💕

import type { Language } from '@/types';

interface LoveNote {
  milestone: 25 | 50 | 75 | 100;
  messages: {
    en: string[];
    ru: string[];
  };
}

const LOVE_NOTES: LoveNote[] = [
  {
    milestone: 25,
    messages: {
      en: [
        "Great start, beautiful! 💕",
        "You're doing amazing! ✨",
        "Keep it up, my love! 🌸",
        "So proud of you! 💖",
      ],
      ru: [
        "Отличное начало, красавица! 💕",
        "Ты умничка! ✨",
        "Так держать, любимая! 🌸",
        "Горжусь тобой! 💖",
      ],
    },
  },
  {
    milestone: 50,
    messages: {
      en: [
        "Halfway there! You're a star! ⭐",
        "50%! Your skin will glow! ✨",
        "Amazing progress, my love! 💕",
        "You're unstoppable! 🚀",
      ],
      ru: [
        "Уже половина! Ты звезда! ⭐",
        "50%! Твоя кожа скажет спасибо! ✨",
        "Отличный прогресс, любимая! 💕",
        "Тебя не остановить! 🚀",
      ],
    },
  },
  {
    milestone: 75,
    messages: {
      en: [
        "Almost there, beautiful! 💪",
        "75%! You're glowing! ✨",
        "So close to the goal! 🎯",
        "I believe in you! 💕",
      ],
      ru: [
        "Почти у цели, красавица! 💪",
        "75%! Ты сияешь! ✨",
        "Ещё чуть-чуть! 🎯",
        "Я в тебя верю! 💕",
      ],
    },
  },
  {
    milestone: 100,
    messages: {
      en: [
        "You did it! I love you! 💕🎉",
        "100%! You're amazing! 🏆",
        "Goal reached! So proud! 💖✨",
        "Champion! I love you! 👑💕",
      ],
      ru: [
        "Ты справилась! Люблю тебя! 💕🎉",
        "100%! Ты невероятная! 🏆",
        "Цель достигнута! Горжусь! 💖✨",
        "Чемпионка! Люблю тебя! 👑💕",
      ],
    },
  },
];

// Get a random love note for a milestone
export function getLoveNote(milestone: 25 | 50 | 75 | 100, language: Language): string {
  const note = LOVE_NOTES.find((n) => n.milestone === milestone);
  if (!note) return '';

  const messages = note.messages[language];
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

// Get the next milestone to reach
export function getNextMilestone(percentage: number): 25 | 50 | 75 | 100 | null {
  if (percentage < 25) return 25;
  if (percentage < 50) return 50;
  if (percentage < 75) return 75;
  if (percentage < 100) return 100;
  return null;
}

// Check if a milestone was just crossed
export function checkMilestoneCrossed(
  oldPercentage: number,
  newPercentage: number
): 25 | 50 | 75 | 100 | null {
  const milestones: (25 | 50 | 75 | 100)[] = [25, 50, 75, 100];

  for (const milestone of milestones) {
    if (oldPercentage < milestone && newPercentage >= milestone) {
      return milestone;
    }
  }

  return null;
}

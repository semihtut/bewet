# 💧 BeWet

A private, offline-first water tracking PWA made with love.

## Features

- 📊 Track daily water intake with quick-add buttons
- 📈 7-day history chart
- ⏰ In-app reminder system (when you open the app)
- 🌍 English & Russian localization
- 📱 Installable PWA (Add to Home Screen)
- 🔒 100% private - all data stays on your device
- ✨ Beautiful animations and glassmorphism design

## Getting Started

### Prerequisites

- Node.js 18+ (or Bun)
- npm, pnpm, or bun

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Adding to iPhone Home Screen

1. Open the app in Safari
2. Tap the Share button (⎙)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

Now you can use it like a native app!

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- IndexedDB (via idb)
- Zustand (state management)
- Workbox (PWA/Service Worker)

## Project Structure

```
src/
├── components/     # UI components
│   └── ui/         # Base UI kit
├── views/          # Page components
├── hooks/          # Custom React hooks
├── lib/            # Utilities (storage, i18n, reminders)
└── types/          # TypeScript types
```

## Privacy

- No analytics
- No tracking
- No external API calls
- All data stored locally in IndexedDB
- Export your data anytime as JSON

---

Made with 💕
# bewet
# bewet

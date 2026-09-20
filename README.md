# LIFE//THREADS

A modern frontend-only digital life storytelling app that transforms ordinary receipts into explainable chapters, recurring threads, meaningful discoveries and a visual connection graph.

## Tagline

Your digital life is made of tiny moments. LIFE//THREADS turns those moments into connections, chapters, discoveries, and stories.

## Project overview

LIFE//THREADS is a client-side personal museum for digital life traces. It works from receipts like songs, searches, notes, purchases, places, photos, calendar events and messages, then turns them into:

- connection relationships with evidence-backed reasons
- lifecycle chapters derived from the actual dataset
- recurring thread patterns that repeat over time
- discovery cards with supporting evidence receipts
- a timeline and explorer for drilling into the archive
- a story mode that narrates the data without inventing facts

## Modern tech stack

- React 19
- Vite 8
- Tailwind CSS
- Recharts
- Lucide React
- Vitest
- localStorage and in-memory browser state only

## Feature map to the original spec

- Connection Engine: weighted, evidence-based graph edges in `src/analysis/connections.js`
- Chapters: cluster-based chapter detection in `src/analysis/chapters.js`
- Threads: recurring category patterns in `src/analysis/threads.js`
- Discoveries: evidence-backed pattern findings in `src/analysis/patterns.js`
- Timeline: chronological and filtered views across the dataset
- Explorer: locally searchable, filterable receipt archive
- Life Map: geographic and chapter-style overview screens
- Story Mode: narrative scene builder in `src/analysis/story.js`
- Receipt Drawer: detailed receipt investigation panel
- Search Command: keyboard-triggered search with `Ctrl+K`, `Cmd+K`, and `/`

## Architecture

Receipts
  ↓
Analysis Engine
  ↓
Hooks
  ↓
Pages
  ↓
Interactive UI

### Folder tree

```text
src/
├── analysis/
│   ├── chapters.js
│   ├── connections.js
│   ├── patterns.js
│   ├── story.js
│   └── threads.js
├── charts/
│   ├── ActivityChart.jsx
│   └── CategoryChart.jsx
├── components/
│   ├── AppShell.jsx
│   ├── ChapterCard.jsx
│   ├── ConnectionExplainer.jsx
│   ├── DiscoveryCard.jsx
│   ├── ReceiptCard.jsx
│   ├── ReceiptDrawer.jsx
│   ├── SearchCommand.jsx
│   ├── StatsPanel.jsx
│   └── ThreadCard.jsx
├── data/
│   ├── archiveData.js
│   ├── fallbackData.js
│   └── ...
├── graph/
│   ├── ConnectionGraph.jsx
│   └── layout.js
├── hooks/
│   ├── useLifeData.js
│   └── useReceiptSelection.js
├── pages/
│   ├── Chapters.jsx
│   ├── Discoveries.jsx
│   ├── Explorer.jsx
│   ├── GraphPage.jsx
│   ├── Intro.jsx
│   ├── LifeMap.jsx
│   ├── Overview.jsx
│   ├── StoryMode.jsx
│   ├── Threads.jsx
│   └── Timeline.jsx
├── utils/
│   ├── constants.js
│   └── dateUtils.js
├── App.jsx
├── index.css
├── main.jsx
└── ...
```

## Connection formula

The actual score is deterministic and uses evidence from the receipt data itself.

Connection Score =

time × 0.30
+ location × 0.25
+ keyword × 0.20
+ tag × 0.15
+ weekday × 0.10

The engine uses these real rules:

- temporal proximity within 90 minutes contributes to the time factor
- same location contributes a fixed location factor
- shared keywords contribute based on the overlap count
- shared tags contribute based on the tag overlap count
- same calendar day contributes only when the receipts are not already counted as temporally close

The final value is capped at 1.0 and rounded to two decimals for the visible connection score.

## Installation

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Lint

```bash
npx oxlint src
```

## Testing

```bash
npm test
```

## Frontend-only guarantee

This app is intentionally frontend-only:

- No backend
- No database
- No external API
- No API keys
- No authentication service
- No server-side processing
- No cloud dependency for core functionality

Everything runs in the browser. The analysis pipeline executes locally on the downloaded dataset.

## Data persistence

The app uses two browser-local data patterns:

- `localStorage` stores any browser-side persistence the app may use for saved UI state or archive preference metadata.
- browser memory handles the live in-memory analysis graph, current selection states and the derived chapter/thread/discovery data.

No remote persistence is required for the core product experience.

## Known limitations

- The archive is intentionally a local demo dataset and not a production personal data pipeline.
- The app is designed for static browser data rather than multi-user syncing.
- Chapter and thread detection is deterministic and works best when the dataset contains recurring evidence patterns.
- The product is optimized for explainability and local offline operation, not for enterprise-scale ingestion or server-side analytics.

---

## Quick start

1. Install dependencies.
2. Run the local Vite app.
3. Explore connections, chapters and discoveries.
4. Use the keyboard search and story mode to navigate the archive.

This project stays intentionally lightweight, offline-first, and grounded in actual dataset evidence.

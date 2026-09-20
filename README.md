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
- Responsive UI: mobile bottom navigation, wrapped filters, contained graph scrolling, and layouts tested from 375px through desktop widths
- Accessibility: full keyboard alternatives for graph data (arrow keys on SVG), focus trap containment in dialogs/command palettes, restored focus, labels, reduced-motion support, and descriptive SVG text.
- Performance: memoized analysis and graph layout, route-based page splitting, deferred Recharts chunks, debounced Explorer search, paginated Explorer, bounded graph rendering, and off-main-thread connection scoring via a Web Worker.

## Data sources & pipeline

Three real datasets are combined into one normalized `Receipt` shape (`src/data/archiveData.js`):

| Source | Rows used | Adapter | Receipt category |
| --- | --- | --- | --- |
| `Daily Household Transactions.csv` | 2,461 | `householdReceipt()` | `purchase` |
| `Augmented_IndiaTransactMultiFacet2024.*` | 10,267 | `indiaReceipt()` | `purchase` |
| Spotify streaming history | 149,860 raw plays | `musicReceipt()` | `music` |

**Spotify data prep** (`scripts/prepareSpotify.mjs`, run once with `npm run prepare:data`): the raw 149,860-row export is parsed and every aggregate stat (hourly/weekday activity, top artists and tracks, late-night share, skip rate, total listening hours) is computed from the **full, unfiltered** dataset. Only genuine listens (`ms_played >= 30s`) are kept as individually browsable "moments," and that set is further reduced to a deterministic, evenly-spaced sample of ~8,500 rows so the browser never has to load or filter 150k DOM-bound records. Nothing is invented — every kept row is a verbatim record from the source CSV; the sampling only decides which real rows are individually browsable versus folded into the aggregate stats. Output lands in `public/data/spotify-moments.json` and `public/data/spotify-insights.json`.

**Why a Worker:** combining all three sources produces ~21,000 receipts. Scoring every candidate pair for the connection graph is O(receipts × candidates) and briefly exceeded a second on the main thread once Spotify was added — enough to visibly freeze the UI on load. `src/workers/connectionsWorker.js` runs `buildConnections()` off the main thread; `useLifeData()` exposes `analysisReady` so the Graph and Discoveries pages can show a short "Analyzing…" state instead of blank or frozen content while it finishes.

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
│   ├── config.js
│   ├── connections.js
│   ├── index.js
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
│   ├── index.js
│   ├── PageHeader.jsx
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
│   ├── index.js
│   ├── useDisclosure.js
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
+ same day × 0.10

The engine uses these real rules:

- temporal proximity within 90 minutes contributes to the time factor
- same location contributes a fixed location factor
- shared keywords contribute based on the overlap count
- shared tags contribute based on the tag overlap count
- same calendar day contributes only when the receipts are not already counted as temporally close

The final value is capped at 1.0 and rounded to two decimals for the visible connection score.

Only connections with a final score of at least `0.18` are treated as edges (`computeConnection` returns `null` below the threshold, so the value is enforced in exactly one place). The threshold removes incidental single-factor matches while retaining relationships with meaningful combined evidence. The configurable source of truth is `src/analysis/config.js`.

## Installation

```bash
npm install
npm run prepare:data   # regenerates public/data/spotify-*.json from the raw CSV (optional — already committed)
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

Test coverage includes connections, chapters, threads, discoveries (`patterns.js`), and story generation (`story.js`), ensuring the core narrative engine remains deterministic and evidence-backed.

## Original spec checklist

Intro, overview, chapters, threads, connection graph, discoveries, timeline, explorer, receipt detail, life map, story mode, command search, responsive UI, accessibility, and performance are implemented as the corresponding routes/components above. Chapters, threads, discoveries, and Story Mode scenes cite receipt evidence from the local dataset; graph edges expose temporal, location, same-day, keyword, and shared-tag reasons. Story Mode also exports its current data-derived scene sequence as a local text file.

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
- **SearchCommand Focus Trap:** Uses a vanilla React implementation parsing the DOM inside its container rather than a heavy third-party library. While effective for simple dialogs, highly complex custom widgets might require more robust ARIA-aware focus management.

---

## Quick start

1. Install dependencies.
2. Run the local Vite app.
3. Explore connections, chapters and discoveries.
4. Use the keyboard search and story mode to navigate the archive.

This project stays intentionally lightweight, offline-first, and grounded in actual dataset evidence.

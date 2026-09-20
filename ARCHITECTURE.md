# LIFE//THREADS Architecture Guide

This file explains how the frontend analysis pipeline is organized and how to extend it without introducing a backend.

## Core flow

Receipts
  ↓
Analysis Engine
  ↓
Hooks
  ↓
Pages
  ↓
Interactive UI

## Adding a new chapter rule

1. Open `src/analysis/chapters.js`.
2. Add a new rule object to `CHAPTER_RULES`.
3. Provide:
   - an `id`
   - a human-readable `title`
   - a `match` predicate that checks real receipt fields
   - a `minCount` threshold
   - a `summaryFn` that describes the evidence
4. Ensure the rule filters actual receipts and uses the same date sorting as the current dataset.

Example:

```js
{
  id: "weekend-reset",
  title: "THE WEEKEND RESET",
  match: (r) => (r.tags || []).includes("rest"),
  minCount: 4,
  summaryFn: (list) => `${list.length} rest-focused moments appeared across the weekend.`,
}
```

## Adding a new thread rule

1. Open `src/analysis/threads.js`.
2. Add another object to `THREAD_DEFINITIONS`.
3. Define:
   - an `id`
   - a `title`
   - a `sequence` of categories
   - a `filter` to select receipts that belong to that pattern
4. Make sure the sequence repeats across multiple dates before it is reported.

Example:

```js
{
  id: "walk-thread",
  title: "THE WALK THREAD",
  sequence: ["music", "place", "photo"],
  filter: (r) => (r.tags || []).includes("walking"),
}
```

## Adding a new discovery rule

1. Open `src/analysis/patterns.js`.
2. Add a new block near other discovery detectors.
3. Always use real receipt evidence and include receipts in `evidence`.
4. Keep the discovery statement factual and non-psychological.

Example:

```js
const walkReceipts = receipts.filter((r) => (r.tags || []).includes("walking"));
if (walkReceipts.length >= 3) {
  discoveries.push({
    id: "walk-pattern",
    title: `${walkReceipts.length} walking moments clustered together`,
    detail: "The receipts repeatedly occurred in the same weekly window.",
    evidence: walkReceipts,
  });
}
```

## Adding a new connection factor

1. Open `src/analysis/connections.js`.
2. Extend the weight map and the factor breakdown object.
3. Add a matching condition using real receipt fields.
4. Keep the `reasons` list traceable to the data and ensure the score value reflects the factor contribution.

Example:

```js
const WEIGHTS = {
  temporal: 0.30,
  location: 0.25,
  keyword: 0.20,
  tag: 0.15,
  sameDay: 0.10,
  mood: 0.05,
};
```

Then add the corresponding condition and breakdown entry:

```js
if (a.mood === b.mood) {
  breakdown.mood = WEIGHTS.mood;
  reasons.push(`Both receipts share the same mood (${a.mood})`);
}
```

## Hook and state pattern

The app centralizes drawer/selection state in `src/hooks/useReceiptSelection.js` so pages do not duplicate receipt-opening logic.

This keeps:

- the drawer behavior consistent
- the graph, chapters and explorer aligned
- selection state easy to reason about

## Design principle

The product is intentionally explainable. Every visible chapter, thread, discovery and connection should be traceable to a real receipt or a repeat pattern in the dataset, never to fabricated narrative.

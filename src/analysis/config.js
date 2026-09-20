// Central configuration for deterministic analysis thresholds and scoring rules.

export const TEMPORAL_WINDOW_MIN = 90;
export const SCORE_THRESHOLD = 0.18;
export const MAX_CANDIDATES_PER_RECEIPT = 40;

export const CONNECTION_WEIGHTS = {
  temporal: 0.30,
  location: 0.25,
  keyword: 0.20,
  tag: 0.15,
  sameDay: 0.10,
};

export const CHAPTER_MIN_COUNTS = {
  midnightPhase: 6,
  cafeThreadChapter: 6,
  studySeason: 6,
  weekendEscape: 6,
  creativeStreak: 5,
  newRoutine: 6,
};

export const THREAD_MIN_RECEIPTS = 4;
export const THREAD_MIN_OCCURRENCES = 2;
// LIFE//THREADS — fallback dataset
// Fictional digital-life receipts, hand-authored with deliberate recurring
// patterns (a café thread, a midnight phase, a study thread, a weekend
// pattern, a travel arc) so the client-side analysis engine has real,
// data-based relationships to discover. No network requests are used.
// All records share a common shape so analysis code can treat them uniformly.

// category icons/colors are resolved in utils/constants.js by `category`

let _id = 0;
const nid = (prefix) => `${prefix}-${String(++_id).padStart(3, "0")}`;

const R = (category, fields) => ({
  id: nid(category),
  category, // music | movie | place | purchase | photo | message | search | event | note
  tags: [],
  location: null,
  ...fields,
});

export const receipts = [
  // ===================== THE CAFÉ THREAD =====================
  // Recurring chain: Music -> Café(place) -> Purchase -> Photo -> Note
  R("music", { title: "Midnight City", subtitle: "M83", date: "2025-01-10", time: "08:12", location: "Moonlight Café", tags: ["chill", "morning", "focus"], description: "Played on repeat while waiting for coffee." }),
  R("place", { title: "Moonlight Café", subtitle: "Coffee shop, MG Road", date: "2025-01-10", time: "08:20", location: "Moonlight Café", tags: ["coffee", "study spot"], description: "Checked in at the usual corner table." }),
  R("purchase", { title: "Cappuccino + Croissant", subtitle: "₹340", date: "2025-01-10", time: "08:24", location: "Moonlight Café", tags: ["coffee", "food"], description: "Regular order." }),
  R("photo", { title: "Rainy Window Table", subtitle: "IMG_1042", date: "2025-01-10", time: "08:41", location: "Moonlight Café", tags: ["coffee", "rain", "aesthetic"], description: "Rain streaking down the café window." }),
  R("note", { title: "Coffee thoughts", subtitle: "Personal note", date: "2025-01-10", time: "08:55", location: "Moonlight Café", tags: ["reflection", "coffee"], description: "Best ideas always show up over the first cup." }),

  R("music", { title: "Midnight City", subtitle: "M83", date: "2025-01-17", time: "08:05", location: "Moonlight Café", tags: ["chill", "morning", "focus"], description: "Same playlist, same table." }),
  R("place", { title: "Moonlight Café", subtitle: "Coffee shop, MG Road", date: "2025-01-17", time: "08:15", location: "Moonlight Café", tags: ["coffee", "study spot"], description: "Second Friday in a row here." }),
  R("purchase", { title: "Cappuccino + Croissant", subtitle: "₹340", date: "2025-01-17", time: "08:22", location: "Moonlight Café", tags: ["coffee", "food"], description: "Same order as last week." }),
  R("photo", { title: "Steam Off the Cup", subtitle: "IMG_1098", date: "2025-01-17", time: "08:30", location: "Moonlight Café", tags: ["coffee", "aesthetic"], description: "Close-up of steam rising." }),

  R("music", { title: "Midnight City", subtitle: "M83", date: "2025-01-24", time: "08:10", location: "Moonlight Café", tags: ["chill", "morning", "focus"], description: "Third Friday, same song." }),
  R("place", { title: "Moonlight Café", subtitle: "Coffee shop, MG Road", date: "2025-01-24", time: "08:18", location: "Moonlight Café", tags: ["coffee", "study spot"], description: "Consistent Friday ritual." }),
  R("purchase", { title: "Cappuccino + Croissant", subtitle: "₹360", date: "2025-01-24", time: "08:25", location: "Moonlight Café", tags: ["coffee", "food"], description: "Price went up slightly." }),
  R("note", { title: "Friday ritual", subtitle: "Personal note", date: "2025-01-24", time: "08:50", location: "Moonlight Café", tags: ["reflection", "coffee", "routine"], description: "Noticing this has become a Friday morning ritual." }),

  R("music", { title: "Midnight City", subtitle: "M83", date: "2025-01-31", time: "08:08", location: "Moonlight Café", tags: ["chill", "morning", "focus"], description: "Fourth week running." }),
  R("place", { title: "Moonlight Café", subtitle: "Coffee shop, MG Road", date: "2025-01-31", time: "08:16", location: "Moonlight Café", tags: ["coffee", "study spot"], description: "Table by the window, as usual." }),
  R("purchase", { title: "Cappuccino + Croissant", subtitle: "₹360", date: "2025-01-31", time: "08:23", location: "Moonlight Café", tags: ["coffee", "food"], description: "Ordered without checking the menu." }),
  R("photo", { title: "Notebook and Cup", subtitle: "IMG_1155", date: "2025-01-31", time: "08:33", location: "Moonlight Café", tags: ["coffee", "notebook"], description: "Flat-lay of notebook and coffee cup." }),

  // ===================== THE MIDNIGHT PHASE =====================
  // Cluster of activity between 11PM-2AM: search, music, note, event
  R("search", { title: "study places near me", subtitle: "Web search", date: "2025-02-03", time: "23:12", location: null, tags: ["study", "late-night"], description: "Looking for 24-hour study spaces." }),
  R("music", { title: "Weightless", subtitle: "Marconi Union", date: "2025-02-03", time: "23:20", location: "Home", tags: ["focus", "late-night", "ambient"], description: "Ambient focus music for late study." }),
  R("note", { title: "3am deadline panic", subtitle: "Personal note", date: "2025-02-03", time: "23:45", location: "Home", tags: ["study", "late-night", "stress"], description: "Assignment due at 9am, still not done." }),
  R("event", { title: "Submitted assignment", subtitle: "Calendar event", date: "2025-02-04", time: "00:40", location: "Home", tags: ["study", "deadline", "late-night"], description: "Finally submitted after a long night." }),

  R("search", { title: "how to stay awake studying", subtitle: "Web search", date: "2025-02-10", time: "23:30", location: null, tags: ["study", "late-night"], description: "Searched tips for late-night focus." }),
  R("music", { title: "Weightless", subtitle: "Marconi Union", date: "2025-02-10", time: "23:38", location: "Home", tags: ["focus", "late-night", "ambient"], description: "Same track as last week." }),
  R("note", { title: "Midterm prep", subtitle: "Personal note", date: "2025-02-10", time: "23:55", location: "Home", tags: ["study", "late-night"], description: "Outlining chapters for the midterm." }),

  R("search", { title: "caffeine vs sleep effects", subtitle: "Web search", date: "2025-02-17", time: "23:05", location: null, tags: ["study", "late-night", "health"], description: "Curious whether another coffee is worth it." }),
  R("music", { title: "Weightless", subtitle: "Marconi Union", date: "2025-02-17", time: "23:15", location: "Home", tags: ["focus", "late-night", "ambient"], description: "Third late-night session with this track." }),
  R("event", { title: "Group study call", subtitle: "Calendar event", date: "2025-02-17", time: "23:50", location: "Home", tags: ["study", "late-night", "group"], description: "Video call with classmates to review notes." }),
  R("note", { title: "Group call notes", subtitle: "Personal note", date: "2025-02-18", time: "01:10", location: "Home", tags: ["study", "late-night"], description: "Summary of what the group covered." }),

  R("search", { title: "best focus playlists 2025", subtitle: "Web search", date: "2025-02-24", time: "23:18", location: null, tags: ["study", "late-night", "music"], description: "Looking for new focus playlists." }),
  R("music", { title: "Experience", subtitle: "Ludovico Einaudi", date: "2025-02-24", time: "23:26", location: "Home", tags: ["focus", "late-night", "piano"], description: "New track discovered from the search." }),
  R("note", { title: "New playlist works well", subtitle: "Personal note", date: "2025-02-24", time: "23:50", location: "Home", tags: ["study", "late-night", "music"], description: "This playlist actually helped focus." }),

  // ===================== THE STUDY THREAD =====================
  // Search -> Music -> Note -> Event, daytime study sessions
  R("search", { title: "library seating availability", subtitle: "Web search", date: "2025-03-05", time: "14:02", location: null, tags: ["study", "library"], description: "Checking if the library has open seats." }),
  R("music", { title: "Experience", subtitle: "Ludovico Einaudi", date: "2025-03-05", time: "14:20", location: "Central Library", tags: ["focus", "piano", "study"], description: "Studying at the library with piano music." }),
  R("note", { title: "Chapter 4 summary", subtitle: "Personal note", date: "2025-03-05", time: "15:40", location: "Central Library", tags: ["study", "notes"], description: "Summarized chapter 4 for revision." }),
  R("event", { title: "Study group: Chapter 4", subtitle: "Calendar event", date: "2025-03-05", time: "16:00", location: "Central Library", tags: ["study", "group"], description: "Met classmates to discuss chapter 4." }),

  R("search", { title: "library seating availability", subtitle: "Web search", date: "2025-03-12", time: "13:55", location: null, tags: ["study", "library"], description: "Same search as last week." }),
  R("music", { title: "Experience", subtitle: "Ludovico Einaudi", date: "2025-03-12", time: "14:10", location: "Central Library", tags: ["focus", "piano", "study"], description: "Second library session this month." }),
  R("note", { title: "Chapter 5 summary", subtitle: "Personal note", date: "2025-03-12", time: "15:30", location: "Central Library", tags: ["study", "notes"], description: "Chapter 5 revision notes." }),
  R("event", { title: "Study group: Chapter 5", subtitle: "Calendar event", date: "2025-03-12", time: "16:05", location: "Central Library", tags: ["study", "group"], description: "Weekly recurring study group." }),

  R("search", { title: "practice questions unit 2", subtitle: "Web search", date: "2025-03-19", time: "14:00", location: null, tags: ["study", "exam"], description: "Looking for practice material." }),
  R("music", { title: "Experience", subtitle: "Ludovico Einaudi", date: "2025-03-19", time: "14:12", location: "Central Library", tags: ["focus", "piano", "study"], description: "Third library Wednesday in a row." }),
  R("event", { title: "Study group: Unit 2 review", subtitle: "Calendar event", date: "2025-03-19", time: "16:00", location: "Central Library", tags: ["study", "group"], description: "Group review before the exam." }),

  // ===================== WEEKEND ESCAPE / TRAVEL ARC =====================
  R("search", { title: "weekend trips near Coimbatore", subtitle: "Web search", date: "2025-04-02", time: "19:10", location: null, tags: ["travel", "planning"], description: "Started researching a short getaway." }),
  R("search", { title: "Ooty hotels budget", subtitle: "Web search", date: "2025-04-03", time: "20:05", location: null, tags: ["travel", "planning", "ooty"], description: "Comparing hotel prices." }),
  R("message", { title: "\"let's do Ooty this weekend\"", subtitle: "Chat with Aarav", date: "2025-04-04", time: "12:30", location: null, tags: ["travel", "friends", "ooty"], description: "Group chat confirming the trip." }),
  R("purchase", { title: "Bus tickets to Ooty", subtitle: "₹1,200", date: "2025-04-04", time: "18:45", location: null, tags: ["travel", "ooty"], description: "Booked overnight bus tickets." }),
  R("event", { title: "Ooty weekend trip", subtitle: "Calendar event", date: "2025-04-05", time: "06:00", location: "Ooty", tags: ["travel", "weekend", "ooty"], description: "Arrived in Ooty early morning." }),
  R("photo", { title: "Tea Gardens Sunrise", subtitle: "IMG_2201", date: "2025-04-05", time: "06:40", location: "Ooty", tags: ["travel", "nature", "ooty"], description: "Sunrise over the tea gardens." }),
  R("music", { title: "Solas", subtitle: "Ludovico Einaudi", date: "2025-04-05", time: "07:00", location: "Ooty", tags: ["travel", "calm"], description: "Playing during the morning walk." }),
  R("place", { title: "Botanical Garden, Ooty", subtitle: "Tourist spot", date: "2025-04-05", time: "10:15", location: "Ooty", tags: ["travel", "nature", "ooty"], description: "Visited the botanical garden." }),
  R("photo", { title: "Garden Path", subtitle: "IMG_2233", date: "2025-04-05", time: "10:40", location: "Ooty", tags: ["travel", "nature", "ooty"], description: "Path lined with flowers." }),
  R("purchase", { title: "Homemade chocolate", subtitle: "₹450", date: "2025-04-05", time: "11:20", location: "Ooty", tags: ["travel", "food", "ooty"], description: "Bought local chocolate as souvenirs." }),
  R("note", { title: "Ooty reflections", subtitle: "Personal note", date: "2025-04-05", time: "21:00", location: "Ooty", tags: ["travel", "reflection", "ooty"], description: "Best weekend trip in a while." }),

  // second travel-adjacent search spike before a later trip
  R("search", { title: "Munnar vs Ooty comparison", subtitle: "Web search", date: "2025-04-20", time: "20:00", location: null, tags: ["travel", "planning"], description: "Deciding on the next trip destination." }),
  R("search", { title: "Munnar homestay", subtitle: "Web search", date: "2025-04-21", time: "19:30", location: null, tags: ["travel", "planning", "munnar"], description: "Looking for a homestay in Munnar." }),
  R("message", { title: "\"Munnar in May?\"", subtitle: "Chat with Aarav", date: "2025-04-22", time: "13:00", location: null, tags: ["travel", "friends", "munnar"], description: "Proposing another trip." }),
  R("event", { title: "Munnar trip", subtitle: "Calendar event", date: "2025-05-10", time: "07:00", location: "Munnar", tags: ["travel", "weekend", "munnar"], description: "Second weekend getaway of the season." }),
  R("photo", { title: "Tea Estate Hills", subtitle: "IMG_2510", date: "2025-05-10", time: "09:20", location: "Munnar", tags: ["travel", "nature", "munnar"], description: "Rolling green tea estates." }),

  // ===================== CREATIVE STREAK =====================
  R("search", { title: "watercolor painting tutorials", subtitle: "Web search", date: "2025-06-01", time: "17:00", location: null, tags: ["creative", "art"], description: "Started exploring painting tutorials." }),
  R("purchase", { title: "Watercolor set", subtitle: "₹899", date: "2025-06-02", time: "12:15", location: null, tags: ["creative", "art", "supplies"], description: "Bought a beginner watercolor set." }),
  R("photo", { title: "First Painting Attempt", subtitle: "IMG_3001", date: "2025-06-03", time: "18:20", location: "Home", tags: ["creative", "art"], description: "First attempt at a landscape." }),
  R("music", { title: "River Flows in You", subtitle: "Yiruma", date: "2025-06-03", time: "18:00", location: "Home", tags: ["creative", "piano"], description: "Painting soundtrack." }),
  R("note", { title: "Painting journal #1", subtitle: "Personal note", date: "2025-06-03", time: "19:00", location: "Home", tags: ["creative", "reflection"], description: "First entry documenting the new hobby." }),

  R("photo", { title: "Sunset Study", subtitle: "IMG_3045", date: "2025-06-10", time: "18:15", location: "Home", tags: ["creative", "art"], description: "Second painting, a sunset study." }),
  R("music", { title: "River Flows in You", subtitle: "Yiruma", date: "2025-06-10", time: "18:00", location: "Home", tags: ["creative", "piano"], description: "Same painting soundtrack." }),
  R("note", { title: "Painting journal #2", subtitle: "Personal note", date: "2025-06-10", time: "19:10", location: "Home", tags: ["creative", "reflection"], description: "Noticing steady improvement." }),

  R("photo", { title: "Mountain Sketch", subtitle: "IMG_3102", date: "2025-06-17", time: "18:05", location: "Home", tags: ["creative", "art"], description: "Third weekly painting session." }),
  R("music", { title: "River Flows in You", subtitle: "Yiruma", date: "2025-06-17", time: "17:55", location: "Home", tags: ["creative", "piano"], description: "Third consecutive Tuesday with this track." }),
  R("purchase", { title: "Extra paintbrushes", subtitle: "₹250", date: "2025-06-17", time: "12:00", location: null, tags: ["creative", "art", "supplies"], description: "Needed finer brushes for detail work." }),

  // ===================== NEW ROUTINE (gym) =====================
  R("search", { title: "beginner gym routine", subtitle: "Web search", date: "2025-07-01", time: "07:00", location: null, tags: ["fitness", "routine"], description: "Looking for a starter workout plan." }),
  R("event", { title: "Gym session", subtitle: "Calendar event", date: "2025-07-02", time: "06:30", location: "FitZone Gym", tags: ["fitness", "morning", "routine"], description: "First gym session." }),
  R("music", { title: "Stronger", subtitle: "Kanye West", date: "2025-07-02", time: "06:35", location: "FitZone Gym", tags: ["fitness", "workout"], description: "Workout playlist opener." }),
  R("photo", { title: "Gym Selfie", subtitle: "IMG_4001", date: "2025-07-02", time: "07:20", location: "FitZone Gym", tags: ["fitness"], description: "Post-workout photo." }),

  R("event", { title: "Gym session", subtitle: "Calendar event", date: "2025-07-04", time: "06:30", location: "FitZone Gym", tags: ["fitness", "morning", "routine"], description: "Second session this week." }),
  R("music", { title: "Stronger", subtitle: "Kanye West", date: "2025-07-04", time: "06:32", location: "FitZone Gym", tags: ["fitness", "workout"], description: "Same opener." }),
  R("purchase", { title: "Protein shake", subtitle: "₹220", date: "2025-07-04", time: "07:30", location: "FitZone Gym", tags: ["fitness", "food"], description: "Post-workout shake." }),

  R("event", { title: "Gym session", subtitle: "Calendar event", date: "2025-07-07", time: "06:30", location: "FitZone Gym", tags: ["fitness", "morning", "routine"], description: "Third session, becoming a routine." }),
  R("music", { title: "Stronger", subtitle: "Kanye West", date: "2025-07-07", time: "06:33", location: "FitZone Gym", tags: ["fitness", "workout"], description: "Third Monday in a row." }),
  R("note", { title: "One week of gym", subtitle: "Personal note", date: "2025-07-07", time: "08:00", location: "Home", tags: ["fitness", "reflection", "routine"], description: "Reflecting on the first week of the new routine." }),
  R("purchase", { title: "Protein shake", subtitle: "₹220", date: "2025-07-07", time: "07:35", location: "FitZone Gym", tags: ["fitness", "food"], description: "Same order again." }),

  R("event", { title: "Gym session", subtitle: "Calendar event", date: "2025-07-11", time: "06:30", location: "FitZone Gym", tags: ["fitness", "morning", "routine"], description: "Fourth session of the routine." }),
  R("music", { title: "Stronger", subtitle: "Kanye West", date: "2025-07-11", time: "06:30", location: "FitZone Gym", tags: ["fitness", "workout"], description: "Fourth Friday in a row with this track." }),
  R("photo", { title: "Gym Progress Shot", subtitle: "IMG_4088", date: "2025-07-11", time: "07:25", location: "FitZone Gym", tags: ["fitness", "progress"], description: "Progress comparison photo." }),

  // ===================== MOVIES & ENTERTAINMENT SCATTER =====================
  R("movie", { title: "Interstellar", subtitle: "Rewatch", date: "2025-01-19", time: "21:00", location: "Home", tags: ["scifi", "weekend"], description: "Sunday evening rewatch." }),
  R("message", { title: "\"that ending still gets me\"", subtitle: "Chat with Meera", date: "2025-01-19", time: "23:40", location: null, tags: ["movie", "friends"], description: "Discussing the film after watching." }),
  R("movie", { title: "The Grand Budapest Hotel", subtitle: "First watch", date: "2025-02-22", time: "20:30", location: "Home", tags: ["comedy", "weekend"], description: "Watched on a Saturday night." }),
  R("movie", { title: "Spirited Away", subtitle: "Rewatch", date: "2025-03-29", time: "20:00", location: "Home", tags: ["animation", "weekend"], description: "Comfort rewatch on a Saturday." }),
  R("movie", { title: "Dune: Part Two", subtitle: "Cinema", date: "2025-05-17", time: "19:00", location: "PVR Cinemas", tags: ["scifi", "weekend", "cinema"], description: "Watched in theatres with friends." }),
  R("photo", { title: "Cinema Popcorn", subtitle: "IMG_2801", date: "2025-05-17", time: "18:50", location: "PVR Cinemas", tags: ["cinema", "food"], description: "Pre-movie snack photo." }),
  R("movie", { title: "Past Lives", subtitle: "First watch", date: "2025-08-09", time: "21:15", location: "Home", tags: ["drama", "weekend"], description: "Quiet Saturday night film." }),

  // ===================== MISC SCATTERED RECEIPTS (variety, weekday) =====================
  R("message", { title: "\"don't forget tomorrow\"", subtitle: "Chat with Mom", date: "2025-01-08", time: "20:15", location: null, tags: ["family", "reminder"], description: "Reminder about a family event." }),
  R("event", { title: "Cousin's birthday", subtitle: "Calendar event", date: "2025-01-09", time: "19:00", location: "Family Home", tags: ["family", "birthday"], description: "Attended the birthday dinner." }),
  R("photo", { title: "Birthday Cake", subtitle: "IMG_0950", date: "2025-01-09", time: "19:45", location: "Family Home", tags: ["family", "birthday"], description: "Cake-cutting moment." }),

  R("search", { title: "best budget headphones 2025", subtitle: "Web search", date: "2025-02-01", time: "16:00", location: null, tags: ["shopping", "tech"], description: "Researching new headphones." }),
  R("purchase", { title: "Wireless earbuds", subtitle: "₹2,499", date: "2025-02-02", time: "11:00", location: null, tags: ["shopping", "tech"], description: "Bought after comparing reviews." }),
  R("photo", { title: "Unboxing", subtitle: "IMG_1301", date: "2025-02-02", time: "17:30", location: "Home", tags: ["tech", "unboxing"], description: "Unboxing the new earbuds." }),

  R("message", { title: "\"can you send the notes?\"", subtitle: "Chat with Priya", date: "2025-03-06", time: "21:00", location: null, tags: ["study", "friends"], description: "Classmate asking for shared notes." }),
  R("note", { title: "Shared class notes", subtitle: "Personal note", date: "2025-03-06", time: "21:10", location: "Home", tags: ["study"], description: "Compiled notes to share." }),

  R("search", { title: "rainy day playlist", subtitle: "Web search", date: "2025-04-11", time: "15:30", location: null, tags: ["music", "mood"], description: "Weather-inspired search." }),
  R("music", { title: "Rains Again", subtitle: "Agnes Obel", date: "2025-04-11", time: "15:45", location: "Home", tags: ["mood", "rain"], description: "Fitting the rainy afternoon." }),
  R("photo", { title: "Rain on Balcony", subtitle: "IMG_2350", date: "2025-04-11", time: "16:00", location: "Home", tags: ["rain", "aesthetic"], description: "Raindrops on the balcony railing." }),

  R("event", { title: "Team offsite", subtitle: "Calendar event", date: "2025-05-30", time: "10:00", location: "Lakeside Resort", tags: ["work", "team"], description: "Annual team offsite event." }),
  R("photo", { title: "Offsite Group Photo", subtitle: "IMG_2900", date: "2025-05-30", time: "13:00", location: "Lakeside Resort", tags: ["work", "team"], description: "Group photo from the offsite." }),
  R("message", { title: "\"great offsite, thank you!\"", subtitle: "Team chat", date: "2025-05-30", time: "20:00", location: null, tags: ["work", "team"], description: "Thank-you message in the team chat." }),

  R("search", { title: "birthday gift ideas for dad", subtitle: "Web search", date: "2025-06-20", time: "13:00", location: null, tags: ["family", "shopping"], description: "Looking for gift ideas." }),
  R("purchase", { title: "Leather wallet", subtitle: "₹1,800", date: "2025-06-21", time: "14:20", location: null, tags: ["family", "shopping", "gift"], description: "Bought as a birthday gift." }),
  R("event", { title: "Dad's birthday", subtitle: "Calendar event", date: "2025-06-22", time: "19:00", location: "Family Home", tags: ["family", "birthday"], description: "Celebrated with family." }),
  R("photo", { title: "Family Dinner", subtitle: "IMG_3400", date: "2025-06-22", time: "20:00", location: "Family Home", tags: ["family", "birthday"], description: "Dinner table photo." }),

  R("note", { title: "Job application draft", subtitle: "Personal note", date: "2025-08-01", time: "11:00", location: "Home", tags: ["career"], description: "Drafting a cover letter." }),
  R("search", { title: "cover letter examples", subtitle: "Web search", date: "2025-08-01", time: "11:20", location: null, tags: ["career"], description: "Looking for examples to reference." }),
  R("message", { title: "\"good luck with the application!\"", subtitle: "Chat with Meera", date: "2025-08-02", time: "09:00", location: null, tags: ["career", "friends"], description: "Friend wishing luck." }),
  R("event", { title: "Interview: Product Role", subtitle: "Calendar event", date: "2025-08-15", time: "15:00", location: "Online", tags: ["career", "interview"], description: "First-round interview." }),
  R("note", { title: "Interview reflections", subtitle: "Personal note", date: "2025-08-15", time: "16:30", location: "Home", tags: ["career", "reflection"], description: "Thoughts right after the interview." }),

  R("music", { title: "Vienna", subtitle: "Billy Joel", date: "2025-09-05", time: "18:00", location: "Home", tags: ["evening", "classic"], description: "Evening wind-down song." }),
  R("photo", { title: "Golden Hour Balcony", subtitle: "IMG_4501", date: "2025-09-05", time: "18:20", location: "Home", tags: ["aesthetic", "evening"], description: "Golden hour light on the balcony." }),
  R("note", { title: "September check-in", subtitle: "Personal note", date: "2025-09-05", time: "18:40", location: "Home", tags: ["reflection"], description: "Monthly personal check-in note." }),
];

// Freeze so analysis code never mutates the source dataset by accident.
export const fallbackReceipts = Object.freeze(receipts.map((r) => Object.freeze(r)));

export default fallbackReceipts;

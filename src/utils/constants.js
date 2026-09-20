// Category colors are deliberately bright on the dark paper/card surfaces so
// the same value works for badge text (>= 4.5:1 WCAG AA on #111827) and for
// graph nodes / chart fills (>= 3:1 graphical contrast on #0f172a).
export const CATEGORY_META = {
  music: { label: "Music", icon: "Music2", color: "#e0784f", emoji: "🎵" },
  movie: { label: "Movies & Entertainment", icon: "Clapperboard", color: "#cf92ba", emoji: "🎬" },
  place: { label: "Places", icon: "MapPin", color: "#a8be7d", emoji: "📍" },
  purchase: { label: "Purchases", icon: "ShoppingBag", color: "#e2b160", emoji: "🛍" },
  photo: { label: "Photos", icon: "Camera", color: "#8fb3e6", emoji: "📷" },
  message: { label: "Messages", icon: "MessageCircle", color: "#6cc9bc", emoji: "✉" },
  search: { label: "Searches", icon: "Search", color: "#dfa75e", emoji: "🔎" },
  event: { label: "Events", icon: "CalendarDays", color: "#e28a7c", emoji: "📅" },
  note: { label: "Personal Notes", icon: "StickyNote", color: "#a0b5ec", emoji: "📝" },
};

export const CATEGORY_ORDER = Object.keys(CATEGORY_META);

export function categoryMeta(cat) {
  return CATEGORY_META[cat] || { label: cat, icon: "Circle", color: "#888", emoji: "•" };
}

export const CATEGORY_META = {
  music: { label: "Music", icon: "Music2", color: "#c1502e", emoji: "🎵" },
  movie: { label: "Movies & Entertainment", icon: "Clapperboard", color: "#5a3653", emoji: "🎬" },
  place: { label: "Places", icon: "MapPin", color: "#5c6b4d", emoji: "📍" },
  purchase: { label: "Purchases", icon: "ShoppingBag", color: "#c9a04d", emoji: "🛍" },
  photo: { label: "Photos", icon: "Camera", color: "#2f3a56", emoji: "📷" },
  message: { label: "Messages", icon: "MessageCircle", color: "#3a7d7a", emoji: "✉" },
  search: { label: "Searches", icon: "Search", color: "#7a5c3a", emoji: "🔎" },
  event: { label: "Events", icon: "CalendarDays", color: "#8a3a3a", emoji: "📅" },
  note: { label: "Personal Notes", icon: "StickyNote", color: "#3a5a8a", emoji: "📝" },
};

export const CATEGORY_ORDER = Object.keys(CATEGORY_META);

export function categoryMeta(cat) {
  return CATEGORY_META[cat] || { label: cat, icon: "Circle", color: "#888", emoji: "•" };
}

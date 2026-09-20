import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  GitBranch,
  Share2,
  Sparkles,
  Clock,
  Search,
  Map,
  Play,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/overview", label: "Overview", icon: LayoutDashboard },
  { to: "/chapters", label: "Chapters", icon: BookOpen },
  { to: "/threads", label: "Threads", icon: GitBranch },
  { to: "/graph", label: "Graph", icon: Share2 },
  { to: "/discoveries", label: "Discoveries", icon: Sparkles },
  { to: "/timeline", label: "Timeline", icon: Clock },
  { to: "/explorer", label: "Explorer", icon: Search },
  { to: "/map", label: "Life Map", icon: Map },
  { to: "/story", label: "Story Mode", icon: Play },
];

// Mobile shows a condensed subset to keep the bottom bar usable at 375px.
const MOBILE_NAV_ITEMS = [
  { to: "/overview", label: "Home", icon: LayoutDashboard },
  { to: "/threads", label: "Threads", icon: GitBranch },
  { to: "/discoveries", label: "Finds", icon: Sparkles },
  { to: "/explorer", label: "Search", icon: Search },
  { to: "/story", label: "Story", icon: Play },
];

function NavItem({ to, label, icon: Icon, vertical }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg font-mono text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-rust ${
          vertical ? "px-3 py-2.5" : "flex-col gap-0.5 py-2 px-1 text-[10px]"
        } ${isActive ? "bg-ink text-paper" : "text-ink/70 hover:bg-ink/10"}`
      }
    >
      <Icon size={vertical ? 17 : 19} aria-hidden="true" />
      <span className={vertical ? "" : "leading-none"}>{label}</span>
    </NavLink>
  );
}

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-paper text-ink flex">
      {/* Desktop sidebar */}
      <nav
        aria-label="Main navigation"
        className="hidden md:flex md:flex-col w-56 shrink-0 border-r border-ink/15 h-screen sticky top-0 p-4"
      >
        <div className="font-serif text-xl tracking-tight mb-6 px-1">
          LIFE<span className="text-rust">//</span>THREADS
        </div>
        <div className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} vertical />
          ))}
        </div>
        <div className="mt-auto pt-4 text-[10px] font-mono text-ink/40 px-1">
          100% client-side · no server
        </div>
      </nav>

      <main className="flex-1 min-w-0 pb-20 md:pb-0">{children}</main>

      {/* Mobile bottom nav */}
      <nav
        aria-label="Main navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 bg-receipt border-t border-ink/20 flex justify-around z-40"
      >
        {MOBILE_NAV_ITEMS.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>
    </div>
  );
}

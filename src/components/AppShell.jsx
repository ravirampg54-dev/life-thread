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
import InteractiveParticleBackground from "./InteractiveParticleBackground";

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
        `flex items-center gap-3 rounded-xl font-mono text-sm transition-all focus:outline-none focus:ring-2 focus:ring-rust ${
          vertical ? "px-3 py-2.5" : "relative flex-col gap-0.5 py-2.5 px-1.5 text-[10px]"
        } ${
          isActive
            ? "bg-gradient-to-r from-violet-500/30 to-cyan-400/20 text-white border border-violet-400/50 shadow-[0_0_16px_rgba(139,92,246,0.25)]"
            : "text-slate-300/80 hover:bg-white/5 hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {!vertical && (
            <span
              aria-hidden="true"
              className={`absolute top-0.5 h-0.5 w-6 rounded-full bg-gradient-to-r from-violet-400 to-cyan-300 transition-opacity ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
          <Icon size={vertical ? 17 : 19} aria-hidden="true" />
          <span className={vertical ? "" : "leading-none"}>{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function AppShell({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-paper text-ink">
      <InteractiveParticleBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,11,20,0.16),rgba(8,11,20,0.7)_50%,rgba(8,11,20,0.9))]" />

      <div className="relative z-10 flex min-h-screen">
        <nav
          aria-label="Main navigation"
          className="hidden md:flex md:w-64 md:shrink-0 md:flex-col md:h-screen md:sticky md:top-0 md:border-r md:border-white/10 md:bg-slate-950/75 md:p-4 md:backdrop-blur-xl"
        >
          <div className="mb-6 px-2 pt-2 font-serif text-2xl tracking-tight text-white">
            LIFE<span className="accent-text">//</span>THREADS
          </div>

          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <NavItem key={item.to} {...item} vertical />
            ))}
          </div>

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-3 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-300">
            100% client-side · no server
          </div>
        </nav>

        <main className="flex-1 min-w-0 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0">{children}</main>
      </div>

      <nav
        aria-label="Main navigation"
        className="relative z-20 md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around border-t border-white/10 bg-slate-950/90 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
      >
        {MOBILE_NAV_ITEMS.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>
    </div>
  );
}

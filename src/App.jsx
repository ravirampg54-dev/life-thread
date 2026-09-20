import { Suspense, lazy, useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell";
import SearchCommand from "./components/SearchCommand";
import { useLifeData } from "./hooks/useLifeData";

const Intro = lazy(() => import("./pages/Intro"));
const Overview = lazy(() => import("./pages/Overview"));
const Chapters = lazy(() => import("./pages/Chapters"));
const Threads = lazy(() => import("./pages/Threads"));
const GraphPage = lazy(() => import("./pages/GraphPage"));
const Discoveries = lazy(() => import("./pages/Discoveries"));
const Timeline = lazy(() => import("./pages/Timeline"));
const Explorer = lazy(() => import("./pages/Explorer"));
const LifeMap = lazy(() => import("./pages/LifeMap"));
const StoryMode = lazy(() => import("./pages/StoryMode"));

function Shell({ children, data, setSearchTarget }) {
  return (
    <AppShell>
      {children}
      <SearchCommand receipts={data.receipts} onSelectReceipt={setSearchTarget} />
    </AppShell>
  );
}

export default function App() {
  const data = useLifeData();
  const [searchTarget, setSearchTarget] = useState(null);

  const routeFallback = (
    <div className="flex min-h-screen items-center justify-center bg-paper text-ink">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-ink/50">Loading your life…</div>
    </div>
  );

  return (
    <HashRouter>
      <Suspense fallback={routeFallback}>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route
            path="/overview"
            element={
              <Shell data={data} setSearchTarget={setSearchTarget}>
                <Overview data={data} />
              </Shell>
            }
          />
          <Route
            path="/chapters"
            element={
              <Shell data={data} setSearchTarget={setSearchTarget}>
                <Chapters data={data} />
              </Shell>
            }
          />
          <Route
            path="/threads"
            element={
              <Shell data={data} setSearchTarget={setSearchTarget}>
                <Threads data={data} />
              </Shell>
            }
          />
          <Route
            path="/graph"
            element={
              <Shell data={data} setSearchTarget={setSearchTarget}>
                <GraphPage data={data} />
              </Shell>
            }
          />
          <Route
            path="/discoveries"
            element={
              <Shell data={data} setSearchTarget={setSearchTarget}>
                <Discoveries data={data} />
              </Shell>
            }
          />
          <Route
            path="/timeline"
            element={
              <Shell data={data} setSearchTarget={setSearchTarget}>
                <Timeline data={data} />
              </Shell>
            }
          />
          <Route
            path="/explorer"
            element={
              <Shell data={data} setSearchTarget={setSearchTarget}>
                <Explorer data={data} initialReceipt={searchTarget} onConsumeInitial={() => setSearchTarget(null)} />
              </Shell>
            }
          />
          <Route
            path="/map"
            element={
              <Shell data={data} setSearchTarget={setSearchTarget}>
                <LifeMap data={data} />
              </Shell>
            }
          />
          <Route path="/story" element={<StoryMode data={data} />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

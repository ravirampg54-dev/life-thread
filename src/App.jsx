import { useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell";
import SearchCommand from "./components/SearchCommand";
import Intro from "./pages/Intro";
import Overview from "./pages/Overview";
import Chapters from "./pages/Chapters";
import Threads from "./pages/Threads";
import GraphPage from "./pages/GraphPage";
import Discoveries from "./pages/Discoveries";
import Timeline from "./pages/Timeline";
import Explorer from "./pages/Explorer";
import LifeMap from "./pages/LifeMap";
import StoryMode from "./pages/StoryMode";
import { useLifeData } from "./hooks/useLifeData";

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

  return (
    <HashRouter>
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
    </HashRouter>
  );
}

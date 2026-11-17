import { useState } from "react";
import { GraduationCap, Menu, Scale, Target, X } from "lucide-react";
import Library from "./components/Library";
import Learn from "./components/Learn";
import Room, { type Result } from "./components/Room";
import Report from "./components/Report";
import Scoring from "./components/Scoring";
import type { Case, Mode, Persona } from "./data/types";

export interface Setup { c: Case; persona: Persona; mode: Mode }
type View = "cases" | "learn" | "scoring";

export default function App() {
  const [view, setView] = useState<View>("cases");
  const [setup, setSetup] = useState<Setup | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [run, setRun] = useState(0); // remounts the room on retry
  const [navOpen, setNavOpen] = useState(false);

  const go = (v: View) => { setView(v); setSetup(null); setResult(null); setNavOpen(false); };

  const nav = (
    <>
      <button className="mark" onClick={() => go("cases")} aria-label="CaseCraft, back to practice">
        <span className="mark-dot" aria-hidden>cc</span>CaseCraft
      </button>
      <nav className="nav" aria-label="Main">
        <button className={view === "cases" ? "on" : ""} aria-current={view === "cases" ? "page" : undefined} onClick={() => go("cases")}>
          <Target size={16} aria-hidden /> Practice
        </button>
        <button className={view === "learn" ? "on" : ""} aria-current={view === "learn" ? "page" : undefined} onClick={() => go("learn")}>
          <GraduationCap size={16} aria-hidden /> Learn
        </button>
        <button className={view === "scoring" ? "on" : ""} aria-current={view === "scoring" ? "page" : undefined} onClick={() => go("scoring")}>
          <Scale size={16} aria-hidden /> How scoring works
        </button>
      </nav>
      <p className="nav-foot">Demo build. The interviewer and scores are scripted.</p>
    </>
  );

  return (
    <div className="shell">
      <aside className="side">{nav}</aside>
      <header className="phone-bar">
        <button className="mark" onClick={() => go("cases")}><span className="mark-dot" aria-hidden>cc</span>CaseCraft</button>
        <button className="icon-btn" onClick={() => setNavOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
      </header>
      {navOpen && (
        <div className="phone-sheet" role="dialog" aria-modal="true" aria-label="Menu">
          <button className="icon-btn close" onClick={() => setNavOpen(false)} aria-label="Close menu"><X size={20} /></button>
          {nav}
        </div>
      )}

      <div className="canvas">
        {!setup && view === "cases" && <Library onStart={s => { setSetup(s); setResult(null); }} />}
        {!setup && view === "learn" && <Learn onStart={s => { setSetup(s); setResult(null); }} />}
        {!setup && view === "scoring" && <Scoring />}
        {setup && !result && <Room key={run} {...setup} onEnd={setResult} onQuit={() => go("cases")} />}
        {setup && result && (
          <Report {...setup} result={result} onRetry={() => { setResult(null); setRun(r => r + 1); }} onHome={() => go("cases")} />
        )}
      </div>
    </div>
  );
}

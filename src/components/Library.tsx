import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Clock, Hand, Lightbulb, List, Search, Timer, X } from "lucide-react";
import { CASES } from "../data/cases";
import { CATS, SKILLS, totalMins } from "../data/rubric";
import { CAT_ICON, LEVEL_ICON, PERSONAS } from "../data/ui";
import type { Case, CatId, Level, Mode, Persona } from "../data/types";
import type { Setup } from "../App";

const PICKS: { level: Level; blurb: string; ids: string[] }[] = [
  { level: "Easy", blurb: "Warm up. Short, well-known products.", ids: ["upi", "youtube", "tmay"] },
  { level: "Medium", blurb: "A standard interview round.", ids: ["ola-kids", "wau", "bigbasket"] },
  { level: "Hard", blurb: "Stretch cases with a twist.", ids: ["agent-tcr", "amz-pharmacy", "netflix"] },
];

export default function Library({ onStart }: { onStart: (s: Setup) => void }) {
  const [browse, setBrowse] = useState(false);
  const [cat, setCat] = useState<CatId | "all">("all");
  const [level, setLevel] = useState<Level | "all">("all");
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<Case | null>(null);

  const list = useMemo(() => CASES.filter(c =>
    (cat === "all" || c.cat === cat) && (level === "all" || c.level === level) &&
    (!q || (c.title + " " + c.prompt).toLowerCase().includes(q.toLowerCase()))
  ), [cat, level, q]);

  return (
    <main className="page">
      <header className="title-row">
        <h1 className="greeting">Pick a product case</h1>
        <p className="sub">Start with a recommended case for your level, or browse all {CASES.length}. Every case is timed and scored.</p>
      </header>

      <section className="picks" aria-label="Recommended cases">
        {PICKS.map(p => {
          const Lv = LEVEL_ICON[p.level];
          return (
            <div key={p.level} className={`pick-col pick-${p.level}`}>
              <h2><Lv size={18} aria-hidden /> {p.level}</h2>
              <p className="pick-blurb">{p.blurb}</p>
              <ul className="pick-list">
                {p.ids.map(id => {
                  const c = CASES.find(x => x.id === id)!, Icon = CAT_ICON[c.cat];
                  return (
                    <li key={id}>
                      <button className="pick" onClick={() => setPicked(c)}>
                        <span className="pick-kind"><Icon size={14} aria-hidden /> {CATS[c.cat].short} · {totalMins(c.cat)} min</span>
                        <span className="pick-title">{c.title}</span>
                        <span className="pick-q">{c.prompt}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </section>

      <section className="section">
        <button className="btn browse" onClick={() => setBrowse(b => !b)} aria-expanded={browse}>
          <List size={16} aria-hidden /> {browse ? "Hide all cases" : `Browse all ${CASES.length} cases`}
          <ChevronDown size={16} aria-hidden className={browse ? "flip" : ""} />
        </button>

        {browse && <>
          <div className="filters">
            <nav className="types" aria-label="Interview type">
              <button className="type" aria-pressed={cat === "all"} onClick={() => setCat("all")}>All <span className="n">{CASES.length}</span></button>
              {(Object.keys(CATS) as CatId[]).map(id => {
                const Icon = CAT_ICON[id];
                return (
                  <button key={id} className="type" aria-pressed={cat === id} onClick={() => setCat(id)}>
                    <Icon size={15} aria-hidden /> {CATS[id].short} <span className="n">{CASES.filter(c => c.cat === id).length}</span>
                  </button>
                );
              })}
            </nav>
            <div className="tools">
              <label className="search">
                <Search size={15} aria-hidden />
                <input type="search" placeholder="Search cases" value={q} onChange={e => setQ(e.target.value)} aria-label="Search cases" />
              </label>
              <div className="seg" role="group" aria-label="Difficulty">
                {(["all", "Easy", "Medium", "Hard"] as const).map(l => (
                  <button key={l} aria-pressed={level === l} onClick={() => setLevel(l)}>{l === "all" ? "Any level" : l}</button>
                ))}
              </div>
            </div>
          </div>

          <p className="count">{list.length} {list.length === 1 ? "case" : "cases"}</p>
          <ul className="cases">
            {list.map(c => {
              const Icon = CAT_ICON[c.cat], Lv = LEVEL_ICON[c.level];
              return (
                <li key={c.id}>
                  <button className="case" onClick={() => setPicked(c)}>
                    <span className="disc" aria-hidden><Icon size={17} /></span>
                    <span className="case-body">
                      <span className="case-title">{c.title}</span>
                      <span className="case-q">{c.prompt}</span>
                    </span>
                    <span className="case-meta">
                      <span><Clock size={14} aria-hidden /> {totalMins(c.cat)} min</span>
                      <span className={`lvl lvl-${c.level}`}><Lv size={15} aria-hidden /> {c.level}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {!list.length && <p className="empty">No cases match these filters. Try another type or level.</p>}
        </>}
      </section>

      {picked && <SetupSheet c={picked} onClose={() => setPicked(null)} onStart={onStart} />}
    </main>
  );
}

export function SetupSheet({ c, onClose, onStart }: { c: Case; onClose: () => void; onStart: (s: Setup) => void }) {
  const [persona, setPersona] = useState<Persona>("neutral");
  const [mode, setMode] = useState<Mode>("mock");
  const meta = CATS[c.cat];
  const Icon = CAT_ICON[c.cat];
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <div className="scrim" onClick={onClose}>
      <aside className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title" onClick={e => e.stopPropagation()}>
        <button className="icon-btn close" onClick={onClose} aria-label="Close"><X size={20} /></button>
        <p className="kind"><Icon size={15} aria-hidden /> {meta.name}</p>
        <h2 id="sheet-title">{c.title}</h2>
        <p className="prompt">{c.prompt}</p>

        <section className="block">
          <h3><Timer size={16} aria-hidden /> {totalMins(c.cat)} minutes, in {meta.stages.length} stages</h3>
          <ol className="plan">
            {meta.stages.map(s => (
              <li key={s.name} style={{ flexGrow: s.mins }}><span>{s.name}</span><span className="num">{s.mins} min</span></li>
            ))}
          </ol>
          <p className="skills">Scored on {meta.skills.map(s => SKILLS[s].toLowerCase()).join(", ")}.</p>
        </section>

        <section className="block">
          <h3>Your interviewer</h3>
          <div className="personas" role="radiogroup" aria-label="Interviewer">
            {PERSONAS.map(p => (
              <label key={p.id} className="persona">
                <input type="radio" name="persona" checked={persona === p.id} onChange={() => setPersona(p.id)} />
                <span className="p-head"><p.icon size={20} aria-hidden /> {p.name}</span>
                <span className="p-blurb">{p.blurb}</span>
                <Meter label="Pushback" n={p.pushback} />
                <Meter label="Patience" n={p.patience} />
                <span className="p-cut"><Hand size={14} aria-hidden /> {p.cutIn}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="block">
          <h3>Mode</h3>
          <div className="modes">
            <label className="mode">
              <input type="radio" name="mode" checked={mode === "mock"} onChange={() => setMode("mock")} />
              <span><b>Mock</b>Real conditions. Feedback only at the end.</span>
            </label>
            <label className="mode">
              <input type="radio" name="mode" checked={mode === "practice"} onChange={() => setMode("practice")} />
              <span><b><Lightbulb size={14} aria-hidden /> Practice</b>Hints allowed. Each one caps that skill at 3.</span>
            </label>
          </div>
        </section>

        <button className="btn primary wide" onClick={() => onStart({ c, persona, mode })}>Start the clock</button>
      </aside>
    </div>
  );
}

export function Meter({ label, n }: { label: string; n: number }) {
  return (
    <span className="meter" role="img" aria-label={`${label} ${n} of 5`}>
      <span className="m-label">{label}</span>
      <span className="m-track" aria-hidden>{[1, 2, 3, 4, 5].map(i => <i key={i} className={i <= n ? "on" : ""} />)}</span>
    </span>
  );
}

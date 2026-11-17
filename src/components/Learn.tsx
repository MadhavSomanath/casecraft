import { useState } from "react";
import { ArrowRight, CircleAlert, Sparkle, Timer } from "lucide-react";
import { CASES } from "../data/cases";
import { LEARN } from "../data/learn";
import { CATS, SKILLS, totalMins } from "../data/rubric";
import { CAT_ICON, LEVEL_ICON } from "../data/ui";
import type { Case, CatId } from "../data/types";
import type { Setup } from "../App";
import { SetupSheet } from "./Library";

export default function Learn({ onStart }: { onStart: (s: Setup) => void }) {
  const [cat, setCat] = useState<CatId>("design");
  const [picked, setPicked] = useState<Case | null>(null);
  const meta = CATS[cat], lesson = LEARN[cat], Icon = CAT_ICON[cat];
  const cases = lesson.try.map(id => CASES.find(c => c.id === id)!);

  return (
    <main className="page">
      <header className="title-row">
        <h1 className="greeting">Learn the interview types</h1>
        <p className="sub">How each type of PM case is run, stage by stage, what costs points, and three cases to practise on.</p>
      </header>

      <nav className="types" aria-label="Interview type">
        {(Object.keys(CATS) as CatId[]).map(id => {
          const I = CAT_ICON[id];
          return <button key={id} className="type" aria-pressed={cat === id} onClick={() => setCat(id)}><I size={15} aria-hidden /> {CATS[id].short}</button>;
        })}
      </nav>

      <div className="lesson">
        <section className="lesson-main">
          <p className="kind"><Icon size={15} aria-hidden /> {meta.name} · <Timer size={14} aria-hidden /> {totalMins(cat)} min</p>
          <h2 className="lesson-title">{lesson.tests}</h2>
          <ol className="steps">
            {meta.stages.map((s, i) => (
              <li key={s.name}>
                <span className="step-head"><b>{s.name}</b><span className="num muted">{s.mins} min</span></span>
                <span>{lesson.steps[i]}</span>
              </li>
            ))}
          </ol>
          <p className="skills">Scored on {meta.skills.map(s => SKILLS[s].toLowerCase()).join(", ")}.</p>
        </section>

        <aside className="lesson-side">
          <section className="side-card">
            <h3><CircleAlert size={16} aria-hidden /> What costs points</h3>
            <ul className="plain">{lesson.mistakes.map(m => <li key={m}>{m}</li>)}</ul>
          </section>
          <section className="side-card edge">
            <h3><Sparkle size={16} aria-hidden /> What makes it a 5</h3>
            <p>{lesson.edge}</p>
          </section>
          <section className="side-card">
            <h3>Practise it</h3>
            <ul className="mini-cases">
              {cases.map(c => {
                const Lv = LEVEL_ICON[c.level];
                return (
                  <li key={c.id}>
                    <button onClick={() => setPicked(c)}>
                      <span><b>{c.title}</b><small><Lv size={13} aria-hidden /> {c.level} · {totalMins(c.cat)} min</small></span>
                      <ArrowRight size={16} aria-hidden />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </aside>
      </div>

      {picked && <SetupSheet c={picked} onClose={() => setPicked(null)} onStart={onStart} />}
    </main>
  );
}

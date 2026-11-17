import { useState } from "react";
import { ChevronDown, Clock, Lightbulb, RotateCcw, ArrowLeft } from "lucide-react";
import { ANCHORS, CATS, SKILLS } from "../data/rubric";
import { CAT_ICON, persona as personaInfo } from "../data/ui";
import type { SkillId } from "../data/types";
import type { Setup } from "../App";
import { sampleScores } from "../demo";
import { fmt, type Result } from "./Room";

export default function Report({ c, persona, result, onRetry, onHome }: Setup & { result: Result; onRetry: () => void; onHome: () => void }) {
  const scores = sampleScores(c, result.transcript, result.hintStages);
  const pass = scores.every(s => s.score >= 3);
  const avg = scores.reduce((a, s) => a + s.score, 0) / scores.length;
  const weakest = [...scores].sort((a, b) => a.score - b.score)[0];
  const stages = CATS[c.cat].stages;
  const used = result.stageMs.reduce((a, b) => a + b, 0);
  const budget = stages.reduce((a, s) => a + s.mins, 0) * 60_000;
  const max = Math.max(...stages.map((s, i) => Math.max(s.mins * 60_000, result.stageMs[i] ?? 0)));
  const [open, setOpen] = useState<SkillId | null>(weakest?.skill ?? null);
  const Kind = CAT_ICON[c.cat];
  const P = personaInfo(persona);

  return (
    <main className="page report">
      <header className="title-row">
        <p className="kind"><Kind size={15} aria-hidden /> {CATS[c.cat].name} · with the {P.name.toLowerCase()} interviewer</p>
        <h1 className="greeting">{pass ? "Pass" : "Not yet"} on {c.title}</h1>
        <p className="sub">
          {pass ? "Every skill reached 3." : `${SKILLS[weakest.skill]} scored ${weakest.score}, under the bar of 3.`} Start with that one next time.
        </p>
      </header>

      <div className="strip">
        <div><span className="s-label">Average</span><span className="s-val num">{avg.toFixed(1)}<small> / 5</small></span></div>
        <div><span className="s-label">Time used</span><span className={`s-val num ${used > budget ? "neg" : ""}`}>{fmt(used)}<small> / {fmt(budget)}</small></span></div>
        <div><span className="s-label">Hints</span><span className="s-val num">{result.hintStages.length}</span></div>
        <div><span className="s-label">Skills at 3 or above</span><span className="s-val num">{scores.filter(s => s.score >= 3).length}<small> / {scores.length}</small></span></div>
      </div>
      <p className="notice">Demo: the scores are placeholders. The timing is real.</p>

      <section className="section">
        <h2>Scores, checked against examples</h2>
        <div className="scores">
          {scores.map(s => {
            const isOpen = open === s.skill;
            return (
              <article key={s.skill} className={`score ${isOpen ? "open" : ""} ${s.score < 3 ? "below" : ""}`}>
                <button className="score-head" onClick={() => setOpen(isOpen ? null : s.skill)} aria-expanded={isOpen}>
                  <span className="score-name">{SKILLS[s.skill]}</span>
                  <Dots n={s.score} />
                  <span className="score-n num">{s.score}</span>
                  <ChevronDown size={18} aria-hidden className="chev" />
                </button>
                <p className="quote">“{s.quote}”</p>
                {isOpen && (
                  <div className="calib">
                    <p><b>Why {s.score}.</b> {s.why}</p>
                    <p><b>Next time.</b> {s.next}</p>
                    <Ladder skill={s.skill} you={s.score} />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="section">
        <h2><Clock size={18} aria-hidden /> Where your time went</h2>
        <div className="timing">
          {stages.map((s, i) => {
            const t = s.mins * 60_000, a = result.stageMs[i] ?? 0;
            const hinted = result.hintStages.includes(i);
            return (
              <div key={s.name} className="t-row">
                <span className="t-name">{s.name}{hinted && <Lightbulb size={14} aria-label="hint used here" className="t-hint" />}</span>
                <span className="t-bars" aria-hidden>
                  <span className="t-target" style={{ width: `${(t / max) * 100}%` }} />
                  <span className={`t-actual ${a > t ? "over" : ""}`} style={{ width: `${(a / max) * 100}%` }} />
                </span>
                <span className="num t-num">{fmt(a)} <span className="muted">/ {s.mins}:00</span></span>
              </div>
            );
          })}
          <p className="legend"><span className="key target" /> Target <span className="key actual" /> You <span className="key over" /> Over target</p>
        </div>
      </section>

      <div className="actions">
        <button className="btn primary" onClick={onRetry}><RotateCcw size={15} aria-hidden /> Retry this case</button>
        <button className="btn" onClick={onHome}><ArrowLeft size={15} aria-hidden /> Pick another case</button>
      </div>
    </main>
  );
}

const near = (n: number) => (n <= 2 ? 1 : n === 3 ? 3 : 5);

export function Ladder({ skill, you }: { skill: SkillId; you?: number }) {
  return (
    <ol className="ladder" aria-label={`What 1, 3 and 5 look like for ${SKILLS[skill].toLowerCase()}`}>
      {([1, 3, 5] as const).map(lvl => {
        const mine = you !== undefined && near(you) === lvl;
        return (
          <li key={lvl} className={`rung ${mine ? "you" : ""}`}>
            <span className="rung-lvl num">{lvl}</span>
            <div>
              <p className="rung-bar">{ANCHORS[skill][lvl].bar}</p>
              <p className="rung-ex">{ANCHORS[skill][lvl].example}</p>
            </div>
            {mine && <span className="you-pin">You: {you}</span>}
          </li>
        );
      })}
    </ol>
  );
}

function Dots({ n }: { n: number }) {
  return <span className="dots5" aria-hidden>{[1, 2, 3, 4, 5].map(i => <i key={i} className={i <= n ? "on" : ""} />)}</span>;
}

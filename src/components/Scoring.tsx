import { useState } from "react";
import { SKILLS, CATS } from "../data/rubric";
import { CAT_ICON } from "../data/ui";
import type { CatId, SkillId } from "../data/types";
import { Ladder } from "./Report";

const RULES = [
  ["Every score needs a quote", "Each skill's score comes with a line from your own answer as evidence. No quote, no credit."],
  ["Pass means 3 everywhere", "A 3 is competent. You pass a case only when every skill it tests reaches 3."],
  ["5 is rare", "A 5 is specific to the case, tied to the goal, and says the trade-off out loud."],
  ["Hints cost you", "In practice mode, a hint caps the skill for that stage at 3."],
  ["Framework words alone score 1", "Naming a framework without the case's own facts gets no credit."],
] as const;

export default function Scoring() {
  const [skill, setSkill] = useState<SkillId>("clarify");
  const usedBy = (Object.keys(CATS) as CatId[]).filter(c => CATS[c].skills.includes(skill));

  return (
    <main className="page">
      <header className="title-row">
        <h1 className="greeting">How scoring works</h1>
        <p className="sub">Every answer is placed against the same examples of a 1, a 3 and a 5, so a score means the same thing every session.</p>
      </header>

      <ul className="rules">
        {RULES.map(([t, d]) => <li key={t}><b>{t}</b><span>{d}</span></li>)}
      </ul>

      <section className="section scoring">
        <h2>What each score looks like</h2>
        <div className="skill-pick" role="group" aria-label="Skill">
          {(Object.keys(SKILLS) as SkillId[]).map(s => (
            <button key={s} className="type" aria-pressed={skill === s} onClick={() => setSkill(s)}>{SKILLS[s]}</button>
          ))}
        </div>
        <div className="skill-panel">
          <p className="used-by">
            Tested in {usedBy.map((c, i) => { const I = CAT_ICON[c]; return <span key={c}>{i ? ", " : ""}<I size={14} aria-hidden /> {CATS[c].short}</span>; })}
          </p>
          <Ladder skill={skill} />
        </div>
      </section>
    </main>
  );
}

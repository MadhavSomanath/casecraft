import { useEffect, useRef, useState } from "react";
import { CircleCheck, CircleDot, Circle, Flag, Lightbulb, Mic, Pause, Play, Send } from "lucide-react";
import { ANCHORS, CATS, totalMins } from "../data/rubric";
import { CAT_ICON, persona as personaInfo } from "../data/ui";
import type { Msg } from "../data/types";
import type { Setup } from "../App";
import { opening, reply } from "../demo";

export interface Result { transcript: Msg[]; stageMs: number[]; hintStages: number[] }

export const fmt = (ms: number) => {
  const s = Math.round(Math.abs(ms) / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export default function Room({ c, persona, mode, onEnd, onQuit }: Setup & { onEnd: (r: Result) => void; onQuit: () => void }) {
  const stages = CATS[c.cat].stages;
  const budget = totalMins(c.cat) * 60_000;

  // Clock: time already banked per stage, plus the live segment since `since`.
  const [stage, setStage] = useState(0);
  const [banked, setBanked] = useState<number[]>(() => stages.map(() => 0));
  const [since, setSince] = useState<number | null>(() => Date.now());
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 250); return () => clearInterval(t); }, []);

  const stageMs = banked.map((b, i) => b + (i === stage && since ? now - since : 0));
  const used = stageMs.reduce((a, b) => a + b, 0);
  const left = budget - used;
  const running = since !== null;

  const bank = () => {
    const t = Date.now();
    if (since) setBanked(b => b.map((x, i) => (i === stage ? x + t - since : x)));
    return t;
  };
  const goTo = (i: number) => { const t = bank(); setStage(i); if (running) setSince(t); };
  const pause = () => { bank(); setSince(null); };
  const resume = () => setSince(Date.now());

  // Conversation
  const [msgs, setMsgs] = useState<Msg[]>(() => [{ who: "interviewer", text: opening(c), stage: 0, at: 0 }]);
  const [turn, setTurn] = useState(0);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [hints, setHints] = useState<number[]>([]);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs, typing]);

  const send = () => {
    const text = draft.trim();
    if (!text || typing) return;
    setDraft("");
    setMsgs(m => [...m, { who: "you", text, stage, at: used }]);
    setTyping(true);
    setTimeout(() => {
      const r = reply(c, persona, stage, turn, text);
      const next = r.advance ? stage + 1 : stage;
      if (r.advance) { goTo(next); setTurn(0); } else setTurn(t => t + 1);
      setMsgs(m => [...m, { who: "interviewer", text: r.text, stage: next, at: used }]);
      setTyping(false);
    }, 700);
  };

  const hint = () => {
    const skill = CATS[c.cat].skills[stage % CATS[c.cat].skills.length];
    setHints(h => [...h, stage]);
    setMsgs(m => [...m, { who: "interviewer", text: `Hint: ${ANCHORS[skill][5].bar}`, stage, at: used, }]);
  };

  const finish = () => {
    const final = stageMs;
    setSince(null);
    onEnd({ transcript: msgs, stageMs: final, hintStages: hints });
  };

  const mic = useDictation(t => setDraft(d => (d ? d + " " : "") + t));
  const tone = left < 0 ? "over" : left < 5 * 60_000 ? "low" : "ok";
  const P = personaInfo(persona);
  const Kind = CAT_ICON[c.cat];

  return (
    <main className="room">
      <aside className="rail">
        <div className={`clock ${tone}`} role="timer" aria-live="off" aria-label={`${fmt(left)} ${left < 0 ? "over time" : "left"}`}>
          <Ring frac={Math.min(used / budget, 1)} />
          <div className="clock-face">
            <span className="clock-big num">{left < 0 ? "+" : ""}{fmt(left)}</span>
            <span className="clock-sub">{left < 0 ? "over time" : `left of ${fmt(budget)}`}</span>
          </div>
        </div>
        <div className="clock-ctl">
          {running
            ? <button className="btn" onClick={pause}><Pause size={15} aria-hidden /> Pause</button>
            : <button className="btn primary" onClick={resume}><Play size={15} aria-hidden /> Resume</button>}
          <button className="btn" onClick={finish}><Flag size={15} aria-hidden /> Finish</button>
        </div>

        <ol className="stages" aria-label="Stages">
          {stages.map((s, i) => {
            const target = s.mins * 60_000;
            const frac = stageMs[i] / target;
            const state = frac > 1 ? "over" : frac > 0.8 ? "low" : "ok";
            const St = i < stage ? CircleCheck : i === stage ? CircleDot : Circle;
            return (
              <li key={s.name} className={i === stage ? "on" : i < stage ? "done" : ""}>
                <button onClick={() => goTo(i)} aria-current={i === stage ? "step" : undefined}>
                  <span className="st-row">
                    <span className="st-name"><St size={16} aria-hidden className="st-icon" />{s.name}</span>
                    <span className="num st-t">{stageMs[i] ? fmt(stageMs[i]) : "–"} / {s.mins}:00</span>
                  </span>
                  <span className="bar"><span className={`fill ${state}`} style={{ width: `${Math.min(frac, 1) * 100}%` }} /></span>
                </button>
              </li>
            );
          })}
        </ol>
        <button className="link" onClick={onQuit}>Leave without scoring</button>
      </aside>

      <section className="convo">
        <div className="convo-head">
          <div>
            <p className="kind"><Kind size={15} aria-hidden /> {CATS[c.cat].name}</p>
            <h1>{c.title}</h1>
          </div>
          <div className="who-chip">
            <span className="disc" aria-hidden><P.icon size={18} /></span>
            <span><b>{P.name} interviewer</b><small>{mode === "mock" ? "Mock" : "Practice"}{hints.length ? ` · ${hints.length} hint${hints.length > 1 ? "s" : ""} used` : ""}</small></span>
          </div>
        </div>

        <div className="log" aria-live="polite">
          {msgs.map((m, i) => (
            <div key={i} className={`msg ${m.who}`}>
              {m.who === "interviewer" && (
                <span className="msg-who"><P.icon size={14} aria-hidden /> {P.name} · {stages[m.stage].name}</span>
              )}
              <p>{m.text}</p>
            </div>
          ))}
          {typing && <div className="msg interviewer"><p className="dots" aria-label="Interviewer is typing"><i /><i /><i /></p></div>}
          <div ref={end} />
        </div>

        <form className="composer" onSubmit={e => { e.preventDefault(); send(); }}>
          <textarea
            value={draft} onChange={e => setDraft(e.target.value)} rows={3}
            placeholder={running ? "Answer out loud with the mic, or type…" : "Clock is paused"}
            disabled={!running}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            aria-label="Your answer"
          />
          <div className="composer-row">
            {mic.supported && (
              <button type="button" className={`btn mic ${mic.on ? "live" : ""}`} onClick={mic.toggle} aria-pressed={mic.on}>
                <Mic size={15} aria-hidden />{mic.on ? "Listening…" : "Speak"}
              </button>
            )}
            {mode === "practice" && (
              <button type="button" className="btn" onClick={hint} title="Using a hint caps this stage's skill at 3">
                <Lightbulb size={15} aria-hidden /> Hint
              </button>
            )}
            <span className="grow" />
            <button className="btn primary" disabled={!draft.trim() || typing || !running}><Send size={15} aria-hidden /> Send</button>
          </div>
        </form>
      </section>
    </main>
  );
}

function Ring({ frac }: { frac: number }) {
  const r = 52, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 120 120" className="ring" aria-hidden>
      <circle cx="60" cy="60" r={r} className="ring-bg" />
      <circle cx="60" cy="60" r={r} className="ring-fg" strokeDasharray={c} strokeDashoffset={c * (1 - frac)} />
    </svg>
  );
}

// Browser speech-to-text (Chrome, Edge, Safari). Hidden where unsupported.
function useDictation(onText: (t: string) => void) {
  const [on, setOn] = useState(false);
  const rec = useRef<any>(null);
  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const toggle = () => {
    if (on) { rec.current?.stop(); return; }
    const r = new SR();
    r.continuous = true; r.interimResults = false; r.lang = "en-IN";
    r.onresult = (e: any) => onText(Array.from(e.results as ArrayLike<any>).slice(e.resultIndex).map((x: any) => x[0].transcript).join(" "));
    r.onend = () => setOn(false);
    r.start(); rec.current = r; setOn(true);
  };
  return { supported: !!SR, on, toggle };
}

// Demo-only interviewer and scorer. In v1 both are replaced by Claude calls through a small server.
import { CATS } from "./data/rubric";
import type { Case, Msg, Persona, SkillId } from "./data/types";

const NUDGE: Record<string, string> = {
  "Clarify": "Fair. Assume metro cities in India and that the goal is adoption in year one. What's your plan?",
  "Users": "Who exactly are you building for? Pick one.",
  "Pain points": "What's the single biggest problem for that user?",
  "Solutions": "Give me a few ways to solve it. Then pick one.",
  "Metrics": "How would you know it worked?",
  "Close": "We're nearly out of time. Give me your recommendation in 30 seconds.",
};

const PUSH: Record<Persona, string[]> = {
  neutral: ["Go on.", "Why that one?", "Okay. Keep going."],
  skeptical: ["I'm not convinced. Why would they switch?", "That sounds generic. Make it specific to this case.", "What's the evidence for that?"],
  friendly: ["Nice, take your time. What else?", "That makes sense. Can you go a bit deeper?", "Good start. Keep going."],
};

export function opening(c: Case): string {
  return `${c.prompt} Take a moment to think, and walk me through your approach whenever you're ready.`;
}

/** Returns the interviewer's next line and whether to move to the next stage. */
export function reply(c: Case, persona: Persona, stage: number, turnInStage: number, said: string): { text: string; advance: boolean } {
  const stages = CATS[c.cat].stages;
  if (stage === 0 && said.includes("?")) {
    return { text: c.hidden && c.cat === "rca" ? "Good question. It's real, not a tracking issue. What would you check next?" : NUDGE["Clarify"], advance: false };
  }
  if (turnInStage >= 1 && stage < stages.length - 1) {
    const next = stages[stage + 1].name;
    return { text: NUDGE[next] ?? `Let's move to ${next.toLowerCase()}.`, advance: true };
  }
  if (stage === stages.length - 1) return { text: "Thanks, that's time. Let's look at how you did.", advance: false };
  const pool = PUSH[persona];
  return { text: pool[(stage + turnInStage) % pool.length], advance: false };
}

export interface SkillScore { skill: SkillId; score: 1 | 2 | 3 | 4 | 5; quote: string; why: string; next: string }

/** Sample scores so the report screen can be shown. Real scoring comes from Claude against ANCHORS. */
export function sampleScores(c: Case, transcript: Msg[], hintStages: number[]): SkillScore[] {
  const mine = transcript.filter(m => m.who === "you");
  const pattern = [3, 4, 2, 3, 4, 2] as const;
  return CATS[c.cat].skills.map((skill, i) => {
    const m = mine[i % Math.max(mine.length, 1)];
    const raw = pattern[i % pattern.length];
    const capped = (hintStages.length && i === 0 ? Math.min(raw, 3) : raw) as SkillScore["score"];
    return {
      skill, score: capped,
      quote: m ? firstSentence(m.text) : "(no answer given)",
      why: capped >= 4 ? "Specific to the case and tied back to the goal." : capped === 3 ? "Competent, but stayed generic. Didn't use the facts you were given." : "Mostly framework words, not much case-specific content.",
      next: capped >= 4 ? "Keep it. Say the trade-off out loud too." : "Name one concrete user moment, then the number that proves it.",
    };
  });
}

const firstSentence = (s: string) => {
  const t = s.trim().split(/(?<=[.!?])\s/)[0];
  return t.length > 160 ? t.slice(0, 157) + "…" : t;
};

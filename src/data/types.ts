export type CatId = "design" | "improve" | "rca" | "guess" | "metrics" | "gtm" | "pricing" | "ai" | "behav";
export type SkillId =
  | "clarify" | "users" | "structure" | "prioritize" | "solutions" | "metrics"
  | "tradeoffs" | "quant" | "business" | "tech" | "comms";
export type Level = "Easy" | "Medium" | "Hard";

export interface Case {
  id: string;
  cat: CatId;
  title: string;
  prompt: string;
  level: Level;
  /** Interviewer-only facts, revealed when the candidate asks the right question. */
  hidden?: string;
}

export interface Stage { name: string; mins: number }
export type Persona = "neutral" | "skeptical" | "friendly";
export type Mode = "mock" | "practice";

export interface Msg { who: "interviewer" | "you"; text: string; stage: number; at: number }

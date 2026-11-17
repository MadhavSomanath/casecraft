import { CASES } from "./cases";
import { CATS } from "./rubric";
import type { CatId } from "./types";

export interface Lesson {
  /** What the interviewer is really testing, in one or two sentences. */
  tests: string;
  /** One line of guidance per stage, in the same order as CATS[cat].stages. */
  steps: string[];
  mistakes: string[];
  /** One move that separates a 5 from a 3. */
  edge: string;
  /** Case ids to practise this type on, easiest first. */
  try: string[];
}

export const LEARN: Record<CatId, Lesson> = {
  design: {
    tests: "Whether you can find a real user, a real problem and a focused v1, instead of listing features.",
    steps: [
      "Ask 3-4 questions on the goal, the company and constraints. Say your assumptions out loud.",
      "Split users on one clear axis, pick one segment and say why it fits the goal.",
      "Walk that user's day. Write pains as obstacles, not as features they want.",
      "Give 2-3 different ideas, start with the obvious one, then pick one and cut the rest.",
      "One North Star tied to the goal, 2-3 inputs and a guardrail metric.",
      "Recap in 30 seconds: user, pain, v1, metric.",
    ],
    mistakes: ["Designing for \"everyone\"", "Jumping to features before a problem", "Three ideas that are the same idea", "Downloads as the success metric"],
    edge: "Tie every choice back to the goal you set in the first minute.",
    try: ["cook", "ola-kids", "voter"],
  },
  improve: {
    tests: "Whether you can find the friction that matters most in a product you know, and fix it without breaking the rest.",
    steps: [
      "Pin down the product, the company's goal and the one metric to move.",
      "Pick one user segment where the gap is biggest.",
      "Map their journey and mark where they drop or struggle.",
      "Rank the frictions, then propose specific fixes for the top one or two.",
      "Name the success metric, a counter metric and how you'd roll it out (A/B test, phases).",
    ],
    mistakes: ["Redesigning the whole product", "Ideas with no link to a metric", "Ignoring what the fix could hurt"],
    edge: "Say what you would not change, and why.",
    try: ["youtube", "bms", "tier2"],
  },
  rca: {
    tests: "Whether you diagnose like a detective: narrow the space with data before guessing causes.",
    steps: [
      "Confirm how the metric is defined and rule out a tracking or data change.",
      "Isolate when (sudden or gradual) and where (platform, region, segment, new vs existing).",
      "Check internal causes (releases, pricing, supply) then external ones (competitors, season, news).",
      "Converge on one root cause and say what evidence would confirm it.",
      "Propose the fix and how you'd know it worked.",
    ],
    mistakes: ["Listing every possible cause", "Skipping the data-integrity check", "Never committing to one answer"],
    edge: "Prune branches out loud: \"It's sudden and one region only, so seasonality is out.\"",
    try: ["fulfil", "wau", "agent-tcr"],
  },
  guess: {
    tests: "Structured thinking under uncertainty, and clean arithmetic you can defend.",
    steps: [
      "Fix the scope: what exactly is counted, where, and over what period.",
      "Pick top-down or bottom-up and say why.",
      "Break it into buckets, state each assumption, round numbers, do the maths out loud.",
      "Check the answer a second way or against a known benchmark.",
    ],
    mistakes: ["Starting maths before scoping", "Hidden assumptions", "Arithmetic slips with big numbers", "No sanity check"],
    edge: "Segment where it changes the answer (urban vs rural, heavy vs light users), not everywhere.",
    try: ["atms", "insta", "gpus"],
  },
  metrics: {
    tests: "Whether you can pick the few numbers that show a product is working, and the ones that warn you it isn't.",
    steps: [
      "Clarify what the product is for and for whom.",
      "Walk the user journey from discovery to habit.",
      "List metrics per stage, then pick one North Star and 3-4 KPIs.",
      "Add guardrail metrics and say what you'd do if each one moved.",
    ],
    mistakes: ["A wall of metrics with no North Star", "Vanity metrics", "No guardrail"],
    edge: "Explain how the North Star links to revenue or retention.",
    try: ["gpay-promo", "bigbasket", "insta-creator"],
  },
  gtm: {
    tests: "Business judgment: who to launch to, with what promise, through which channels, in what order.",
    steps: [
      "Define what's launching and why the company wants it now.",
      "Choose the first segment and their pain.",
      "Write the value proposition against the main alternative and choose a price approach.",
      "Pick channels for awareness to adoption, and phase the launch.",
      "Set launch metrics, the top risks and their mitigations.",
    ],
    mistakes: ["Launching to everyone at once", "Channels with no reason", "No phasing"],
    edge: "Use the company's unfair advantage (its users, data or logistics) in the plan.",
    try: ["social-fit", "fk-grocery", "amz-pharmacy"],
  },
  pricing: {
    tests: "Whether you price from customer value and business goals, not from cost or gut feel.",
    steps: [
      "Clarify the objective: share, profit or acquisition.",
      "Pick the segment and quantify the value versus their next-best option.",
      "Choose a model (subscription, usage, tiers, freemium) and a price, with the maths.",
      "Propose how to test it and name churn and cannibalisation risks.",
    ],
    mistakes: ["Cost-plus pricing only", "One price for every segment", "No test plan"],
    edge: "Show willingness to pay with a number, then price below it on purpose.",
    try: ["jiosaavn", "prime", "netflix"],
  },
  ai: {
    tests: "Whether you can ship AI responsibly: right capability, real evaluation, guardrails, and cost.",
    steps: [
      "Start from the user problem and ask whether AI is needed at all.",
      "Pick the capability (LLM, RAG, agent, classic ML) and the data or knowledge it needs.",
      "Define evals (golden set, precision/recall, human review) and guardrails with human hand-off.",
      "Estimate latency and cost per task, and set product and quality metrics.",
      "Close with the v1 scope and the failure mode you'd watch most.",
    ],
    mistakes: ["\"Add an AI chatbot\" with no problem", "No evaluation plan", "Ignoring cost per task"],
    edge: "Name a concrete failure mode and the exact guardrail for it.",
    try: ["measure-ai", "phonepe-ai", "ai-unit-econ"],
  },
  behav: {
    tests: "Ownership, judgment and self-awareness, told as a short, specific story.",
    steps: [
      "Set the situation and your task in two or three sentences.",
      "Spend most of the time on what you did, in first person.",
      "Give the result with a number, then what you learned.",
    ],
    mistakes: ["\"We\" instead of \"I\"", "A story with no result", "Rambling past 3 minutes"],
    edge: "End by linking the lesson to how you'd work as a PM.",
    try: ["tmay", "conflict", "tradeoff-story"],
  },
};

for (const id of Object.keys(LEARN) as CatId[]) {
  console.assert(LEARN[id].steps.length === CATS[id].stages.length, `learn.ts: ${id} needs one step per stage`);
  for (const t of LEARN[id].try) console.assert(CASES.some(c => c.id === t && c.cat === id), `learn.ts: ${t} is not a ${id} case`);
}

import type { CatId, SkillId, Stage } from "./types";

export const SKILLS: Record<SkillId, string> = {
  clarify: "Clarifying & scoping", users: "User empathy", structure: "Structured thinking",
  prioritize: "Prioritization", solutions: "Solution ideas", metrics: "Metrics",
  tradeoffs: "Trade-offs & risks", quant: "Estimation & math", business: "Business sense",
  tech: "Tech & AI fluency", comms: "Communication",
};

export const CATS: Record<CatId, { name: string; short: string; skills: SkillId[]; stages: Stage[] }> = {
  design: { name: "Product design", short: "Design", skills: ["clarify", "users", "prioritize", "solutions", "metrics", "comms"],
    stages: [{ name: "Clarify", mins: 4 }, { name: "Users", mins: 7 }, { name: "Pain points", mins: 6 }, { name: "Solutions", mins: 8 }, { name: "Metrics", mins: 4 }, { name: "Close", mins: 1 }] },
  improve: { name: "Product improvement", short: "Improve", skills: ["clarify", "users", "prioritize", "solutions", "metrics", "tradeoffs"],
    stages: [{ name: "Clarify goal", mins: 4 }, { name: "Segment", mins: 5 }, { name: "Friction", mins: 6 }, { name: "Improvements", mins: 6 }, { name: "Metrics & rollout", mins: 4 }] },
  rca: { name: "Root cause analysis", short: "Root cause", skills: ["clarify", "structure", "metrics", "prioritize"],
    stages: [{ name: "Define metric", mins: 3 }, { name: "Isolate time & scope", mins: 5 }, { name: "Internal vs external", mins: 6 }, { name: "Root cause", mins: 4 }, { name: "Fix", mins: 2 }] },
  guess: { name: "Estimation", short: "Estimate", skills: ["clarify", "structure", "quant", "comms"],
    stages: [{ name: "Scope", mins: 2 }, { name: "Approach", mins: 3 }, { name: "Compute", mins: 7 }, { name: "Sanity check", mins: 3 }] },
  metrics: { name: "Metrics", short: "Metrics", skills: ["clarify", "users", "metrics", "tradeoffs"],
    stages: [{ name: "Goal", mins: 3 }, { name: "Journey", mins: 4 }, { name: "North Star & KPIs", mins: 5 }, { name: "Guardrails", mins: 3 }] },
  gtm: { name: "Launch & GTM", short: "Launch", skills: ["clarify", "users", "business", "metrics", "tradeoffs"],
    stages: [{ name: "What & why", mins: 5 }, { name: "Who", mins: 5 }, { name: "Value & price", mins: 5 }, { name: "Channels & phases", mins: 6 }, { name: "Metrics & risks", mins: 4 }] },
  pricing: { name: "Pricing", short: "Pricing", skills: ["clarify", "users", "quant", "business", "tradeoffs"],
    stages: [{ name: "Objective", mins: 3 }, { name: "Segment & value", mins: 6 }, { name: "Model & price", mins: 7 }, { name: "Test & risks", mins: 4 }] },
  ai: { name: "AI product", short: "AI", skills: ["users", "tech", "metrics", "tradeoffs", "business"],
    stages: [{ name: "Problem", mins: 4 }, { name: "Capability & data", mins: 7 }, { name: "Evals & guardrails", mins: 7 }, { name: "Cost & metrics", mins: 5 }, { name: "Close", mins: 2 }] },
  behav: { name: "Behavioral", short: "Behavioral", skills: ["comms", "metrics", "business"],
    stages: [{ name: "Situation & task", mins: 2 }, { name: "Action", mins: 4 }, { name: "Result & learning", mins: 2 }] },
};

export const totalMins = (cat: CatId) => CATS[cat].stages.reduce((s, x) => s + x.mins, 0);

/**
 * Score calibration: what a 1, 3 and 5 look like for each skill, with a short
 * anchor answer. The scorer must place every answer against these anchors,
 * so the same answer gets the same score every session.
 */
export const ANCHORS: Record<SkillId, Record<1 | 3 | 5, { bar: string; example: string }>> = {
  clarify: {
    1: { bar: "Jumps straight to solutions. No questions, or only generic ones.", example: "\"Sure, so I'd build an app with GPS tracking and…\"" },
    3: { bar: "Asks about goal and scope, states assumptions, but doesn't use the answers later.", example: "\"Is this for a specific city? I'll assume metros and that the goal is adoption.\"" },
    5: { bar: "Asks 3-4 sharp questions on goal, company and constraints, and each answer visibly shapes the plan.", example: "\"Is Ola's goal a new revenue line or parent trust in the brand? That decides whether I optimise for safety or price.\"" },
  },
  users: {
    1: { bar: "\"Everyone\" is the user. No segments.", example: "\"Parents and kids will both love it.\"" },
    3: { bar: "Names 2-3 segments and picks one, but the reason is thin.", example: "\"Working parents, schools, kids. I'll go with working parents since they pay.\"" },
    5: { bar: "Mutually exclusive segments on a clear axis, picks one with a reason tied to the goal, and walks their day.", example: "\"Split by who books and who rides. Dual-income parents of 6-10 year-olds feel the most pain at 7:40 am, and they pay. Let me walk their morning.\"" },
  },
  structure: {
    1: { bar: "Lists ideas in no order.", example: "\"Could be bugs, could be competitors, maybe seasonality…\"" },
    3: { bar: "Uses a known framework but applies it mechanically.", example: "\"Internal factors, then external factors.\"" },
    5: { bar: "A MECE tree built for this case, and prunes branches out loud with data.", example: "\"Sudden 12% drop in one region within a week rules out seasonality, so I'll go straight to what shipped there.\"" },
  },
  prioritize: {
    1: { bar: "No prioritisation, or picks without a reason.", example: "\"Let's do all three.\"" },
    3: { bar: "Ranks by a stated criterion, like impact vs effort.", example: "\"Safety is high impact, low effort, so it goes first.\"" },
    5: { bar: "Ranks against the goal, names what is cut and why, and owns the trade-off.", example: "\"I'm cutting the in-ride camera for v1. Live tracking gives 80% of the trust for 20% of the build.\"" },
  },
  solutions: {
    1: { bar: "One obvious idea.", example: "\"An app to book rides for kids.\"" },
    3: { bar: "2-3 ideas, mostly variants of the same thing.", example: "\"Booking, tracking, and notifications.\"" },
    5: { bar: "2-3 truly different bets, starts with the obvious one, then a bold one, each tied to the pain point.", example: "\"Obvious: verified-driver pooled routes. Bolder: partner with schools so the bus contract moves to Ola.\"" },
  },
  metrics: {
    1: { bar: "Vanity metrics like downloads or no metric at all.", example: "\"We'd track app downloads.\"" },
    3: { bar: "A North Star plus a couple of supporting metrics.", example: "\"Weekly rides per family, plus retention.\"" },
    5: { bar: "North Star tied to the goal, 2-3 inputs, and a counter metric that guards the risk.", example: "\"North Star: families with 4+ school rides a week. Guardrail: safety incidents per 10k rides must stay at zero.\"" },
  },
  tradeoffs: {
    1: { bar: "No risks named.", example: "\"It should work well.\"" },
    3: { bar: "Names generic risks without mitigations.", example: "\"There might be safety concerns.\"" },
    5: { bar: "Specific risks with a mitigation and what would make them change course.", example: "\"Pooling raises ride time past 40 min; if that happens for 10% of routes we cap pool size at 3.\"" },
  },
  quant: {
    1: { bar: "Guesses a number with no build-up.", example: "\"Maybe 10 million?\"" },
    3: { bar: "Clear build-up, some arithmetic slips.", example: "\"1.4B × 30% online × …\"" },
    5: { bar: "Round numbers, correct maths, and a sanity check from a second direction.", example: "\"~38M a day. Cross-check: 250M weekly posters × 1 post every 7 days lands in the same range.\"" },
  },
  business: {
    1: { bar: "Ignores how the company makes money.", example: "\"We'd make it free.\"" },
    3: { bar: "Mentions revenue or strategy but not why it fits this company.", example: "\"It's a new revenue stream.\"" },
    5: { bar: "Ties the move to the company's moat, economics and timing.", example: "\"Ola already has verified drivers and routing. Morning school runs fill an idle 7-9 am window, so margin is high.\"" },
  },
  tech: {
    1: { bar: "\"Just use AI\" with no specifics.", example: "\"We'll add an AI chatbot.\"" },
    3: { bar: "Picks a capability and names data needs.", example: "\"An LLM with RAG over the help docs.\"" },
    5: { bar: "Right capability for the job, eval plan, failure modes and cost per task.", example: "\"RAG with a 2-day index refresh, 200-question golden set, human handoff below 0.7 confidence, ~₹0.40 per chat.\"" },
  },
  comms: {
    1: { bar: "Rambles. No signposting. Interviewer has to pull structure out.", example: "\"So, um, there are lots of things here…\"" },
    3: { bar: "Shares a game plan and mostly follows it.", example: "\"I'll do users, then problems, then solutions.\"" },
    5: { bar: "Game plan, signposts every turn, checks in, and closes with a crisp recap tied to the goal.", example: "\"Quick recap: one segment, one pain, one v1, one metric. Want me to go deeper on rollout?\"" },
  },
};

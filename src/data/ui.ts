import {
  Annoyed, Calculator, ChartLine, Meh, MessageCircle, Pencil, Rocket, Search, SignalHigh, SignalLow,
  SignalMedium, Smile, Sparkles, Tag, TrendingUp, type LucideIcon,
} from "lucide-react";
import type { CatId, Level, Persona } from "./types";

export const CAT_ICON: Record<CatId, LucideIcon> = {
  design: Pencil, improve: TrendingUp, rca: Search, guess: Calculator, metrics: ChartLine,
  gtm: Rocket, pricing: Tag, ai: Sparkles, behav: MessageCircle,
};

export const LEVEL_ICON: Record<Level, LucideIcon> = { Easy: SignalLow, Medium: SignalMedium, Hard: SignalHigh };

export interface PersonaInfo {
  id: Persona; name: string; icon: LucideIcon; blurb: string;
  /** 1-5 */ pushback: number;
  /** 1-5 */ patience: number;
  cutIn: string;
}

export const PERSONAS: PersonaInfo[] = [
  { id: "friendly", name: "Friendly", icon: Smile, blurb: "Warm and patient. Good for a first run.", pushback: 1, patience: 5, cutIn: "Cuts in after ~3 min" },
  { id: "neutral", name: "Neutral", icon: Meh, blurb: "A standard big-tech round.", pushback: 3, patience: 3, cutIn: "Cuts in after ~2 min" },
  { id: "skeptical", name: "Skeptical", icon: Annoyed, blurb: "Challenges every claim you make.", pushback: 5, patience: 1, cutIn: "Cuts in after ~1 min" },
];

export const persona = (id: Persona) => PERSONAS.find(p => p.id === id)!;

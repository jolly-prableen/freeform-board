export type ThoughtType = "idea" | "question" | "doubt" | "decision";

export interface Pin {
  id: string;
  x: number;
  y: number;
  text: string;

  shape: number;
  mood: number;

  thought: ThoughtType;   // 🧠 thinking state
  createdAt: number;     // ⏳ timeline
}

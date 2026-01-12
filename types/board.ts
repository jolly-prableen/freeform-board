export type ThoughtType = "idea" | "question" | "doubt" | "decision";

export interface Pin {
  id: string;
  x: number;
  y: number;

  text: string;
  image?: string;        // ✅ image URL (base64)
  imageSize?: { w: number; h: number };

  shape: number;
  mood: number;
  thought: ThoughtType;

  groupId?: string;      // ✅ grouping
  createdAt: number;
}

// 🔽 ADDED: Group model (safe, optional)
export interface PinGroup {
  id: string;
  name?: string;
  pinIds: string[];
  createdAt: number;
}

// 🔽 ADDED: Canvas pan state (safe)
export interface CanvasTransform {
  x: number;
  y: number;
}

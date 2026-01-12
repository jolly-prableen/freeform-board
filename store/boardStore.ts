import { create } from "zustand";
import { Pin, ThoughtType } from "../types/board";

/* -----------------------------
   Safe persistence helpers
------------------------------*/
const canUseStorage = typeof window !== "undefined";
const persist = (k: string, v: any) =>
  canUseStorage && localStorage.setItem(k, JSON.stringify(v));

type Snapshot = {
  id: string;
  name: string;
  pins: Pin[];
  createdAt: number;
};

type BoardStore = {
  pins: Pin[];
  history: Pin[][];
  future: Pin[][];
  snapshots: Snapshot[];

  beginAction: () => void;
  addPin: () => void;
  movePin: (id: string, x: number, y: number) => void;
  updatePinText: (id: string, text: string) => void;

  cyclePinShape: (id: string) => void;
  cyclePinMood: (id: string) => void;

  // ===== THINKING BOARD EXTENSION =====
  cyclePinThought: (id: string) => void;

  saveSnapshot: (name: string) => void;
  undo: () => void;
  redo: () => void;
  clearBoard: () => void;
  loadAll: () => void;
};

const THOUGHT_ORDER: ThoughtType[] = [
  "question",
  "idea",
  "doubt",
  "decision",
];

export const useBoardStore = create<BoardStore>((set, get) => ({
  pins: [],
  history: [],
  future: [],
  snapshots: [],

  /* -----------------------------
     Load persisted data (safe)
  ------------------------------*/
  loadAll: () => {
    if (!canUseStorage) return;

    const p = localStorage.getItem("board-pins");
    const s = localStorage.getItem("board-snaps");

    if (p) {
      const parsed: Pin[] = JSON.parse(p).map((pin: any) => ({
        ...pin,
        thought: pin.thought ?? "idea",
        createdAt: pin.createdAt ?? Date.now(),
      }));
      set({ pins: parsed });
    }

    if (s) set({ snapshots: JSON.parse(s) });
  },

  /* -----------------------------
     Begin atomic action
  ------------------------------*/
  beginAction: () =>
    set((state) => ({
      history: [...state.history, JSON.parse(JSON.stringify(state.pins))],
      future: [],
    })),

  /* -----------------------------
     Add pin
  ------------------------------*/
  addPin: () =>
    set((state) => {
      const updated: Pin[] = [
        ...state.pins,
        {
          id: Date.now().toString(),
          x: 160 + Math.random() * 60,
          y: 160 + Math.random() * 60,
          text: "",
          shape: 0,
          mood: 0,
          thought: "idea",
          createdAt: Date.now(),
        },
      ];
      persist("board-pins", updated);
      return { pins: updated };
    }),

  /* -----------------------------
     Move pin
  ------------------------------*/
  movePin: (id, x, y) =>
    set((state) => {
      const updated = state.pins.map((p) =>
        p.id === id ? { ...p, x, y } : p
      );
      persist("board-pins", updated);
      return { pins: updated };
    }),

  /* -----------------------------
     Update pin text
  ------------------------------*/
  updatePinText: (id, text) =>
    set((state) => {
      const updated = state.pins.map((p) =>
        p.id === id ? { ...p, text } : p
      );
      persist("board-pins", updated);
      return { pins: updated };
    }),

  /* -----------------------------
     Cycle shape
  ------------------------------*/
  cyclePinShape: (id) =>
    set((state) => {
      const updated = state.pins.map((p) =>
        p.id === id ? { ...p, shape: (p.shape + 1) % 5 } : p
      );
      persist("board-pins", updated);
      return { pins: updated };
    }),

  /* -----------------------------
     Cycle mood
  ------------------------------*/
  cyclePinMood: (id) =>
    set((state) => {
      const updated = state.pins.map((p) =>
        p.id === id ? { ...p, mood: (p.mood + 1) % 4 } : p
      );
      persist("board-pins", updated);
      return { pins: updated };
    }),

  /* -----------------------------
     🧠 Cycle Thought State (CORE FEATURE)
  ------------------------------*/
  cyclePinThought: (id) =>
    set((state) => {
      const updated = state.pins.map((p) => {
        if (p.id !== id) return p;
        const next =
          THOUGHT_ORDER[
            (THOUGHT_ORDER.indexOf(p.thought) + 1) % THOUGHT_ORDER.length
          ];
        return { ...p, thought: next };
      });
      persist("board-pins", updated);
      return { pins: updated };
    }),

  /* -----------------------------
     Save snapshot
  ------------------------------*/
  saveSnapshot: (name) =>
    set((state) => {
      const snap: Snapshot = {
        id: Date.now().toString(),
        name,
        pins: JSON.parse(JSON.stringify(state.pins)),
        createdAt: Date.now(),
      };
      const updated = [...state.snapshots, snap];
      persist("board-snaps", updated);
      return { snapshots: updated };
    }),

  /* -----------------------------
     Undo / Redo
  ------------------------------*/
  undo: () => {
    const { history, pins, future } = get();
    if (!history.length) return;

    const prev = history[history.length - 1];
    set({
      pins: prev,
      history: history.slice(0, -1),
      future: [pins, ...future],
    });
    persist("board-pins", prev);
  },

  redo: () => {
    const { future, pins, history } = get();
    if (!future.length) return;

    const next = future[0];
    set({
      pins: next,
      future: future.slice(1),
      history: [...history, pins],
    });
    persist("board-pins", next);
  },

  /* -----------------------------
     Clear board
  ------------------------------*/
  clearBoard: () => {
    persist("board-pins", []);
    persist("board-snaps", []);
    set({ pins: [], history: [], future: [], snapshots: [] });
  },
}));

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

  // 🔽 ADDED: canvas pan state
  panX: number;
  panY: number;
  setPan: (x: number, y: number) => void;

  // 🔽 ADDED: grouping helpers
  groupPins: (ids: string[]) => void;
  ungroupPins: (groupId: string) => void;

  beginAction: () => void;
  addPin: () => void;
  addImagePin: (src: string, w: number, h: number) => void;
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

  // 🔽 ADDED: canvas pan state
  panX: 0,
  panY: 0,

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
     Add image pin
  ------------------------------*/
  addImagePin: (src, w, h) =>
    set((state) => {
      const updated: Pin[] = [
        ...state.pins,
        {
          id: Date.now().toString(),
          x: 200,
          y: 200,
          text: "",
          image: src,
          imageSize: { w, h },
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
     Move pin (WITH GROUP SUPPORT)
  ------------------------------*/
  movePin: (id, x, y) =>
    set((state) => {
      const target = state.pins.find((p) => p.id === id);
      if (!target) return {};

      // 🔽 move whole group
      if (target.groupId) {
        const dx = x - target.x;
        const dy = y - target.y;

        const updated = state.pins.map((p) =>
          p.groupId === target.groupId
            ? { ...p, x: p.x + dx, y: p.y + dy }
            : p
        );

        persist("board-pins", updated);
        return { pins: updated };
      }

      // 🔽 single pin move (original behavior)
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
     🧠 Cycle Thought State
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
     Grouping helpers
  ------------------------------*/
  groupPins: (ids) =>
    set((state) => {
      if (ids.length < 2) return {};
      const gid = Date.now().toString();

      const updated = state.pins.map((p) =>
        ids.includes(p.id) ? { ...p, groupId: gid } : p
      );

      persist("board-pins", updated);
      return { pins: updated };
    }),

  ungroupPins: (groupId) =>
    set((state) => {
      const updated = state.pins.map((p) =>
        p.groupId === groupId ? { ...p, groupId: undefined } : p
      );

      persist("board-pins", updated);
      return { pins: updated };
    }),

  /* -----------------------------
     Canvas pan
  ------------------------------*/
  setPan: (x, y) => set({ panX: x, panY: y }),

  /* -----------------------------
     Clear board
  ------------------------------*/
  clearBoard: () => {
    persist("board-pins", []);
    persist("board-snaps", []);
    set({ pins: [], history: [], future: [], snapshots: [] });
  },
}));

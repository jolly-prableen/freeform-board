import { create } from "zustand";
import { Pin } from "../types/board";

const canUseStorage = typeof window !== "undefined";
const persist = (k: string, v: any) => canUseStorage && localStorage.setItem(k, JSON.stringify(v));

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

  saveSnapshot: (name: string) => void;
  undo: () => void;
  redo: () => void;
  clearBoard: () => void;
  loadAll: () => void;
};

export const useBoardStore = create<BoardStore>((set, get) => ({
  pins: [],
  history: [],
  future: [],
  snapshots: [],

  loadAll: () => {
    if (!canUseStorage) return;
    const p = localStorage.getItem("board-pins");
    const s = localStorage.getItem("board-snaps");
    if (p) set({ pins: JSON.parse(p) });
    if (s) set({ snapshots: JSON.parse(s) });
  },

  beginAction: () =>
    set(state => ({
      history: [...state.history, JSON.parse(JSON.stringify(state.pins))],
      future: [],
    })),

  addPin: () =>
    set(state => {
      const updated = [
        ...state.pins,
        { id: Date.now().toString(), x: 180, y: 180, text: "", shape: 0, mood: 0 },
      ];
      persist("board-pins", updated);
      return { pins: updated };
    }),

  movePin: (id, x, y) =>
    set(state => {
      const updated = state.pins.map(p => p.id === id ? { ...p, x, y } : p);
      persist("board-pins", updated);
      return { pins: updated };
    }),

  updatePinText: (id, text) =>
    set(state => {
      const updated = state.pins.map(p => p.id === id ? { ...p, text } : p);
      persist("board-pins", updated);
      return { pins: updated };
    }),

  cyclePinShape: id =>
    set(state => {
      const updated = state.pins.map(p => p.id === id ? { ...p, shape: (p.shape + 1) % 5 } : p);
      persist("board-pins", updated);
      return { pins: updated };
    }),

  cyclePinMood: id =>
    set(state => {
      const updated = state.pins.map(p => p.id === id ? { ...p, mood: (p.mood + 1) % 4 } : p);
      persist("board-pins", updated);
      return { pins: updated };
    }),

  saveSnapshot: name =>
    set(state => {
      const snap = { id: Date.now().toString(), name, pins: state.pins, createdAt: Date.now() };
      const updated = [...state.snapshots, snap];
      persist("board-snaps", updated);
      return { snapshots: updated };
    }),

  undo: () => {
    const { history, pins, future } = get();
    if (!history.length) return;
    const prev = history[history.length - 1];
    set({ pins: prev, history: history.slice(0, -1), future: [pins, ...future] });
    persist("board-pins", prev);
  },

  redo: () => {
    const { future, pins, history } = get();
    if (!future.length) return;
    const next = future[0];
    set({ pins: next, future: future.slice(1), history: [...history, pins] });
    persist("board-pins", next);
  },

  clearBoard: () => {
    persist("board-pins", []);
    persist("board-snaps", []);
    set({ pins: [], history: [], future: [], snapshots: [] });
  },
}));

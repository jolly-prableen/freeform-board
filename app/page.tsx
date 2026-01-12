"use client";

import { useEffect, useRef, useState } from "react";
import { useBoardStore } from "../store/boardStore";
import {
  Plus,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Trash2,
  Sun,
  Moon,
  Bookmark,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

/* ---------------- CONFIG ---------------- */
const COLORS = ["#FEF3C7", "#DBEAFE", "#DCFCE7", "#FCE7F3"];
const SHAPES = ["12px", "999px", "20px 4px 20px 4px", "24px", "12px 12px 4px 12px"];
const MOODS = ["transparent", "#22c55e", "#f59e0b", "#ef4444"];

const THOUGHT_META = {
  question: { icon: HelpCircle, label: "Question ❓", anim: "pulse" },
  idea: { icon: Lightbulb, label: "Idea 💡", anim: "glow" },
  doubt: { icon: AlertTriangle, label: "Doubt ⚠️", anim: "shake" },
  decision: { icon: CheckCircle2, label: "Decision ✅", anim: "none" },
};

/* ---------------- ICON BUTTON ---------------- */
function IconButton({ icon: Icon, onClick, danger, label }: any) {
  return (
    <button
      title={label}
      data-danger={danger}
      onClick={onClick}
      style={{
        width: 38,
        height: 38,
        borderRadius: 12,
        display: "grid",
        placeItems: "center",
        background: danger ? "rgba(239,68,68,.15)" : "transparent",
        color: danger ? "#ef4444" : "inherit",
        cursor: "pointer",
      }}
    >
      <Icon size={18} />
    </button>
  );
}

/* ---------------- MAIN ---------------- */
export default function Home() {
  const {
    pins,
    beginAction,
    addPin,
    movePin,
    updatePinText,
    undo,
    redo,
    loadAll,
    clearBoard,
    saveSnapshot,
    cyclePinShape,
    cyclePinMood,
    cyclePinThought,
  } = useBoardStore();

  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const dragging = useRef<string | null>(null);
  const offset = useRef({ x: 0, y: 0 });

  /* ---------- INIT ---------- */
  useEffect(() => {
    loadAll();
    const t = localStorage.getItem("theme");
    if (t === "light") setTheme("light");
  }, [loadAll]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.className = theme;
  }, [theme]);

  /* ---------- KEYBOARD ---------- */
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const cmd = navigator.platform.includes("Mac") ? e.metaKey : e.ctrlKey;
      if (cmd && e.key === "z" && !e.shiftKey) undo();
      if ((cmd && e.key === "z" && e.shiftKey) || e.key === "y") redo();
      if (e.key === "Escape") setFocusId(null);
      if (e.key.toLowerCase() === "n") {
        beginAction();
        addPin();
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [undo, redo, addPin, beginAction]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {/* -------- Animations -------- */}
      <style>{`
        @keyframes wiggle {
          0% { transform: rotate(var(--r)) scale(1); }
          25% { transform: rotate(calc(var(--r) - 1deg)) scale(1.03); }
          50% { transform: rotate(calc(var(--r) + 1deg)) scale(1.03); }
          100% { transform: rotate(var(--r)) scale(1); }
        }
        @keyframes pulse { 0%{opacity:.8}50%{opacity:1}100%{opacity:.8} }
        @keyframes glow { 0%{box-shadow:0 0 0}50%{box-shadow:0 0 18px rgba(59,130,246,.6)}100%{box-shadow:0 0 0} }
        @keyframes shake { 0%{transform:translateX(0)}25%{transform:translateX(-2px)}50%{transform:translateX(2px)}100%{transform:translateX(0)} }
        .pin:hover { animation: wiggle .35s ease-in-out; }
        .pulse { animation: pulse 2s infinite; }
        .glow { animation: glow 2.5s infinite; }
        .shake { animation: shake .6s infinite; }
      `}</style>

      {/* ---------------- NAVBAR ---------------- */}
      <div
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          right: 16,
          height: 64,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 16px",
          borderRadius: 16,
          backdropFilter: "blur(16px)",
          cursor: "default",
          background: theme === "dark" ? "rgba(15,23,42,.8)" : "rgba(255,255,255,.9)",
          color: theme === "dark" ? "#e5e7eb" : "#0f172a",
          boxShadow: "0 10px 30px rgba(0,0,0,.15)",
          zIndex: 50,
        }}
      >
        <div className="ff-logo">
          <div className="ff-logo-dot" />
          <span className="ff-logo-text">Freeform</span>
        </div>


        <IconButton icon={Plus} label="Add Pin" onClick={() => { beginAction(); addPin(); }} />
        <IconButton icon={Undo2} label="Undo" onClick={undo} />
        <IconButton icon={Redo2} label="Redo" onClick={redo} />
        <IconButton icon={ZoomIn} label="Zoom In" onClick={() => setZoom(z => Math.min(2, z + .1))} />
        <IconButton icon={ZoomOut} label="Zoom Out" onClick={() => setZoom(z => Math.max(.5, z - .1))} />

        <div style={{ flex: 1 }} />

        <IconButton icon={Bookmark} label="Save" onClick={() => {
          const n = prompt("Save board as:");
          if (n) saveSnapshot(n);
        }} />

        <IconButton
          icon={theme === "dark" ? Sun : Moon}
          label="Toggle Theme"
          onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))}
        />

        <IconButton
          icon={Trash2}
          danger
          label="Clear Board"
          onClick={() => confirm("Clear board?") && clearBoard()}
        />
      </div>

      {/* ---------------- CANVAS ---------------- */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          paddingTop: 96,
          backgroundColor: theme === "dark" ? "#020617" : "#f8fafc",
          backgroundImage:
            theme === "dark"
              ? "radial-gradient(circle at 1px 1px, rgba(255,255,255,.05) 1px, transparent 0)"
              : "radial-gradient(circle at 1px 1px, rgba(0,0,0,.05) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return;
          movePin(
            dragging.current,
            (e.clientX - offset.current.x) / zoom,
            (e.clientY - offset.current.y) / zoom
          );
        }}
        onPointerUp={() => dragging.current = null}
      >
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "0 0",
            position: "absolute",
            inset: 0,
          }}
        >
          {pins.map((pin) => {
            const ThoughtIcon = THOUGHT_META[pin.thought].icon;
            const anim = THOUGHT_META[pin.thought].anim;

            return (
              <div
                key={pin.id}
                className={`pin ${anim}`}
                onPointerDown={(e) => {
                  beginAction();
                  dragging.current = pin.id;
                  offset.current = { x: e.clientX - pin.x, y: e.clientY - pin.y };
                  (e.target as HTMLElement).setPointerCapture(e.pointerId);
                }}
                onPointerUp={(e) => {
                  (e.target as HTMLElement).releasePointerCapture(e.pointerId);
                  dragging.current = null;
                }}
                onClick={() => cyclePinShape(pin.id)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  cyclePinMood(pin.id);
                }}
                onDoubleClick={() => setFocusId(pin.id)}
                style={{
                  position: "absolute",
                  left: pin.x,
                  top: pin.y,
                  background: COLORS[Number(pin.id) % COLORS.length],
                  padding: "14px 16px",
                  borderRadius: SHAPES[pin.shape],
                  cursor: "grab",
                  opacity: focusId && focusId !== pin.id ? .3 : 1,
                  filter: focusId && focusId !== pin.id ? "blur(2px)" : "none",
                  "--r": `${(Number(pin.id) % 5) - 2}deg`,
                } as any}
              >
                {/* Thought Icon */}
                <div
                  title="Click to change thought"
                  onClick={(e) => {
                    e.stopPropagation();
                    cyclePinThought(pin.id);
                  }}
                  style={{ position: "absolute", top: 8, left: 8, cursor: "pointer" }}
                >
                  <ThoughtIcon size={14} />
                </div>

                {/* Mood Dot */}
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: MOODS[pin.mood],
                  }}
                />

                {editingId === pin.id ? (
                  <textarea
                    autoFocus
                    value={pin.text}
                    onChange={(e) => updatePinText(pin.id, e.target.value)}
                    onBlur={() => setEditingId(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        setEditingId(null);
                      }
                    }}
                    style={{ width: "100%", border: "none", background: "transparent" }}
                  />
                ) : (
                  <div onDoubleClick={() => setEditingId(pin.id)}>
                    {pin.text || "Double-click to edit"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

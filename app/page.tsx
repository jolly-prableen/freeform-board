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
  Image as ImageIcon,
  Layers,
  Ungroup,
} from "lucide-react";

/* ---------------- CONFIG ---------------- */
const COLORS = ["#FEF3C7", "#DBEAFE", "#DCFCE7", "#FCE7F3"];
const SHAPES = ["12px", "999px", "20px 4px 20px 4px", "24px", "12px 12px 4px 12px"];
const MOODS = ["transparent", "#22c55e", "#f59e0b", "#ef4444"];

const THOUGHT_META = {
  question: { icon: HelpCircle, anim: "pulse" },
  idea: { icon: Lightbulb, anim: "glow" },
  doubt: { icon: AlertTriangle, anim: "shake" },
  decision: { icon: CheckCircle2, anim: "none" },
};

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

export default function Home() {
  const {
    pins,
    snapshots,
    beginAction,
    addPin,
    addImagePin,
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
    groupPins,
    ungroupPins,
    panX,
    panY,
    setPan,
  } = useBoardStore();

  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const dragging = useRef<string | null>(null);
  const offset = useRef({ x: 0, y: 0 });

  const panning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const spacePressed = useRef(false);

  /* ---------- SPACE FOR PAN ---------- */
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        spacePressed.current = true;
        e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "Space") spacePressed.current = false;
    };
    window.addEventListener("keydown", down, { passive: false });
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

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

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {/* IMAGE UPLOAD */}
      <input
        type="file"
        accept="image/*"
        hidden
        id="image-upload"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            const img = new Image();
            img.onload = () => {
              beginAction();
              addImagePin(reader.result as string, img.width, img.height);
            };
            img.src = reader.result as string;
          };
          reader.readAsDataURL(file);
        }}
      />
      {/* -------- ANIMATIONS (RESTORED) -------- */}
          <style>{`
            @keyframes wiggle {
              0% { transform: rotate(var(--r)) scale(1); }
              25% { transform: rotate(calc(var(--r) - 1deg)) scale(1.03); }
              50% { transform: rotate(calc(var(--r) + 1deg)) scale(1.03); }
              100% { transform: rotate(var(--r)) scale(1); }
            }

            @keyframes pulse {
              0% { opacity: .8; }
              50% { opacity: 1; }
              100% { opacity: .8; }
            }

            @keyframes glow {
              0% { box-shadow: 0 0 0 rgba(59,130,246,0); }
              50% { box-shadow: 0 0 18px rgba(59,130,246,.6); }
              100% { box-shadow: 0 0 0 rgba(59,130,246,0); }
            }

            @keyframes shake {
              0% { transform: translateX(0); }
              25% { transform: translateX(-2px); }
              50% { transform: translateX(2px); }
              100% { transform: translateX(0); }
            }

            .pin:hover {
              animation: wiggle .35s ease-in-out;
            }

            .pulse {
              animation: pulse 2s infinite;
            }

            .glow {
              animation: glow 2.5s infinite;
            }

            .shake {
              animation: shake .6s infinite;
            }
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
          background: theme === "dark"
            ? "rgba(15,23,42,.8)"
            : "rgba(255,255,255,.9)",
          color: theme === "dark" ? "#e5e7eb" : "#0f172a",
          boxShadow: "0 10px 30px rgba(0,0,0,.15)",
          zIndex: 50,
        }}
      >
        <div className="ff-logo">
          <div className="ff-logo-dot" />
          <span className="ff-logo-text">ThinkSpace</span>
        </div>

        <IconButton icon={Plus} label="Add Pin" onClick={() => { beginAction(); addPin(); }} />
        <IconButton icon={Undo2} label="Undo" onClick={undo} />
        <IconButton icon={Redo2} label="Redo" onClick={redo} />
        <IconButton icon={ZoomIn} label="Zoom In" onClick={() => setZoom(z => Math.min(2, z + .1))} />
        <IconButton icon={ZoomOut} label="Zoom Out" onClick={() => setZoom(z => Math.max(.5, z - .1))} />
        <IconButton icon={ImageIcon} label="Add Image" onClick={() => document.getElementById("image-upload")?.click()} />

        <div style={{ flex: 1 }} />

        <select
          defaultValue=""
          onChange={(e) => {
            const snap = snapshots.find(s => s.id === e.target.value);
            if (!snap) return;
            beginAction();
            useBoardStore.setState({ pins: snap.pins });
          }}
        >
          <option value="" disabled>Saved boards</option>
          {snapshots.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        {selectedIds.length >= 2 && (
          <IconButton
            icon={Layers}
            label="Group"
            onClick={() => {
              beginAction();
              groupPins(selectedIds);
              setSelectedIds([]);
            }}
          />
        )}

        {selectedIds.length === 1 && (() => {
          const pin = pins.find(p => p.id === selectedIds[0]);
          if (!pin?.groupId) return null;
          return (
            <IconButton
              icon={Ungroup}
              label="Ungroup"
              onClick={() => {
                beginAction();
                ungroupPins(pin.groupId as string);
                setSelectedIds([]);
              }}
            />
          );
        })()}

        <IconButton icon={Bookmark} label="Save" onClick={() => {
          const n = prompt("Save board as:");
          if (n) saveSnapshot(n);
        }} />

        <IconButton
          icon={theme === "dark" ? Sun : Moon}
          label="Theme"
          onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
        />

        <IconButton
          icon={Trash2}
          danger
          label="Clear"
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
        onPointerDown={(e) => {
          if (e.button === 1 || spacePressed.current) {
            panning.current = true;
            panStart.current = { x: e.clientX - panX, y: e.clientY - panY };
          }
        }}
        onPointerMove={(e) => {
          if (panning.current) {
            setPan(e.clientX - panStart.current.x, e.clientY - panStart.current.y);
          }
          if (!dragging.current) return;
          movePin(
            dragging.current,
            (e.clientX - offset.current.x - panX) / zoom,
            (e.clientY - offset.current.y - panY) / zoom
          );
        }}
        onPointerUp={() => {
          dragging.current = null;
          panning.current = false;
        }}
      >
        <div
          style={{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            transformOrigin: "0 0",
            position: "absolute",
            inset: 0,
          }}
        >
          {pins.map((pin) => {
            const ThoughtIcon = THOUGHT_META[pin.thought].icon;
            return (
              <div
                key={pin.id}
                className={`pin ${THOUGHT_META[pin.thought].anim}`}
                onPointerDown={(e) => {
                  beginAction();
                  dragging.current = pin.id;
                  offset.current = {
                    x: e.clientX - panX - pin.x * zoom,
                    y: e.clientY - panY - pin.y * zoom,
                  };
                }}
                onClick={(e) => {
                  if (e.shiftKey) {
                    setSelectedIds(prev =>
                      prev.includes(pin.id)
                        ? prev.filter(id => id !== pin.id)
                        : [...prev, pin.id]
                    );
                  } else {
                    cyclePinShape(pin.id);   // ✅ SINGLE CLICK SHAPE (RESTORED)
                    setSelectedIds([]);
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  cyclePinMood(pin.id);
                }}
                style={{
                  position: "absolute",
                  left: pin.x,
                  top: pin.y,
                  background: pin.image ? "transparent" : COLORS[Number(pin.id) % COLORS.length],
                  padding: pin.image ? 0 : "14px 16px",
                  borderRadius: SHAPES[pin.shape],
                  cursor: "grab",
                  outline: selectedIds.includes(pin.id)
                    ? "2px solid rgba(99,102,241,.6)"
                    : "none",
                  opacity: focusId && focusId !== pin.id ? .3 : 1,
                  filter: focusId && focusId !== pin.id ? "blur(2px)" : "none",
                }}
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    cyclePinThought(pin.id);
                  }}
                  style={{ position: "absolute", top: 8, left: 8, cursor: "pointer" }}
                >
                  <ThoughtIcon size={14} />
                </div>

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

                {pin.image && (
                  <img
                    src={pin.image}
                    draggable={false}
                    style={{
                      display: "block",
                      width: pin.imageSize?.w,
                      height: pin.imageSize?.h,
                      borderRadius: 12,
                      pointerEvents: "none",
                    }}
                  />
                )}

                {!pin.image && (
                  <>
                    {editingId === pin.id ? (
                      <textarea
                        autoFocus
                        value={pin.text}
                        onChange={(e) => updatePinText(pin.id, e.target.value)}
                        onBlur={() => setEditingId(null)}
                      />
                    ) : (
                      <div onDoubleClick={() => setEditingId(pin.id)}>
                        {pin.text || "Double-click to edit"}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

# 🧠 ThinkSpace
### A cognition-first freeform thinking board

ThinkSpace is an interactive thinking canvas designed around **how people think**, not how they collaborate.

Built with **Next.js, TypeScript, and Zustand**, it focuses on unstructured ideation, emotional context, and deep focus — without noise or forced structure.

> **“This board is designed around cognition, not collaboration.”**

---

## 🔗 Live Demo
👉 https://freeform-board.vercel.app

---

## ✨ Core Features

### 📝 Pins (Notes)
- Draggable, sticky-note style pins  
- Multiple **organic shapes** (single-click a pin to cycle)
- Soft pastel color palette for low visual fatigue
- Subtle hover & motion feedback
- Automatically persisted using **localStorage**

---

### 🖼 Image Pins
- Add images directly to the board
- Image size preserved (no forced cropping)
- Image pins behave like normal pins (drag, group, save)

---

### 🧠 Thought Types *(Cognition-Driven Feature)*
Each pin represents a **thinking state**, not just content.

- Click the **thought icon** on a pin to cycle through:
  - ❓ Question
  - 💡 Idea
  - ⚠️ Doubt
  - ✅ Decision
- Each type has a **distinct micro-animation**:
  - Pulse · Glow · Shake · Calm

👉 Encourages awareness of *how* you’re thinking, not just *what* you write.

---

### 🎯 Focus Mode *(Deep-Thinking Feature)*
- **Double-click** any pin to enter focus mode
- All other pins softly **fade & blur**
- Press **Esc** to exit

👉 Supports deep concentration on a single idea  
*(Most boards prioritize collaboration — not cognition)*

---

### 🎨 Mood Tagging *(Emotional Context)*
- **Right-click** a pin to cycle through moods
- Mood is shown as a small, non-intrusive colored dot:

| Mood | Meaning |
|---|---|
| 🟢 Calm | Stable / resolved |
| 🟡 Exploring | In progress / ideation |
| 🔴 Urgent | Needs attention |

- Mood state persists across reloads

👉 Adds emotional context without cluttering the interface.

---

### 🧩 Grouping & Organization
- **Shift + click** multiple pins to select
- Group selected pins from the toolbar
- Drag one → the **entire group moves**
- Ungroup anytime
- Fully undo/redo-safe

---

### 🧭 Infinite Canvas + Navigation
- **Pan** using `Space + drag` or middle mouse
- **Zoom in / out** from toolbar
- Smooth navigation without breaking layout

---

### 🌗 Dark / Light Mode
- Toggle directly from the top toolbar
- Theme preference saved automatically
- Optimized contrast for both modes

---

### 🧰 Minimal Icon-Based Toolbar
A clean, **text-free** toolbar to reduce distraction:

- ➕ Add pin  
- ↩ Undo / ↪ Redo  
- 🔍 Zoom in / out  
- 🖼 Add image  
- 🧩 Group / Ungroup  
- 💾 Save board snapshot  
- 🌙 / ☀ Toggle theme  
- 🗑 Clear board *(danger action)*  

---

### 💾 Board Snapshots
- Save the **entire board state**
- Restore later from dropdown
- Useful for:
  - Ideation stages
  - Thought evolution
  - Versioning

---

### ⌨ Keyboard Shortcuts

| Action | Shortcut |
|---|---|
| Add pin | `N` |
| Undo | `Ctrl / Cmd + Z` |
| Redo | `Ctrl / Cmd + Shift + Z` or `Y` |
| Finish editing | `Enter` |
| New line | `Shift + Enter` |
| Exit focus mode | `Esc` |
| Pan canvas | `Space + Drag` |

---

## 🛠 Tech Stack
- **Next.js (App Router)**
- **TypeScript**
- **Zustand** — global state + undo/redo
- **Lucide React** — icon system
- **CSS-in-JS** + micro-animations
- **LocalStorage** persistence

---

## 📂 Project Structure

This is a **Next.js App Router** project bootstrapped with `create-next-app`.

Key files:
- `app/page.tsx` → main board UI
- `store/boardStore.ts` → Zustand state (pins, grouping, undo/redo, pan)
- `types/board.ts` → pin & thought models
- `app/globals.css` → global styles & logo system

---

## 🚀 Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

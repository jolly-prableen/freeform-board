# 🧠 Thinkspace
### A cognition-first freeform thinking board.

Freeform Board is an interactive, minimal **thinking board** inspired by Apple Freeform — but designed around **how thoughts form**, not just how notes are placed.

Built with **Next.js, Zustand, and thoughtful UX micro-interactions**, this project focuses on unstructured ideation, emotional context, and deep focus.

> **“This board is designed around cognition, not collaboration.”**

---

## 🔗 Live Demo
👉 https://freeform-board.vercel.app

---

## ✨ Core Features

### 📝 Pins (Notes)
- Draggable, sticky-note style pins  
- Multiple **organic shapes** (click a pin to cycle)
- Soft pastel palette for low visual fatigue
- Subtle hover & motion feedback
- Automatically saved using **localStorage**

---

### 🎯 Focus Mode *(Unique Feature)*
- **Double-click** any pin to enter focus mode
- All other pins softly **blur & fade**
- Press **Esc** to exit focus mode

👉 Encourages **deep thinking on a single idea**  
*(Most existing boards focus on collaboration — not concentration)*

---

### 🎨 Mood Tagging *(Unique Feature)*
- **Right-click** a pin to cycle through moods
- Mood is shown as a small, non-intrusive colored dot:

| Mood | Meaning |
|----|----|
| 🟢 Calm | Stable / resolved thought |
| 🟡 Idea | Exploration / brainstorming |
| 🔴 Urgent | Requires attention |

- Mood state persists across reloads

👉 Adds **emotional context** without cluttering the UI

---

### 🌗 Dark / Light Mode
- Toggle directly from the top toolbar
- Theme preference saved automatically
- Optimized contrast for readability in both modes

---

### 🧰 Icon-Based Toolbar
A minimal, **text-free** toolbar designed to reduce distraction:

- ➕ Add pin  
- ↩ Undo / ↪ Redo  
- 🔍 Zoom in / out  
- 💾 Save board snapshot  
- 🌙 / ☀ Toggle theme  
- 🗑 Clear board *(danger action)*  

---

### ⌨ Keyboard Shortcuts

| Action | Shortcut |
|-----|-----|
| Add pin | `N` or `+` |
| Undo | `Ctrl / Cmd + Z` |
| Redo | `Ctrl / Cmd + Shift + Z` or `Y` |
| Save board | `Ctrl / Cmd + S` |
| Finish editing pin | `Enter` |
| New line inside pin | `Shift + Enter` |
| Exit focus mode | `Esc` |

---

### 💾 Board Snapshots
- Save the entire board state
- Restore later
- Useful for **ideation stages & versions**

---

## 🛠 Tech Stack
- **Next.js (App Router)**
- **TypeScript**
- **Zustand** — global state & undo/redo
- **Lucide React** — icon system
- **CSS-in-JS** + subtle animations
- **LocalStorage** persistence

---

## 📂 Project Structure
This is a **Next.js App Router** project bootstrapped with `create-next-app`.

Key files:
- `app/page.tsx` → main board UI
- `store/boardStore.ts` → Zustand state (pins, undo/redo, moods)
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

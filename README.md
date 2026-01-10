# 🧠 Freeform Board

An interactive, minimal **freeform thinking board** inspired by Apple Freeform — built with **Next.js**, **Zustand**, and thoughtful UX micro-interactions.

This project focuses on **unstructured thinking**, mood-based notes, and distraction-free focus.

---

## ✨ Features

### 📝 Pins (Notes)
- Add draggable sticky-note style pins
- Multiple organic shapes (click pin to cycle)
- Soft pastel color palette
- Smooth drag & hover animations
- Auto-saved using `localStorage`

---

### 🎯 Focus Mode (Unique Feature)
- **Double-click a pin** to enter focus mode
- All other pins blur and fade out
- Press **Esc** to exit focus mode

👉 Helps users think deeply about one idea at a time  
*(Not present in most existing boards)*

---

### 🎨 Mood Tagging (Unique Feature)
- **Right-click a pin** to cycle moods
- Mood shown as a colored dot:
  - 🟢 Calm
  - 🟡 Idea
  - 🔴 Urgent
- Mood persists across reloads

👉 Adds emotional context to notes without clutter

---

### 🌗 Dark / Light Mode
- Toggle from the top toolbar
- Theme preference saved automatically
- Optimized contrast for readability in both modes

---

### 🧰 Icon-Based Toolbar
Minimal, text-free toolbar using icons:
- ➕ Add pin
- ↩ Undo / ↪ Redo
- 🔍 Zoom in / out
- 💾 Save board snapshot
- 🌙 / ☀ Toggle theme
- 🗑 Clear board (danger action)

---

### ⌨ Keyboard Shortcuts

| Action | Shortcut |
|------|--------|
| Add pin | `N` or `+` |
| Undo | `Ctrl / Cmd + Z` |
| Redo | `Ctrl / Cmd + Shift + Z` or `Y` |
| Save board | `Ctrl / Cmd + S` |
| Finish editing pin | `Enter` |
| New line in pin | `Shift + Enter` |
| Exit focus mode | `Esc` |

---

### 💾 Board Snapshots
- Save entire board state
- Restore later
- Useful for ideation stages / versions

---

## 🛠 Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **Zustand** – global state & undo/redo
- **Lucide React** – icon system
- **CSS-in-JS + subtle animations**
- **LocalStorage persistence**

---

## 📂 Project Structure

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

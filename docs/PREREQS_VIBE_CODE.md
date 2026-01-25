# BLACKBOX OS — Prerequisites (Vibe Code IDE)

This file is the setup checklist before generating code with AI (Cursor / VS Code / Windsurf / similar).

---

## 0) System Requirements

- OS: Windows 11 / macOS / Linux
- RAM: 16GB recommended (8GB minimum)
- GPU: Any modern integrated GPU is fine for V1

---

## 1) Install Core Tools

### Node + Package Manager

- Install **Node.js LTS (v20+)**
- Install **pnpm** (recommended)

Verify:

```bash
node -v
pnpm -v
```

### GitHub (version control + remote repo)

You’ll use **GitHub** for hosting and collaboration. Locally, you still need **Git** installed.

- Install Git
- Create / sign into GitHub
- Configure Git identity (used for GitHub commits):

```bash
git --version
git config --global user.name "YOUR_NAME"
git config --global user.email "YOUR_EMAIL"
```

> Note: You don’t need to create the GitHub repo on day 0, but you should have the GitHub account ready.

---

## 2) IDE Setup (for Vibe Coding)

Use one:

- Cursor (recommended for vibe coding)
- VS Code
- Windsurf

### Required IDE Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- EditorConfig
- (Optional) GitLens

### Required IDE Settings

- Format on save: ON
- Default formatter: Prettier
- TypeScript SDK: workspace version (if prompted)
- Enable ESLint on save (fixes)

Recommended `.editorconfig` at repo root:

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true
```

---

## 3) Accounts You Should Have Ready

- GitHub (repo)
- Vercel (deploy)
- Optional:
  - Sentry (errors)
  - Vercel Analytics or Plausible (usage)

---

## 4) 3D Asset Pipeline (Do This Early)

### Asset Format Rules

- Use **.glb** only (binary glTF).
- Start with placeholder models to ship fast.

### Performance Targets (V1)

- 60 FPS on a typical laptop
- Scene budget (visible at once):
  - 150k–300k triangles total
  - 1–2 real-time lights max
  - Use environment lighting for richness
- Keep each model under **2–5 MB** initially.

### Folder Convention

- `public/models/` → `.glb`
- `public/textures/` → `.png/.jpg` (later convert to compressed formats)

---

## 5) Content Inventory (Data-Driven Only)

Prepare a `projects.ts` schema (no hardcoding JSX copies).

Minimum fields per project:

- `id`
- `title`
- `oneLiner`
- `category` (Product / AI / Mobile / Data)
- `stack` (string[])
- `proof` (no fake metrics)
- `links` (demo/github/writeup)
- `modelPath` (glb path) OR `coverImage`

Rule: **Do not invent numbers.** If you lack metrics, use honest proof like:

- “Shipped MVP”
- “Deployed internal tool”
- “Automated workflow”
- “Reduced manual steps (quantify later)”

---

## 6) Design System Constraints (Lock Before Coding)

To avoid “design paralysis,” pick and freeze:

- Background: near-black
- Foreground: off-white
- One accent: electric blue OR acid green (choose one)
- Fonts:
  - Headings: Space Grotesk or Sora
  - Mono labels: IBM Plex Mono

Layout rules:

- 12-column grid
- Big headings, tiny mono labels
- Hairline borders
- Lots of whitespace

---

## 7) Interaction Spec (Write Once)

Keyboard:

- `Enter` → boot
- `Esc` → close panel
- `J/K` → next/prev project
- `/` → command palette (optional V2)

Pointer:

- Reticle cursor
- Hover = lock-on highlight
- Click = open case file overlay

Scroll:

- Camera travels along a spiral rail through projects

---

## 8) Repo Structure Standard

Create the project with this structure (target layout):

- `app/` routes (Next.js)
- `components/ui/` shadcn components
- `components/three/` R3F scene components
- `data/projects.ts`
- `lib/` helpers (state, camera, utils)
- `public/models/`
- `public/textures/`
- `styles/`

Key rule:

- Keep 3D scene logic in `components/three/`
- Keep readable content as HTML overlay (not 3D text)

---

## 9) Commands You’ll Run (V1)

After scaffold:

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
```

---

## 10) Vibe Coding Guardrails (Avoid Spaghetti)

- TypeScript everywhere
- Strict linting
- One global state pattern (keep it simple)
- Data drives projects (array/map), not copy-paste components
- Build in this order:
  1. Boot screen
  2. Spiral scene with placeholders
  3. Click → Case File overlay
  4. Polishing + performance
  5. Deploy

---

## 11) “Ready to Generate” Checklist

Before prompting AI to generate code, confirm:

- [ ] Node 20+ installed
- [ ] pnpm installed
- [ ] Git installed (for GitHub)
- [ ] GitHub account ready
- [ ] IDE extensions installed
- [ ] Placeholder GLB models collected (3–6)
- [ ] Project list drafted (6 projects minimum)
- [ ] Accent color chosen
- [ ] Fonts chosen
- [ ] Interaction spec written

---

## 12) First Prompt (Use After Setup)

Paste into your AI IDE once the repo exists:

**Prompt**

"Scaffold a Next.js (App Router) + TypeScript + Tailwind project. Add shadcn/ui. Add React Three Fiber + drei + postprocessing. Create a Boot screen route and a main Vault route that renders a 3D spiral of project capsules driven from `data/projects.ts`. Hover highlights a capsule with emissive pulse. Click opens a Case File overlay (HTML) with sections: Context, Problem, Constraints, Decisions, Results, Artifacts. Keep 3D logic isolated in `components/three/` and UI in `components/`."

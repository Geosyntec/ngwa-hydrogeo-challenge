# Hydro App (Minimal Working Repo)

This is the minimal working scaffold for the Knockout → React rewrite using **Vite + React + TypeScript + Material UI + Redux Toolkit + React Router**. It includes:

- **SPA with multiple pages**: Home (landing), Getting Started, The Challenge (scenario), Reference, About, Teacher Grading (placeholder)
- **Top menu** (legacy-style): brand, scenario dropdown on The Challenge page, nav pills with vertical dividers
- Global Redux store (`ScenarioSlice`) with a demo scenario
- Map view with clickable **well markers** and an info **popover** (right-click to open)
- "Choose 3 Wells" panel with clear buttons
- Placeholders for Flow Direction, Gradient, and Horizontal Velocity panels

## Getting Started

```bash
npm install
npm run dev
```

Then visit http://localhost:5173

## Push to GitHub

```bash
git init
git add .
git commit -m "chore: minimal working repo (vite + mui + rtk)"
gh repo create hydro-app --public --source=. --remote=origin --push
# Or set up a remote manually:
# git remote add origin https://github.com/<you>/hydro-app.git
# git push -u origin main
```

## Next Steps
- Implement **Flow Direction** (Step 1 → 3) with typed answer fields and compass selector.
- Port **Gradient** and **Horizontal Velocity** workflows.
- Replace demo data with real scenario loading.

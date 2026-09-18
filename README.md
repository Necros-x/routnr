# Gymnastics Routine Builder

A focused Next.js frontend for searching gymnastics skills and building routines.

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS v4
- Motion
- Lucide React
- Local browser persistence for routines and favorites

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Current scope

- Home dashboard
- Searchable skill library
- Skill detail sheets
- Routine creation and management
- Routine builder with reordering
- D-score / element-group calculations from the existing baseline logic

> The bundled skill data is prototype/mock data. Replace it with your verified Code of Points dataset before treating scoring or skill details as competition-authoritative.
- Local persistence

Brand/app naming is centralized in `src/config/app.ts` so it can be changed later without touching the interface structure.

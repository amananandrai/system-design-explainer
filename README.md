# System Design Explainer

An interactive site that explains how large systems (YouTube, Instagram, Uber, …) are built. Each
system's architecture is shown as a diagram you can switch between AWS, Google Cloud, Azure and
open-source tools, with alternatives listed for every component.

Built with Next.js, React Flow (`@xyflow/react`) and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project layout

- `src/` – the website (app routes, components, architecture data)
- `docs/NOTES.md` – content notes distilled from the source PDFs
- `docs/IMPLEMENTATION_PLAN.md` – features, data model and milestones
- `source-pdfs/` – original PDFs used as reference material (git-ignored, local only)

# System Design Explainer

[![Live site](https://img.shields.io/badge/live_site-vercel.app-000000?logo=vercel&logoColor=white)](https://system-design-explainer.vercel.app)
[![MIT License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

An interactive site for learning how large systems are built. The catalogue has 36 designs —
YouTube, Instagram, Uber, Amazon and the rest — each presented as a workspace: an architecture
diagram beside the requirements, APIs, capacity estimates, data model and request flows.

Built with Next.js (static export), React Flow + ELK for auto-laid-out diagrams, Tailwind CSS and Zod.
The live site is [system-design-explainer.vercel.app](https://system-design-explainer.vercel.app).

## The project

Systems, components and concepts are three linked catalogues.

- **Systems** are complete designs, from a URL shortener to YouTube. Each one has a difficulty
  (beginner, intermediate or advanced) and sits in one of five categories: Media & Social,
  Mobility & Logistics, Commerce & Fintech, Bookings & Marketplaces, and Building Blocks.
- **Components** are the 36 reusable building blocks a diagram is made of — clients, edge and
  networking, compute, storage, databases, caching, messaging, analytics, machine learning,
  security, operations and external services. A cache is written once and reused everywhere a
  design needs one.
- **Concepts** are the 27 patterns behind those choices, such as caching, sharding, fan-out,
  sagas and idempotency. They are grouped into data, scale, messaging, reliability and security.

Content is TypeScript, checked with Zod before every build. A missing component kind, a broken
diagram edge, a flow step that names an edge which does not exist, or a concept link that points
nowhere fails the build.

## Features

**Find a design.** The home page filters the catalogue by category, difficulty, concept or name.
Four learning paths build on each other, and opening a system marks it done in this browser.
Search (`⌘K`, `Ctrl+K`, or `/`) covers systems, components, service names and concepts. The
interface has a light theme and a dark theme.

**Read a system.** On a wide screen the diagram fills the left side and the write-up sits in tabs
on the right. A tab is shown only when that design has the content:

- **Overview** — description, the concepts this design uses, functional and non-functional
  requirements, and extensions
- **APIs** — method, path and what the call is for
- **Capacity** — estimates, with the arithmetic that produced each number
- **Data** — entity, store, key, fields, and why that store
- **Flows** — named walkthroughs, such as uploading a video or booking a seat
- **Reliability** — bottlenecks with a fix, and how the design scales

On a phone the default view is a tier list. The pan-and-zoom canvas is still available.

**Use the diagram.** Layout is automatic. The cloud control rewrites every node:

- **Generic** keeps each node's own label.
- **AWS, Google Cloud, Azure and open source** swap in that provider's service. The diagram
  shows the first option for the component kind, unless the system overrides it.

Selecting a node opens its role in this system and the other services that could fill the same
kind. Playing a flow highlights the current hop and advances on its own; pause, step and restart
are on the diagram, and a flow can also be started from the Flows tab. Cloud, selected node,
flow, step and open tab stay in the URL, so a link opens the same view.

**Components.** Each kind has a page: what it is, when to use it, pitfalls, options on each
cloud, third-party services that work with any cloud, related concepts, and every system node
that uses it.

**Concepts.** Each pattern explains the idea, how it works and the trade-offs, then links to the
systems and components that use it and to related concepts. Every concept has a small diagram
you can step through. Consistent hashing, rate limiting, the double-entry ledger, geospatial
indexing, unique IDs, bloom filters and prefix search also have an interactive illustration.

## Catalogue

**Media & Social.** YouTube, Netflix, Instagram, Twitter / X, WhatsApp / Messenger, LinkedIn,
Quora, Live sports scores.

**Mobility & Logistics.** Uber, Google Maps, Zomato / food delivery, Porter / goods delivery,
Car rental, Driver booking & fleet management.

**Commerce & Fintech.** Amazon, Payment gateway, Buy now, pay later, Stock brokerage.

**Bookings & Marketplaces.** BookMyShow, MakeMyTrip, Airline reservations, Airbnb, NoBroker,
Urban Company, Practo / teleconsultation, AstroTalk, Meeting scheduler.

**Building Blocks.** URL shortener, Pastebin, API rate limiter, Search autocomplete, Web crawler,
Dropbox, WebSockets at scale, Video calling (WebRTC), Redis Cluster.

### Learning paths

| Path | Level | Systems |
| --- | --- | --- |
| Foundations | Start here | URL shortener, Pastebin, API rate limiter, Search autocomplete |
| Real-time systems | Intermediate | WhatsApp / Messenger, WebSockets at scale, Live sports scores, Uber |
| Media at scale | Advanced | Instagram, Twitter / X, YouTube, Netflix |
| Money & bookings | Advanced | BookMyShow, Amazon, Payment gateway, Buy now, pay later |

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build and preview

```bash
npm run build     # validates content, then writes the static site to ./out
npm run preview   # serves ./out at http://localhost:4173
```

## Test

```bash
npm run validate  # schema and cross-reference checks for all content
npm run lint
npm run test:e2e  # builds, then runs Playwright smoke tests (desktop + phone)
```

Playwright needs a browser: either `npx playwright install chromium`, or use one that's already
installed with `PLAYWRIGHT_CHANNEL=msedge` (or `chrome`).

## Deploy

`./out` is plain static files — upload it to any static host (GitHub Pages, Netlify, Vercel,
Cloudflare Pages, S3 + CloudFront). On Vercel the production domain is used automatically; elsewhere,
set `NEXT_PUBLIC_SITE_URL` to the public origin before building so social preview images get
absolute URLs:

```bash
NEXT_PUBLIC_SITE_URL=https://example.com npm run build
```

Preview images are written as extensionless `opengraph-image` files; if your host doesn't detect
their type, serve `**/opengraph-image` with `Content-Type: image/png`.

## Adding content

- `src/content/systems/*.ts` — one file per system (register it in `systems/index.ts`)
- `src/content/components.ts` — component kinds and their AWS / GCP / Azure / open-source options
- `src/content/concepts.ts` — concept explainers
- `src/types/schema.ts` — the schema every content file must satisfy

`npm run validate` (also run before every build) catches unknown component kinds, broken edges,
flows or concept links.

## Project layout

- `src/app/` – routes: `/`, `/systems/[slug]`, `/components/[id]`, `/concepts/[slug]`
- `src/components/` – diagram, system page, navigation and search UI
- `src/lib/` – layout (ELK), provider resolution, search, validation, OG images
- `e2e/` – Playwright smoke tests
- `docs/NOTES.md` – content notes distilled from the source PDFs

## License

This project is licensed under the [MIT License](LICENSE).

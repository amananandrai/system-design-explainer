import Link from "next/link";
import { ArrowRight, Boxes, Cloud, Lightbulb, PlayCircle } from "lucide-react";
import SystemCatalogue, { type CatalogueCard } from "@/components/site/SystemCatalogue";
import SystemDeck, { type DeckCard } from "@/components/site/SystemDeck";
import { buildSketch } from "@/lib/sketch";
import LearningPaths, { type LearningPath } from "@/components/site/LearningPaths";
import {
  components,
  concepts,
  difficultyLabels,
  getConcept,
  getSystem,
  systemCategoryLabels,
  systems,
} from "@/content";

const lenses = [
  {
    icon: Cloud,
    hue: "infrastructure",
    title: "Switch clouds",
    text: "Relabel every component for AWS, Google Cloud, Azure or open source in one click.",
  },
  {
    icon: PlayCircle,
    hue: "mobility",
    title: "Play walkthroughs",
    text: "Follow a request hop by hop — upload a video, book a seat, pay a merchant.",
  },
  {
    icon: Boxes,
    hue: "commerce-fintech",
    title: "Inspect components",
    text: "Every building block with its options per provider, pitfalls and where it's used.",
  },
  {
    icon: Lightbulb,
    hue: "bookings",
    title: "Learn the patterns",
    text: "Caching, sharding, fan-out, sagas, idempotency — explained and linked to real designs.",
  },
];

const learningPaths = [
  {
    title: "Foundations",
    hue: "infrastructure",
    level: "Start here",
    slugs: ["url-shortener", "pastebin", "rate-limiter", "typeahead"],
  },
  {
    title: "Real-time systems",
    hue: "mobility",
    level: "Intermediate",
    slugs: ["whatsapp", "websocket-scale", "live-sports", "uber"],
  },
  {
    title: "Media at scale",
    hue: "media-social",
    level: "Advanced",
    slugs: ["instagram", "twitter", "youtube", "netflix"],
  },
  {
    title: "Money & bookings",
    hue: "commerce-fintech",
    level: "Advanced",
    slugs: ["bookmyshow", "amazon", "payments", "bnpl"],
  },
];

/** One system per category for the hero deck. */
const deckSlugs = ["youtube", "uber", "payments", "bookmyshow", "url-shortener"];

export default function HomePage() {
  const deck: DeckCard[] = deckSlugs.flatMap((slug) => {
    const s = getSystem(slug);
    return s
      ? [
          {
            slug,
            name: s.name,
            tagline: s.tagline,
            category: s.category,
            categoryLabel: systemCategoryLabels[s.category],
            sketch: buildSketch(s),
          },
        ]
      : [];
  });

  const cards: CatalogueCard[] = systems.map((s) => ({
    slug: s.slug,
    name: s.name,
    tagline: s.tagline,
    category: s.category,
    categoryLabel: systemCategoryLabels[s.category],
    difficulty: s.difficulty,
    difficultyLabel: difficultyLabels[s.difficulty],
    componentCount: s.nodes.length,
    flowCount: s.flows.length,
    complete: s.requirements.functional.length > 0,
    concepts: s.concepts.map((slug) => ({ slug, name: getConcept(slug)?.name ?? slug })),
    sketch: buildSketch(s),
  }));

  const paths: LearningPath[] = learningPaths.map(({ slugs, ...path }) => ({
    ...path,
    systems: slugs.flatMap((slug) => {
      const s = getSystem(slug);
      return s ? [{ slug, name: s.name }] : [];
    }),
  }));

  const categories = Object.entries(systemCategoryLabels)
    .filter(([value]) => systems.some((s) => s.category === value))
    .map(([value, label]) => ({ value, label }));

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Hero */}
        <section className="grid items-center gap-10 py-10 md:py-16 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <p className="font-mono text-xs text-muted">
              {systems.length} systems · {components.length} components · {concepts.length} concepts
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-fg md:text-5xl">
              How are large systems <span className="text-brand">built?</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
              Interactive architectures for YouTube, Uber, Amazon and more — switch between AWS, Google Cloud,
              Azure and open-source tools, and follow every request hop by hop.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/systems/youtube"
                className="btn bg-brand inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold"
              >
                Explore YouTube <ArrowRight size={16} aria-hidden />
              </Link>
              <a
                href="#catalogue"
                className="btn inline-flex items-center gap-2 bg-surface px-4 py-2.5 text-sm font-semibold text-fg"
              >
                Browse all systems
              </a>
            </div>
          </div>
          <SystemDeck cards={deck} total={systems.length} />
        </section>

        {/* What you can do */}
        <section aria-labelledby="lenses" className="py-6">
          <h2 id="lenses" className="sr-only">
            What you can do
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {lenses.map(({ icon: Icon, hue, title, text }) => (
              <li
                key={title}
                data-category={hue}
                className="bp-card p-5"
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded border-2 border-edge bg-cat text-on-cat"
                  aria-hidden
                >
                  <Icon size={18} />
                </span>
                <h3 className="mt-3 font-semibold text-fg">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Learning paths: a dark band in both themes breaks up the page. */}
      <section
        aria-labelledby="paths"
        className="scope-dark my-10 border-y-2 border-edge bg-bg py-14"
      >
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 id="paths" className="text-2xl font-semibold tracking-tight text-fg">
            Learning paths
          </h2>
          <p className="mt-1 text-muted">
            Each path builds on the patterns from the one before. Progress is saved in this browser.
          </p>
          <LearningPaths paths={paths} />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Catalogue */}
        <section id="catalogue" aria-labelledby="catalogue-title" className="scroll-mt-4 pb-16 pt-6">
          <h2 id="catalogue-title" className="text-2xl font-semibold tracking-tight text-fg">
            All systems
          </h2>
          <SystemCatalogue
            cards={cards}
            categories={categories}
            conceptOptions={concepts.map((c) => ({ value: c.slug, label: c.name }))}
          />
        </section>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowRight, Boxes, Cloud, Lightbulb, PlayCircle } from "lucide-react";
import SystemCatalogue, { type CatalogueCard } from "@/components/site/SystemCatalogue";
import HeroDiagram from "@/components/site/HeroDiagram";
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
  { icon: Cloud, title: "Switch clouds", text: "Relabel every component for AWS, Google Cloud, Azure or open source in one click." },
  { icon: PlayCircle, title: "Play walkthroughs", text: "Follow a request hop by hop — upload a video, book a seat, pay a merchant." },
  { icon: Boxes, title: "Inspect components", text: "Every building block with its options per provider, pitfalls and where it's used." },
  { icon: Lightbulb, title: "Learn the patterns", text: "Caching, sharding, fan-out, sagas, idempotency — explained and linked to real designs." },
];

const learningPaths = [
  { title: "Foundations", level: "Start here", slugs: ["url-shortener", "pastebin", "rate-limiter", "typeahead"] },
  { title: "Real-time systems", level: "Intermediate", slugs: ["whatsapp", "websocket-scale", "live-sports", "uber"] },
  { title: "Media at scale", level: "Advanced", slugs: ["instagram", "twitter", "youtube", "netflix"] },
  { title: "Money & bookings", level: "Advanced", slugs: ["bookmyshow", "amazon", "payments", "bnpl"] },
];

export default function HomePage() {
  const hero = getSystem("url-shortener") ?? systems[0];

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
  }));

  const categories = Object.entries(systemCategoryLabels)
    .filter(([value]) => systems.some((s) => s.category === value))
    .map(([value, label]) => ({ value, label }));

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      {/* Hero */}
      <section className="grid items-center gap-10 py-10 md:py-16 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <p className="text-sm font-medium text-accent">
            {systems.length} systems · {components.length} components · {concepts.length} concepts
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-fg md:text-5xl">How are large systems built?</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
            Interactive architectures for YouTube, Uber, Amazon and more — switch between AWS, Google Cloud,
            Azure and open-source tools, and follow every request hop by hop.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/systems/youtube"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-[#fff] transition-opacity hover:opacity-90"
            >
              Explore YouTube <ArrowRight size={16} aria-hidden />
            </Link>
            <a
              href="#catalogue"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-line-strong"
            >
              Browse all systems
            </a>
          </div>
        </div>
        <HeroDiagram system={hero} />
      </section>

      {/* What you can do */}
      <section aria-labelledby="lenses" className="py-6">
        <h2 id="lenses" className="sr-only">
          What you can do
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {lenses.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-2xl border border-line bg-surface p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent" aria-hidden>
                <Icon size={18} />
              </span>
              <h3 className="mt-3 font-semibold text-fg">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Learning paths */}
      <section aria-labelledby="paths" className="py-10">
        <h2 id="paths" className="text-2xl font-semibold tracking-tight text-fg">
          Learning paths
        </h2>
        <p className="mt-1 text-muted">Each path builds on the patterns from the one before.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {learningPaths.map((path) => (
            <article key={path.title} className="rounded-2xl border border-line bg-surface p-5">
              <p className="text-xs font-medium text-accent">{path.level}</p>
              <h3 className="mt-1 font-semibold text-fg">{path.title}</h3>
              <ol className="mt-4 space-y-2">
                {path.slugs.map((slug, i) => {
                  const s = getSystem(slug);
                  if (!s) return null;
                  return (
                    <li key={slug}>
                      <Link href={`/systems/${slug}`} className="group flex items-center gap-3 text-sm">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-semibold text-muted group-hover:bg-accent group-hover:text-[#fff]">
                          {i + 1}
                        </span>
                        <span className="text-fg-soft group-hover:text-fg">{s.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </article>
          ))}
        </div>
      </section>

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
  );
}

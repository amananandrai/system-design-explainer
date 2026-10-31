import Link from "next/link";
import SystemCatalogue, { type CatalogueCard } from "@/components/site/SystemCatalogue";
import {
  components,
  concepts,
  difficultyLabels,
  getConcept,
  systemCategoryLabels,
  systems,
} from "@/content";

export default function HomePage() {
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
    <div className="px-8 py-10">
      <h1 className="text-3xl font-bold text-white">How are large systems built?</h1>
      <p className="mt-2 max-w-2xl text-slate-400">
        Each system walks through requirements, capacity estimates, the data model and an interactive
        architecture you can switch between AWS, Google Cloud, Azure and open-source tools.
      </p>
      <p className="mt-3 text-sm text-slate-500">
        {systems.length} systems ·{" "}
        <Link href="/components" className="text-slate-300 hover:text-white">
          {components.length} components
        </Link>{" "}
        ·{" "}
        <Link href="/concepts" className="text-slate-300 hover:text-white">
          {concepts.length} concepts
        </Link>
      </p>

      <SystemCatalogue
        cards={cards}
        categories={categories}
        conceptOptions={concepts.map((c) => ({ value: c.slug, label: c.name }))}
      />
    </div>
  );
}

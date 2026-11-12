import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { conceptFamilies } from "@/types/schema";
import { conceptFamilyLabels, concepts, systemsUsingConcept } from "@/content";
import { FamilyIcon } from "@/lib/identity";

export const metadata: Metadata = {
  title: "Concepts · System Design Explainer",
  description: "The recurring ideas behind large systems: caching, sharding, fan-out, idempotency, sagas and more.",
};

export default function ConceptsPage() {
  const groups = conceptFamilies
    .map((family) => ({ family, items: concepts.filter((c) => c.family === family) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-fg md:text-4xl">Concepts</h1>
      <p className="mt-2 max-w-2xl text-muted">
        The same handful of ideas appear again and again across the designs. Each page explains one with a
        diagram you can step through — and links to the systems that rely on it.
      </p>

      <nav aria-label="Concept families" className="mt-6 flex flex-wrap gap-2">
        {groups.map(({ family, items }) => (
          <a
            key={family}
            href={`#${family}`}
            data-family={family}
            className="flex items-center gap-2 rounded-full bg-cat-tint px-3 py-1.5 text-sm font-medium text-fg transition-opacity hover:opacity-80"
          >
            <span className="text-cat-ink">
              <FamilyIcon family={family} size={14} />
            </span>
            {conceptFamilyLabels[family]}
            <span className="text-muted">{items.length}</span>
          </a>
        ))}
      </nav>

      <div className="mt-10 space-y-12">
        {groups.map(({ family, items }) => (
          <section key={family} id={family} data-family={family} className="scroll-mt-6">
            <h2 className="flex items-center gap-2.5 text-xl font-semibold text-fg">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cat-tint text-cat-ink">
                <FamilyIcon family={family} size={16} />
              </span>
              {conceptFamilyLabels[family]}
            </h2>
            <ul className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((concept) => {
                const usedIn = systemsUsingConcept(concept.slug);
                return (
                  <li key={concept.slug}>
                    <Link href={`/concepts/${concept.slug}`} className="tile group flex h-full flex-col gap-3 p-[22px]">
                      <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full border-2 border-edge bg-cat text-on-cat">
                        <FamilyIcon family={family} size={22} />
                      </span>
                      {concept.visual && <p className="chip mt-1.5">Interactive</p>}
                      <p className="text-2xl font-semibold leading-tight tracking-tight text-fg">{concept.name}</p>
                      <p className="flex-1 text-[14.5px] leading-relaxed text-fg-soft">{concept.summary}</p>
                      <div className="mt-1.5 flex items-end justify-between gap-3">
                        <ul className="flex flex-wrap gap-1.5" aria-label={usedIn.length > 0 ? "Seen in" : undefined}>
                          {usedIn.length === 0 && (
                            <li className="rounded-full bg-surface px-2.5 py-0.5 text-[11.5px] text-fg-soft">Reference</li>
                          )}
                          {usedIn.slice(0, 3).map((s) => (
                            <li key={s.slug} className="rounded-full bg-surface px-2.5 py-0.5 text-[11.5px] text-fg-soft">
                              {s.name}
                            </li>
                          ))}
                          {usedIn.length > 3 && (
                            <li className="rounded-full bg-surface px-2.5 py-0.5 text-[11.5px] text-fg-soft">
                              +{usedIn.length - 3}
                            </li>
                          )}
                        </ul>
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fg text-bg transition-transform duration-200 group-hover:-rotate-45">
                          <ArrowRight size={16} aria-hidden />
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

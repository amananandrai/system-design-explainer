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

      <nav aria-label="Concept families" className="mt-6 flex flex-wrap gap-2.5">
        {groups.map(({ family, items }) => (
          <a
            key={family}
            href={`#${family}`}
            data-family={family}
            className="fam-chip"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-cat text-on-cat">
              <FamilyIcon family={family} size={14} />
            </span>
            {conceptFamilyLabels[family]}
            <span className="font-mono text-xs text-muted">{items.length}</span>
          </a>
        ))}
      </nav>

      <div className="mt-10 space-y-12">
        {groups.map(({ family, items }) => (
          <section key={family} id={family} data-family={family} className="scroll-mt-6">
            <h2 className="flex items-center gap-2.5 text-xl font-semibold text-fg">
              <span className="flex h-8 w-8 items-center justify-center rounded border-2 border-edge bg-cat text-on-cat">
                <FamilyIcon family={family} size={16} />
              </span>
              {conceptFamilyLabels[family]}
            </h2>
            <ul className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((concept) => {
                const usedIn = systemsUsingConcept(concept.slug);
                return (
                  <li key={concept.slug}>
                    <Link href={`/concepts/${concept.slug}`} className="bp-card flex h-full flex-col overflow-hidden">
                      <header className="flex items-center gap-2.5 border-b-2 border-edge bg-cat px-4 py-3 text-on-cat">
                        <FamilyIcon family={family} size={20} />
                        <p className="min-w-0 flex-1 text-lg font-semibold leading-tight tracking-tight">{concept.name}</p>
                        {concept.visual && (
                          <span className="bp-label shrink-0 rounded-[3px] bg-on-cat px-1.5 py-0.5 font-medium text-cat">
                            Interactive
                          </span>
                        )}
                      </header>
                      <div className="flex flex-1 flex-col gap-3 px-4 py-3.5">
                        <p className="flex-1 text-[14.5px] leading-relaxed text-fg-soft">{concept.summary}</p>
                        {usedIn.length > 0 && (
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Seen in</p>
                            <ul className="mt-1.5 flex flex-wrap gap-1.5">
                              {usedIn.slice(0, 3).map((s) => (
                                <li key={s.slug} className="rounded-[3px] border border-edge px-2 py-0.5 text-xs text-fg-soft">
                                  {s.name}
                                </li>
                              ))}
                              {usedIn.length > 3 && (
                                <li className="rounded-[3px] border border-edge px-2 py-0.5 text-xs text-fg-soft">
                                  +{usedIn.length - 3}
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                      <p className="flex items-center justify-between gap-2 border-t border-dashed border-edge px-4 py-2.5 font-mono text-[11.5px] text-muted">
                        <span>
                          {usedIn.length > 0 ? `${usedIn.length} system${usedIn.length === 1 ? "" : "s"}` : "reference"}
                        </span>
                        <span className="flex items-center gap-1 text-fg">
                          read <ArrowRight size={13} aria-hidden />
                        </span>
                      </p>
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

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { componentsUsingConcept, concepts, getConcept, systemsUsingConcept } from "@/content";
import { KindIcon } from "@/lib/icons";
import { getCategoryColor } from "@/lib/resolve";

export const dynamicParams = false;

export function generateStaticParams() {
  return concepts.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/concepts/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const concept = getConcept(slug);
  if (!concept) return {};
  return { title: `${concept.name} · Concepts · System Design Explainer`, description: concept.summary };
}

export default async function ConceptPage(props: PageProps<"/concepts/[slug]">) {
  const { slug } = await props.params;
  const concept = getConcept(slug);
  if (!concept) notFound();

  const usedBySystems = systemsUsingConcept(concept.slug);
  const usedByComponents = componentsUsingConcept(concept.slug);

  return (
    <div className="max-w-4xl px-4 py-6 md:px-8 md:py-10">
      <Link href="/concepts" className="text-xs text-slate-400 hover:text-white">
        ← All concepts
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-white">{concept.name}</h1>
      <p className="mt-2 text-lg text-slate-300">{concept.summary}</p>

      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-slate-300">
        {concept.explanation.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {concept.howItWorks.length > 0 && <ListCard title="How it works" items={concept.howItWorks} />}
        {concept.tradeoffs.length > 0 && <ListCard title="Trade-offs" items={concept.tradeoffs} />}
      </div>

      {usedBySystems.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-white">Seen in</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {usedBySystems.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/systems/${s.slug}`}
                  className="block rounded-xl border border-slate-800 bg-slate-900/40 p-4 hover:border-slate-600"
                >
                  <span className="font-semibold text-white">{s.name}</span>
                  <span className="mt-0.5 block text-sm text-slate-400">{s.tagline}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {usedByComponents.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-white">Components involved</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {usedByComponents.map((c) => (
              <Link
                key={c.id}
                href={`/components/${c.id}`}
                className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-sm text-slate-200 hover:border-slate-600"
              >
                <span style={{ color: getCategoryColor(c.category) }}>
                  <KindIcon kindId={c.id} size={14} />
                </span>
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {concept.related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-white">Related concepts</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {concept.related.map((r) => (
              <Link
                key={r}
                href={`/concepts/${r}`}
                className="rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-sm text-emerald-300 hover:bg-emerald-500/15"
              >
                {getConcept(r)?.name ?? r}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-300 marker:text-slate-600">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

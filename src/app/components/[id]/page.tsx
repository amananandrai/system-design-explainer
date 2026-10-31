import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ServiceOption, ServiceProvider } from "@/types/schema";
import {
  componentCategoryLabels,
  components,
  getComponentKind,
  getConcept,
  usagesOfComponent,
} from "@/content";
import { providers } from "@/content/providers";
import { KindIcon } from "@/lib/icons";
import { getCategoryColor } from "@/lib/resolve";

export const dynamicParams = false;

export function generateStaticParams() {
  return components.map((c) => ({ id: c.id }));
}

export async function generateMetadata(props: PageProps<"/components/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const kind = getComponentKind(id);
  if (!kind) return {};
  return {
    title: `${kind.name} · Components · System Design Explainer`,
    description: kind.what,
  };
}

const serviceProviders = providers.filter((p) => p.id !== "generic") as (typeof providers[number] & {
  id: ServiceProvider;
})[];

export default async function ComponentPage(props: PageProps<"/components/[id]">) {
  const { id } = await props.params;
  const kind = getComponentKind(id);
  if (!kind) notFound();

  const color = getCategoryColor(kind.category);
  const usages = usagesOfComponent(kind.id);

  return (
    <div className="max-w-5xl px-4 py-6 md:px-8 md:py-10">
      <Link href="/components" className="text-xs text-slate-400 hover:text-white">
        ← All components
      </Link>

      <div className="mt-4 flex items-start gap-4">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color}26`, color }}
        >
          <KindIcon kindId={kind.id} size={24} />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color }}>
            {componentCategoryLabels[kind.category]}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-white">{kind.name}</h1>
          <p className="mt-2 max-w-2xl text-slate-300">{kind.what}</p>
        </div>
      </div>

      {(kind.whenToUse.length > 0 || kind.pitfalls.length > 0) && (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {kind.whenToUse.length > 0 && <ListCard title="When to use" items={kind.whenToUse} />}
          {kind.pitfalls.length > 0 && <ListCard title="Pitfalls" items={kind.pitfalls} />}
        </div>
      )}

      {(Object.keys(kind.providers).length > 0 || kind.thirdParty.length > 0) && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-white">Options by provider</h2>
          <p className="mt-1 text-sm text-slate-400">The first option is what diagrams show for that provider.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {serviceProviders.map((p) => {
              const options = kind.providers[p.id];
              if (!options) return null;
              return (
                <div key={p.id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                  <h3 className="text-sm font-semibold" style={{ color: p.accent }}>
                    {p.name}
                  </h3>
                  <OptionList options={options} />
                </div>
              );
            })}
            {kind.thirdParty.length > 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                <h3 className="text-sm font-semibold text-slate-300">Third-party (works with any cloud)</h3>
                <OptionList options={kind.thirdParty} />
              </div>
            )}
          </div>
        </section>
      )}

      {kind.concepts.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-white">Related concepts</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {kind.concepts.map((slug) => (
              <Link
                key={slug}
                href={`/concepts/${slug}`}
                className="rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-sm text-emerald-300 hover:bg-emerald-500/15"
              >
                {getConcept(slug)?.name ?? slug}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-bold text-white">Used in</h2>
        {usages.length === 0 ? (
          <p className="mt-2 text-sm text-slate-400">Not used in any system yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {usages.map(({ system, nodes }) => (
              <li key={system.slug} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                <Link href={`/systems/${system.slug}`} className="font-semibold text-white hover:underline">
                  {system.name}
                </Link>
                <ul className="mt-2 space-y-1.5">
                  {nodes.map((node) => (
                    <li key={node.id} className="text-sm">
                      <Link
                        href={`/systems/${system.slug}?node=${node.id}#architecture`}
                        className="text-indigo-300 hover:underline"
                      >
                        {node.label}
                      </Link>
                      <span className="text-slate-400"> — {node.role}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function OptionList({ options }: { options: ServiceOption[] }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {options.map((o) => (
        <li key={o.name} className="flex items-baseline justify-between gap-3 text-sm">
          <span className="text-slate-200">
            {o.name}
            {o.note && <span className="text-xs text-slate-400"> — {o.note}</span>}
          </span>
          <span
            className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${
              o.managed ? "bg-sky-500/10 text-sky-300" : "bg-slate-700/50 text-slate-300"
            }`}
          >
            {o.managed ? "Managed" : "Self-hosted"}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</h3>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-300 marker:text-slate-600">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

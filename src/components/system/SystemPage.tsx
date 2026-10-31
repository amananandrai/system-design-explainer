import { Suspense } from "react";
import Link from "next/link";
import type { SystemDesign } from "@/types/schema";
import { difficultyLabels, getConcept, systemCategoryLabels } from "@/content";
import ArchitectureSection from "./ArchitectureSection";
import { NodeChip, PlayFlowButton } from "./JumpLinks";

const methodColors: Record<string, string> = {
  GET: "text-emerald-300 bg-emerald-500/10",
  POST: "text-sky-300 bg-sky-500/10",
  PUT: "text-amber-300 bg-amber-500/10",
  PATCH: "text-amber-300 bg-amber-500/10",
  DELETE: "text-rose-300 bg-rose-500/10",
  WS: "text-violet-300 bg-violet-500/10",
  GRPC: "text-cyan-300 bg-cyan-500/10",
};

/** The nine steps every HLD in the source PDFs follows. Empty ones are skipped. */
function sectionsFor(system: SystemDesign) {
  return [
    { id: "requirements", title: "Requirements", show: system.requirements.functional.length > 0 },
    { id: "apis", title: "API design", show: system.apis.length > 0 },
    { id: "estimates", title: "Capacity estimates", show: system.estimates.length > 0 },
    { id: "data-model", title: "Data model", show: system.dataModel.length > 0 },
    { id: "architecture", title: "Architecture", show: true },
    { id: "flows", title: "Request flows", show: system.flows.length > 0 },
    { id: "bottlenecks", title: "Bottlenecks", show: system.bottlenecks.length > 0 },
    { id: "scaling", title: "Scaling", show: system.scaling.length > 0 },
    { id: "extensions", title: "Extensions", show: system.extensions.length > 0 },
  ].filter((s) => s.show);
}

export default function SystemPage({ system }: { system: SystemDesign }) {
  const sections = sectionsFor(system);
  const number = (id: string) => sections.findIndex((s) => s.id === id) + 1;
  const nodeLabel = (id: string) => system.nodes.find((n) => n.id === id)?.label ?? id;
  const isComplete = system.requirements.functional.length > 0;

  return (
    <>
      <header className="border-b border-slate-800 px-8 pb-6 pt-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300">
          {systemCategoryLabels[system.category]} · {difficultyLabels[system.difficulty]}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">{system.name}</h1>
        <p className="mt-1 text-lg text-slate-300">{system.tagline}</p>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-400">{system.description}</p>
        {system.concepts.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs text-slate-500">Concepts:</span>
            {system.concepts.map((slug) => (
              <Link
                key={slug}
                href={`/concepts/${slug}`}
                className="rounded-full border border-emerald-500/30 bg-emerald-500/5 px-2.5 py-0.5 text-xs text-emerald-300 transition-colors hover:bg-emerald-500/15"
              >
                {getConcept(slug)?.name ?? slug}
              </Link>
            ))}
          </div>
        )}
      </header>

      <nav
        aria-label="Sections"
        className="sticky top-0 z-20 flex gap-1 overflow-x-auto border-b border-slate-800 bg-slate-950/95 px-6 py-2 backdrop-blur"
      >
        {sections.map((s, i) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <span className="mr-1 text-slate-600">{i + 1}</span>
            {s.title}
          </a>
        ))}
      </nav>

      <div className="space-y-14 px-8 py-10">
        {!isComplete && (
          <p className="rounded-xl border border-dashed border-slate-700 px-4 py-3 text-sm text-slate-400">
            The full write-up for {system.name} (requirements, APIs, estimates, data model and flows) is
            still being written. The architecture diagram is ready to explore.
          </p>
        )}

        {system.requirements.functional.length > 0 && (
          <Section id="requirements" n={number("requirements")} title="Requirements">
            <div className="grid gap-6 md:grid-cols-2">
              <ListCard title="Functional" items={system.requirements.functional} />
              <ListCard title="Non-functional" items={system.requirements.nonFunctional} />
            </div>
          </Section>
        )}

        {system.apis.length > 0 && (
          <Section id="apis" n={number("apis")} title="API design">
            <div className="overflow-hidden rounded-xl border border-slate-800">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-slate-800">
                  {system.apis.map((api) => (
                    <tr key={`${api.method} ${api.path}`} className="bg-slate-900/40">
                      <td className="w-20 px-4 py-2.5 align-top">
                        <span
                          className={`rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold ${methodColors[api.method] ?? "text-slate-300"}`}
                        >
                          {api.method}
                        </span>
                      </td>
                      <td className="px-2 py-2.5 align-top font-mono text-[13px] text-slate-100">{api.path}</td>
                      <td className="px-4 py-2.5 text-slate-400">{api.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {system.estimates.length > 0 && (
          <Section id="estimates" n={number("estimates")} title="Capacity estimates">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {system.estimates.map((e) => (
                <div key={e.label} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{e.label}</p>
                  <p className="mt-1 text-2xl font-bold text-white">{e.value}</p>
                  {e.derivation && (
                    <p className="mt-2 font-mono text-[12px] leading-relaxed text-slate-400">{e.derivation}</p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {system.dataModel.length > 0 && (
          <Section id="data-model" n={number("data-model")} title="Data model">
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-900 text-[11px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold">Entity</th>
                    <th className="px-4 py-2.5 font-semibold">Store</th>
                    <th className="px-4 py-2.5 font-semibold">Key</th>
                    <th className="px-4 py-2.5 font-semibold">Fields</th>
                    <th className="px-4 py-2.5 font-semibold">Why</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {system.dataModel.map((d) => (
                    <tr key={d.entity} className="bg-slate-900/40 align-top">
                      <td className="px-4 py-3 font-semibold text-white">{d.entity}</td>
                      <td className="px-4 py-3 text-slate-300">{d.store}</td>
                      <td className="px-4 py-3 font-mono text-[12px] text-indigo-300">{d.key}</td>
                      <td className="px-4 py-3 font-mono text-[12px] text-slate-400">{d.fields.join(", ")}</td>
                      <td className="px-4 py-3 text-slate-400">{d.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        <Section
          id="architecture"
          n={number("architecture")}
          title="Architecture"
          intro="Switch cloud provider to relabel every component, click a component for its alternatives, or play a walkthrough."
        >
          <Suspense fallback={<div className="h-[min(85vh,880px)] rounded-2xl border border-slate-800" />}>
            <ArchitectureSection system={system} />
          </Suspense>
        </Section>

        {system.flows.length > 0 && (
          <Section id="flows" n={number("flows")} title="Request flows">
            <div className="grid gap-4 xl:grid-cols-2">
              {system.flows.map((flow) => (
                <div key={flow.id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-white">{flow.name}</h3>
                    <PlayFlowButton flowId={flow.id} />
                  </div>
                  <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-slate-300 marker:text-slate-600">
                    {flow.steps.map((s) => (
                      <li key={s.edge + s.text}>{s.text}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </Section>
        )}

        {system.bottlenecks.length > 0 && (
          <Section id="bottlenecks" n={number("bottlenecks")} title="Bottlenecks">
            <div className="space-y-3">
              {system.bottlenecks.map((b) => (
                <div key={b.problem} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                  <p className="font-semibold text-rose-200">{b.problem}</p>
                  <p className="mt-1 text-sm text-slate-300">
                    <span className="font-semibold text-emerald-300">Fix: </span>
                    {b.fix}
                  </p>
                  {b.nodes.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {b.nodes.map((id) => (
                        <NodeChip key={id} nodeId={id} label={nodeLabel(id)} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {system.scaling.length > 0 && (
          <Section id="scaling" n={number("scaling")} title="Scaling">
            <BulletList items={system.scaling} />
          </Section>
        )}

        {system.extensions.length > 0 && (
          <Section id="extensions" n={number("extensions")} title="Extensions">
            <BulletList items={system.extensions} />
          </Section>
        )}

        {system.sources.length > 0 && (
          <footer className="border-t border-slate-800 pt-6 text-xs text-slate-500">
            Based on: {system.sources.join(" · ")}
          </footer>
        )}
      </div>
    </>
  );
}

function Section({
  id,
  n,
  title,
  intro,
  children,
}: {
  id: string;
  n: number;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-16">
      <h2 className="flex items-baseline gap-3 text-xl font-bold text-white">
        <span className="text-sm font-semibold text-slate-600">{String(n).padStart(2, "0")}</span>
        {title}
      </h2>
      {intro && <p className="mt-1 text-sm text-slate-400">{intro}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</h3>
      <BulletList items={items} className="mt-3" />
    </div>
  );
}

function BulletList({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-300 marker:text-slate-600 ${className}`}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

"use client";

import Link from "next/link";
import { X } from "lucide-react";
import type { Provider, ServiceOption, ServiceProvider, SystemDesign } from "@/types/schema";
import { getCategoryColor, resolveService } from "@/lib/resolve";
import { getComponentKind, getConcept } from "@/content";
import { getProvider, providers } from "@/content/providers";

interface NodeDetailPanelProps {
  nodeId: string | null;
  system: SystemDesign;
  provider: Provider;
  onClose: () => void;
}

const serviceProviders = providers.filter(
  (p): p is typeof p & { id: ServiceProvider } => p.id !== "generic",
);

function OptionList({ options }: { options: ServiceOption[] }) {
  return (
    <ul className="mt-1 space-y-0.5">
      {options.map((option) => (
        <li key={option.name} className="text-sm text-slate-200">
          {option.name}
          {option.note && <span className="text-xs text-slate-500"> — {option.note}</span>}
        </li>
      ))}
    </ul>
  );
}

export default function NodeDetailPanel({
  nodeId,
  system,
  provider,
  onClose,
}: NodeDetailPanelProps) {
  const systemNode = system.nodes.find((n) => n.id === nodeId);

  if (!systemNode) return null;

  const kind = getComponentKind(systemNode.kind);
  const resolved = resolveService(systemNode, kind, provider);
  const color = getCategoryColor(kind?.category);

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-l border-slate-800 bg-slate-950">
      <div className="flex items-start justify-between border-b border-slate-800 px-5 py-4">
        <div>
          <span
            className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
            style={{ backgroundColor: color }}
          >
            {kind?.name ?? systemNode.kind}
          </span>
          <h2 className="mt-2 text-base font-semibold text-white">{systemNode.label}</h2>
          {resolved.mapped && (
            <p className="mt-0.5 text-sm" style={{ color: getProvider(provider).accent }}>
              {resolved.label}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          aria-label="Close panel"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
        <section>
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Role in {system.name}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-200">{systemNode.role}</p>
        </section>

        {kind && (
          <section>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              What it is
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-300">{kind.what}</p>
          </section>
        )}

        {kind && (Object.keys(kind.providers).length > 0 || kind.thirdParty.length > 0) && (
          <section>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Options by provider
            </h3>
            <div className="mt-2 space-y-2">
              {serviceProviders.map((p) => {
                const options = kind.providers[p.id];
                const override = systemNode.overrides?.[p.id];
                if (!options && !override) return null;
                const active = provider === p.id;
                return (
                  <div
                    key={p.id}
                    className={`rounded-lg border px-3 py-2 ${active ? "" : "border-slate-800"}`}
                    style={active ? { borderColor: p.accent } : undefined}
                  >
                    <p className="text-xs font-semibold" style={{ color: p.accent }}>
                      {p.shortName}
                    </p>
                    {override && (
                      <p className="mt-1 text-sm text-slate-200">
                        {override} <span className="text-xs text-slate-500">— used here</span>
                      </p>
                    )}
                    {options && <OptionList options={options} />}
                  </div>
                );
              })}
              {kind.thirdParty.length > 0 && (
                <div className="rounded-lg border border-slate-800 px-3 py-2">
                  <p className="text-xs font-semibold text-slate-400">Third-party (any cloud)</p>
                  <OptionList options={kind.thirdParty} />
                </div>
              )}
            </div>
          </section>
        )}

        {kind && kind.whenToUse.length > 0 && (
          <section>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              When to use
            </h3>
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm text-slate-300">
              {kind.whenToUse.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        )}

        {kind && kind.pitfalls.length > 0 && (
          <section>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Pitfalls
            </h3>
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm text-slate-300">
              {kind.pitfalls.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        )}

        {kind && kind.concepts.length > 0 && (
          <section>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Concepts
            </h3>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {kind.concepts.map((slug) => (
                <Link
                  key={slug}
                  href={`/concepts/${slug}`}
                  className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-300 hover:bg-emerald-500/20"
                >
                  {getConcept(slug)?.name ?? slug}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {kind && (
        <Link
          href={`/components/${kind.id}`}
          className="border-t border-slate-800 px-5 py-3 text-sm font-medium text-indigo-300 hover:bg-slate-900 hover:text-indigo-200"
        >
          All about {kind.name.toLowerCase()} →
        </Link>
      )}
    </aside>
  );
}

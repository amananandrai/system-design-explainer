import Link from "next/link";
import type { SystemDesign } from "@/types/schema";
import { systemCategoryLabels, systems } from "@/content";

export default function SystemNav({ activeSlug }: { activeSlug?: string }) {
  const grouped = systems.reduce<Record<string, SystemDesign[]>>((acc, system) => {
    (acc[system.category] ??= []).push(system);
    return acc;
  }, {});

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950">
      <Link href="/" className="block border-b border-slate-800 px-4 py-5">
        <span className="text-lg font-bold tracking-tight text-white">System Design Explainer</span>
        <span className="mt-1 block text-xs text-slate-400">How large systems are built, on any cloud</span>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Systems">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="mb-5">
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              {systemCategoryLabels[category as SystemDesign["category"]]}
            </p>
            <ul className="space-y-1">
              {items.map((system) => {
                const active = system.slug === activeSlug;
                return (
                  <li key={system.slug}>
                    <Link
                      href={`/systems/${system.slug}`}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-lg px-3 py-2.5 transition-colors ${
                        active
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <span className="block text-sm font-medium">{system.name}</span>
                      <span
                        className={`mt-0.5 block truncate text-xs ${active ? "text-indigo-200" : "text-slate-500"}`}
                      >
                        {system.tagline}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

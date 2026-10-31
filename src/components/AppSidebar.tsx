"use client";

import type { SystemDesign } from "@/types/schema";
import { systemCategoryLabels } from "@/content";

interface AppSidebarProps {
  systems: SystemDesign[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
}

export default function AppSidebar({
  systems,
  selectedSlug,
  onSelect,
}: AppSidebarProps) {
  const grouped = systems.reduce<Record<string, SystemDesign[]>>(
    (acc, system) => {
      const key = system.category;
      if (!acc[key]) acc[key] = [];
      acc[key].push(system);
      return acc;
    },
    {},
  );

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950">
      <div className="border-b border-slate-800 px-4 py-5">
        <h1 className="text-lg font-bold tracking-tight text-white">System Design Explainer</h1>
        <p className="mt-1 text-xs text-slate-400">
          How large systems are built, on any cloud
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="mb-5">
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              {systemCategoryLabels[category as SystemDesign["category"]]}
            </p>
            <ul className="space-y-1">
              {items.map((system) => (
                <li key={system.slug}>
                  <button
                    type="button"
                    onClick={() => onSelect(system.slug)}
                    className={`w-full rounded-lg px-3 py-2.5 text-left transition-colors ${
                      selectedSlug === system.slug
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span className="block text-sm font-medium">{system.name}</span>
                    <span
                      className={`mt-0.5 block truncate text-xs ${
                        selectedSlug === system.slug ? "text-indigo-200" : "text-slate-500"
                      }`}
                    >
                      {system.tagline}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

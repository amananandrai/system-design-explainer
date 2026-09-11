"use client";

import type { ApplicationArchitecture } from "@/data/types";
import { categoryLabels } from "@/data/applications";

interface AppSidebarProps {
  applications: ApplicationArchitecture[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function AppSidebar({
  applications,
  selectedId,
  onSelect,
}: AppSidebarProps) {
  const grouped = applications.reduce<Record<string, ApplicationArchitecture[]>>(
    (acc, app) => {
      const key = app.category;
      if (!acc[key]) acc[key] = [];
      acc[key].push(app);
      return acc;
    },
    {},
  );

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950">
      <div className="border-b border-slate-800 px-4 py-5">
        <h1 className="text-lg font-bold tracking-tight text-white">ArchViz</h1>
        <p className="mt-1 text-xs text-slate-400">
          Interactive system design diagrams
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {Object.entries(grouped).map(([category, apps]) => (
          <div key={category} className="mb-5">
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              {categoryLabels[category as ApplicationArchitecture["category"]]}
            </p>
            <ul className="space-y-1">
              {apps.map((app) => (
                <li key={app.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(app.id)}
                    className={`w-full rounded-lg px-3 py-2.5 text-left transition-colors ${
                      selectedId === app.id
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span className="block text-sm font-medium">{app.name}</span>
                    <span
                      className={`mt-0.5 block truncate text-xs ${
                        selectedId === app.id ? "text-indigo-200" : "text-slate-500"
                      }`}
                    >
                      {app.tagline}
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

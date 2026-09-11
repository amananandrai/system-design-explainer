"use client";

import type { CloudProvider } from "@/data/types";
import { cloudProviders } from "@/data/cloudMappings";

interface CloudProviderSelectorProps {
  selected: CloudProvider;
  onChange: (provider: CloudProvider) => void;
}

export default function CloudProviderSelector({
  selected,
  onChange,
}: CloudProviderSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
        Cloud
      </span>
      <div className="flex rounded-xl border border-slate-700 bg-slate-900 p-1">
        {cloudProviders.map((provider) => {
          const isActive = selected === provider.id;
          return (
            <button
              key={provider.id}
              type="button"
              onClick={() => onChange(provider.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                isActive
                  ? "text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              style={
                isActive
                  ? { backgroundColor: provider.accent }
                  : undefined
              }
            >
              {provider.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

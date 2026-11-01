"use client";

import type { Provider } from "@/types/schema";
import { providers } from "@/content/providers";

interface CloudProviderSelectorProps {
  selected: Provider;
  onChange: (provider: Provider) => void;
}

export default function CloudProviderSelector({
  selected,
  onChange,
}: CloudProviderSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-xs font-medium text-muted sm:inline">Cloud</span>
      <div className="flex flex-wrap rounded-lg bg-surface-2 p-0.5">
        {providers.map((provider) => {
          const isActive = selected === provider.id;
          return (
            <button
              key={provider.id}
              type="button"
              onClick={() => onChange(provider.id)}
              aria-pressed={isActive}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                isActive
                  ? "shadow-soft text-[var(--on-provider)]"
                  : "text-muted hover:text-fg"
              }`}
              style={
                isActive
                  ? { backgroundColor: provider.accent }
                  : undefined
              }
            >
              {provider.shortName}
            </button>
          );
        })}
      </div>
    </div>
  );
}

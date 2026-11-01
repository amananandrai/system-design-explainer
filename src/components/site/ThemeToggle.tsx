"use client";

import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { applyThemeMode, readThemeMode, subscribeTheme, type ThemeMode } from "@/lib/theme";

const options: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
  { mode: "light", label: "Light", icon: Sun },
  { mode: "dark", label: "Dark", icon: Moon },
  { mode: "system", label: "System", icon: Monitor },
];

/** `compact` shows icons only (for the top bar); labels stay available to screen readers. */
export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const mode = useSyncExternalStore(subscribeTheme, readThemeMode, () => "system" as ThemeMode);

  return (
    <div role="radiogroup" aria-label="Theme" className="flex rounded-lg border border-line bg-surface p-0.5">
      {options.map(({ mode: value, label, icon: Icon }) => {
        const active = mode === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => applyThemeMode(value)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors ${
              compact ? "px-1.5" : "px-2"
            } ${active ? "bg-surface-2 text-fg" : "text-muted hover:text-fg-soft"}`}
          >
            <Icon size={14} aria-hidden />
            {!compact && label}
          </button>
        );
      })}
    </div>
  );
}

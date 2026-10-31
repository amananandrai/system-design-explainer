"use client";

import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { applyThemeMode, readThemeMode, subscribeTheme, type ThemeMode } from "@/lib/theme";

const options: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
  { mode: "light", label: "Light", icon: Sun },
  { mode: "dark", label: "Dark", icon: Moon },
  { mode: "system", label: "System", icon: Monitor },
];

export default function ThemeToggle() {
  const mode = useSyncExternalStore(subscribeTheme, readThemeMode, () => "system" as ThemeMode);

  return (
    <div role="radiogroup" aria-label="Theme" className="flex rounded-lg border border-slate-800 bg-slate-900 p-0.5">
      {options.map(({ mode: value, label, icon: Icon }) => {
        const active = mode === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            title={label}
            onClick={() => applyThemeMode(value)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
              active ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Icon size={13} aria-hidden />
            {label}
          </button>
        );
      })}
    </div>
  );
}

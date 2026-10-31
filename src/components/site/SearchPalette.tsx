"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { searchItems, type SearchItem } from "@/lib/search-match";

const typeColors: Record<SearchItem["type"], string> = {
  System: "text-indigo-300 bg-indigo-500/10",
  Component: "text-sky-300 bg-sky-500/10",
  Concept: "text-emerald-300 bg-emerald-500/10",
};

export default function SearchPalette({
  items,
  open,
  onClose,
}: {
  items: SearchItem[];
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => searchItems(items, query), [items, query]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const close = () => {
    setQuery("");
    setActive(0);
    onClose();
  };

  const go = (item: SearchItem | undefined) => {
    if (!item) return;
    close();
    router.push(item.href);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/70 px-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-slate-800 px-4">
          <Search size={16} className="shrink-0 text-slate-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") close();
              else if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((i) => Math.min(i + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter") go(results[active]);
            }}
            placeholder="Search systems, components, services, concepts…"
            className="h-12 w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          <kbd className="rounded border border-slate-700 px-1.5 py-0.5 text-[10px] text-slate-500">Esc</kbd>
        </div>

        {query && (
          <ul className="max-h-[50vh] overflow-y-auto py-2" role="listbox">
            {results.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-slate-500">No matches for “{query}”</li>
            )}
            {results.map((item, i) => (
              <li key={item.href} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(item)}
                  className={`flex w-full items-start gap-3 px-4 py-2.5 text-left ${i === active ? "bg-slate-800" : ""}`}
                >
                  <span
                    className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${typeColors[item.type]}`}
                  >
                    {item.type}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-white">{item.title}</span>
                    <span className="block truncate text-xs text-slate-400">{item.subtitle}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

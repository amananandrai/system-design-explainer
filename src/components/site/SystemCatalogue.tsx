"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

export interface CatalogueCard {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  categoryLabel: string;
  difficulty: 1 | 2 | 3;
  difficultyLabel: string;
  componentCount: number;
  flowCount: number;
  complete: boolean;
  concepts: { slug: string; name: string }[];
}

interface Option {
  value: string;
  label: string;
}

export default function SystemCatalogue({
  cards,
  categories,
  conceptOptions,
}: {
  cards: CatalogueCard[];
  categories: Option[];
  conceptOptions: Option[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<number | null>(null);
  const [concept, setConcept] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards.filter(
      (c) =>
        (!category || c.category === category) &&
        (!difficulty || c.difficulty === difficulty) &&
        (!concept || c.concepts.some((x) => x.slug === concept)) &&
        (!q || `${c.name} ${c.tagline}`.toLowerCase().includes(q)),
    );
  }, [cards, query, category, difficulty, concept]);

  const filtered = query || category || difficulty || concept;

  return (
    <>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3">
          <Search size={14} className="text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter systems…"
            className="h-9 w-44 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
        </label>

        <ChipGroup
          options={categories}
          value={category}
          onChange={setCategory}
          allLabel="All categories"
        />
        <ChipGroup
          options={[
            { value: "1", label: "Beginner" },
            { value: "2", label: "Intermediate" },
            { value: "3", label: "Advanced" },
          ]}
          value={difficulty ? String(difficulty) : null}
          onChange={(v) => setDifficulty(v ? Number(v) : null)}
          allLabel="Any level"
        />

        <select
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          aria-label="Filter by concept"
          className="h-9 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 focus:outline-none"
        >
          <option value="">Any concept</option>
          {conceptOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {filtered && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory(null);
              setDifficulty(null);
              setConcept("");
            }}
            className="text-xs text-slate-400 underline-offset-2 hover:text-white hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="mt-4 text-xs text-slate-500">
        {visible.length} of {cards.length} systems
      </p>

      <ul className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((card) => (
          <li key={card.slug}>
            <Link
              href={`/systems/${card.slug}`}
              className="flex h-full flex-col rounded-xl border border-slate-800 bg-slate-900/40 p-5 transition-colors hover:border-slate-600 hover:bg-slate-900"
            >
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                {card.categoryLabel} · {card.difficultyLabel}
              </p>
              <p className="mt-1 text-lg font-semibold text-white">{card.name}</p>
              <p className="mt-1 flex-1 text-sm text-slate-400">{card.tagline}</p>
              {card.concepts.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {card.concepts.slice(0, 4).map((c) => (
                    <span key={c.slug} className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300">
                      {c.name}
                    </span>
                  ))}
                  {card.concepts.length > 4 && (
                    <span className="px-1 text-[11px] text-slate-500">+{card.concepts.length - 4}</span>
                  )}
                </div>
              )}
              <p className="mt-3 text-xs text-slate-500">
                {card.componentCount} components · {card.flowCount} walkthroughs
                {!card.complete && " · diagram only"}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {visible.length === 0 && (
        <p className="mt-10 text-center text-sm text-slate-500">No systems match these filters.</p>
      )}
    </>
  );
}

function ChipGroup({
  options,
  value,
  onChange,
  allLabel,
}: {
  options: Option[];
  value: string | null;
  onChange: (value: string | null) => void;
  allLabel: string;
}) {
  return (
    <div className="flex flex-wrap rounded-xl border border-slate-700 bg-slate-900 p-1">
      {[{ value: null, label: allLabel }, ...options].map((o) => (
        <button
          key={o.label}
          type="button"
          onClick={() => onChange(o.value)}
          className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
            value === o.value ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

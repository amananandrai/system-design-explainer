"use client";

import EmptyIllustration from "./EmptyIllustration";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { SystemIcon } from "@/lib/identity";
import SystemSketch from "./SystemSketch";
import type { Sketch } from "@/lib/sketch";

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
  sketch: Sketch;
}

const difficultyText = {
  1: "text-emerald-300",
  2: "text-amber-300",
  3: "text-rose-300",
} as const;

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
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 rounded border border-line-strong bg-surface px-3">
          <Search size={14} className="text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter systems…"
            className="h-9 w-44 bg-transparent text-sm text-fg placeholder:text-muted focus:outline-none"
          />
        </label>

        <ChipGroup options={categories} value={category} onChange={setCategory} allLabel="All categories" categoryDots />
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
          className="h-9 rounded border border-line-strong bg-surface px-3 text-sm text-fg-soft focus:outline-none"
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
            className="text-xs text-muted underline-offset-2 hover:text-fg hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="mt-4 text-xs text-muted">
        {visible.length} of {cards.length} systems
      </p>

      <ul className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((card) => (
          <li key={card.slug} data-category={card.category}>
            <Link
              href={`/systems/${card.slug}`}
              className="bp-card group flex h-full flex-col overflow-hidden"
            >
              <div className="bp-grid border-b-2 border-edge px-3 pb-2 pt-2.5">
                <SystemSketch sketch={card.sketch} />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="chip">
                  <SystemIcon slug={card.slug} size={12} />
                  {card.categoryLabel}
                </p>
                <p className="text-lg font-semibold leading-snug tracking-tight text-fg">{card.name}</p>
                <p className="flex-1 text-sm leading-relaxed text-muted">{card.tagline}</p>
                {card.concepts.length > 0 && (
                  <p className="text-xs leading-relaxed text-fg-soft">
                    {card.concepts
                      .slice(0, 3)
                      .map((c) => c.name)
                      .join(" · ")}
                    {card.concepts.length > 3 && <span className="text-muted"> +{card.concepts.length - 3}</span>}
                  </p>
                )}
                <p className="mt-1 flex flex-wrap justify-between gap-x-3 gap-y-1 border-t border-dashed border-edge pt-2.5 font-mono text-[11.5px] text-muted">
                  <span>
                    {card.componentCount} components · {card.flowCount} flows
                  </span>
                  <span className={`font-medium ${difficultyText[card.difficulty]}`}>
                    L{card.difficulty} {card.difficultyLabel}
                  </span>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {visible.length === 0 && (
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <EmptyIllustration />
          <p className="text-sm text-muted">No systems match these filters.</p>
        </div>
      )}
    </>
  );
}

function ChipGroup({
  options,
  value,
  onChange,
  allLabel,
  categoryDots = false,
}: {
  options: Option[];
  value: string | null;
  onChange: (value: string | null) => void;
  allLabel: string;
  /** Prefix each option with its category colour dot (options' values are category ids). */
  categoryDots?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {[{ value: null, label: allLabel }, ...options].map((o) => (
        <button
          key={o.label}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          data-category={categoryDots && o.value ? o.value : undefined}
          className={`flex h-9 items-center gap-1.5 rounded border px-2.5 font-mono text-xs lowercase transition-colors ${
            value === o.value
              ? categoryDots && o.value
                ? "border-edge bg-cat text-on-cat"
                : "border-edge bg-primary text-on-primary"
              : "border-line text-muted hover:border-line-strong hover:text-fg"
          }`}
        >
          {categoryDots && o.value && <span className="h-1.5 w-1.5 rounded-[1px] bg-cat" aria-hidden />}
          {o.label}
        </button>
      ))}
    </div>
  );
}

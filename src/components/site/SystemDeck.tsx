"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import SystemSketch from "./SystemSketch";
import type { Sketch } from "@/lib/sketch";

export interface DeckCard {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  categoryLabel: string;
  sketch: Sketch;
}

const TURN_MS = 3600;

/** How a card sits at each depth of the stack; anything deeper is hidden behind. */
const depth = [
  "z-30",
  "z-20 translate-y-7 rotate-3 scale-95 opacity-75",
  "z-10 translate-y-14 -rotate-3 scale-90 opacity-50",
];
const hidden = "z-0 translate-y-14 scale-90 opacity-0";

/** Landing-page hero: a fanned stack of system cards that turns through the catalogue. */
export default function SystemDeck({ cards, total }: { cards: DeckCard[]; total: number }) {
  const [front, setFront] = useState(0);
  const [auto, setAuto] = useState(true);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!auto || hovered || cards.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setFront((f) => (f + 1) % cards.length), TURN_MS);
    return () => window.clearInterval(id);
  }, [auto, hovered, cards.length]);

  const turn = (by: number) => {
    setAuto(false);
    setFront((f) => (f + by + cards.length) % cards.length);
  };

  return (
    <div
      className="mx-auto w-full max-w-[520px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div className="relative mx-4 h-[340px] sm:mx-7">
        {cards.map((card, i) => {
          const pos = (i - front + cards.length) % cards.length;
          const isFront = pos === 0;
          return (
            <Link
              key={card.slug}
              href={`/systems/${card.slug}`}
              data-category={card.category}
              aria-hidden={!isFront}
              tabIndex={isFront ? 0 : -1}
              className={`group absolute inset-x-0 top-0 flex origin-bottom flex-col gap-2.5 rounded-[22px] border border-[color-mix(in_srgb,var(--cat)_30%,var(--line))] bg-[color-mix(in_srgb,var(--cat)_14%,var(--surface))] p-[18px] shadow-soft transition-[transform,opacity] duration-500 ease-out ${
                depth[pos] ?? hidden
              } ${isFront ? "" : "pointer-events-none"}`}
            >
              <div className="rounded-xl bg-surface p-2.5">
                <SystemSketch sketch={card.sketch} animated={isFront} />
              </div>
              <p className="text-xs font-semibold text-cat">{card.categoryLabel}</p>
              <p className="text-2xl font-semibold leading-tight tracking-tight text-fg">{card.name}</p>
              <div className="flex items-end justify-between gap-3">
                <p className="text-sm leading-relaxed text-fg-soft">{card.tagline}</p>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fg text-bg transition-transform duration-200 group-hover:-rotate-45">
                  <ArrowRight size={16} aria-hidden />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-16 flex items-center justify-center gap-3.5">
        <DeckButton label="Previous system" onClick={() => turn(-1)}>
          <ChevronLeft size={16} aria-hidden />
        </DeckButton>
        <span className="text-sm text-muted">{total} systems to explore</span>
        <DeckButton label="Next system" onClick={() => turn(1)}>
          <ChevronRight size={16} aria-hidden />
        </DeckButton>
      </div>
    </div>
  );
}

function DeckButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong bg-surface text-fg-soft transition-colors hover:text-fg"
    >
      {children}
    </button>
  );
}

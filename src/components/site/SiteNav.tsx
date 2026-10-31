"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, Lightbulb, Network, Search } from "lucide-react";
import type { SystemCategory } from "@/types/schema";
import type { SearchItem } from "@/lib/search-match";
import SearchPalette from "./SearchPalette";

export interface NavSystem {
  slug: string;
  name: string;
  tagline: string;
  category: SystemCategory;
}

const sections = [
  { href: "/", label: "Systems", icon: Network },
  { href: "/components", label: "Components", icon: Boxes },
  { href: "/concepts", label: "Concepts", icon: Lightbulb },
];

export default function SiteNav({
  systemGroups,
  searchIndex,
}: {
  systemGroups: { label: string; systems: NavSystem[] }[];
  searchIndex: SearchItem[];
}) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && e.target.closest("input, textarea, [contenteditable]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const sectionActive = (href: string) =>
    href === "/" ? pathname === "/" || pathname.startsWith("/systems") : pathname.startsWith(href);

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950">
      <Link href="/" className="block border-b border-slate-800 px-4 py-5">
        <span className="text-lg font-bold tracking-tight text-white">System Design Explainer</span>
        <span className="mt-1 block text-xs text-slate-400">How large systems are built, on any cloud</span>
      </Link>

      <div className="space-y-1 border-b border-slate-800 px-3 py-3">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="mb-2 flex w-full items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-left text-sm text-slate-400 transition-colors hover:border-slate-500 hover:text-slate-200"
        >
          <Search size={14} />
          <span className="flex-1">Search…</span>
          <kbd className="rounded border border-slate-700 px-1.5 text-[10px]">Ctrl K</kbd>
        </button>
        {sections.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              sectionActive(href) ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Systems">
        {systemGroups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              {group.label}
            </p>
            <ul className="space-y-1">
              {group.systems.map((system) => {
                const active = pathname === `/systems/${system.slug}`;
                return (
                  <li key={system.slug}>
                    <Link
                      href={`/systems/${system.slug}`}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-lg px-3 py-2 transition-colors ${
                        active
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <span className="block text-sm font-medium">{system.name}</span>
                      <span className={`mt-0.5 block truncate text-xs ${active ? "text-indigo-200" : "text-slate-500"}`}>
                        {system.tagline}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <SearchPalette items={searchIndex} open={searchOpen} onClose={() => setSearchOpen(false)} />
    </aside>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, ChevronRight, Lightbulb, Menu, Network, Search, X } from "lucide-react";
import type { SystemCategory } from "@/types/schema";
import type { SearchItem } from "@/lib/search-match";
import SearchPalette from "./SearchPalette";
import ThemeToggle from "./ThemeToggle";

export interface NavSystem {
  slug: string;
  name: string;
  tagline: string;
  category: SystemCategory;
}

type SystemGroup = { label: string; systems: NavSystem[] };

const sections = [
  { href: "/", label: "Systems", icon: Network },
  { href: "/components", label: "Components", icon: Boxes },
  { href: "/concepts", label: "Concepts", icon: Lightbulb },
];

/** Static export serves pages with a trailing slash; compare without it. */
const normalise = (path: string) => (path.length > 1 ? path.replace(/\/$/, "") : path);

export default function SiteNav({
  systemGroups,
  searchIndex,
}: {
  systemGroups: SystemGroup[];
  searchIndex: SearchItem[];
}) {
  const pathname = normalise(usePathname());
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && e.target.closest("input, textarea, select, [contenteditable]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openSearch = () => {
    setDrawerOpen(false);
    setSearchOpen(true);
  };

  const content = (
    <NavContent
      pathname={pathname}
      systemGroups={systemGroups}
      onSearch={openSearch}
      onNavigate={() => setDrawerOpen(false)}
    />
  );

  return (
    <>
      {/* Phones: compact top bar; the full nav lives in a drawer. */}
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-800 bg-slate-950 px-4 py-3 md:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation"
          aria-expanded={drawerOpen}
          className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-800"
        >
          <Menu size={20} />
        </button>
        <Link href="/" className="truncate text-base font-bold text-white">
          System Design Explainer
        </Link>
        <button
          type="button"
          onClick={openSearch}
          aria-label="Search"
          className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-800"
        >
          <Search size={20} />
        </button>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-slate-950/70" onClick={() => setDrawerOpen(false)} />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col border-r border-slate-800 bg-slate-950">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation"
              className="absolute right-2 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X size={18} />
            </button>
            {content}
          </aside>
        </div>
      )}

      <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950 md:flex">
        {content}
      </aside>

      <SearchPalette items={searchIndex} open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function NavContent({
  pathname,
  systemGroups,
  onSearch,
  onNavigate,
}: {
  pathname: string;
  systemGroups: SystemGroup[];
  onSearch: () => void;
  onNavigate: () => void;
}) {
  const sectionActive = (href: string) =>
    href === "/" ? pathname === "/" || pathname.startsWith("/systems") : pathname.startsWith(href);

  return (
    <>
      <Link href="/" onClick={onNavigate} className="block border-b border-slate-800 px-4 py-5">
        <span className="text-lg font-bold tracking-tight text-white">System Design Explainer</span>
        <span className="mt-1 block text-xs text-slate-400">How large systems are built, on any cloud</span>
      </Link>

      <div className="space-y-1 border-b border-slate-800 px-3 py-3">
        <button
          type="button"
          onClick={onSearch}
          className="mb-2 flex w-full items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-left text-sm text-slate-400 transition-colors hover:border-slate-500 hover:text-slate-200"
        >
          <Search size={14} aria-hidden />
          <span className="flex-1">Search…</span>
          <kbd className="rounded border border-slate-700 px-1.5 text-[10px]">Ctrl K</kbd>
        </button>
        {sections.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={pathname === href ? "page" : undefined}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              sectionActive(href) ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Icon size={15} aria-hidden />
            {label}
          </Link>
        ))}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="Systems">
        {systemGroups.map((group) => {
          const containsActive = group.systems.some((s) => pathname === `/systems/${s.slug}`);
          return (
            <details key={group.label} open={containsActive || undefined} className="group mb-1">
              <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400 hover:bg-slate-900 hover:text-slate-200 [&::-webkit-details-marker]:hidden">
                <ChevronRight size={12} className="transition-transform group-open:rotate-90" aria-hidden />
                <span className="flex-1">{group.label}</span>
                <span className="font-normal tracking-normal text-slate-400">{group.systems.length}</span>
              </summary>
              <ul className="mb-2 mt-0.5 space-y-0.5 pl-2">
                {group.systems.map((system) => {
                  const active = pathname === `/systems/${system.slug}`;
                  return (
                    <li key={system.slug}>
                      <Link
                        href={`/systems/${system.slug}`}
                        onClick={onNavigate}
                        title={system.tagline}
                        aria-current={active ? "page" : undefined}
                        className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${
                          active
                            ? "bg-indigo-600 font-medium text-[#fff]"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        {system.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </details>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 px-3 py-3">
        <ThemeToggle />
      </div>
    </>
  );
}

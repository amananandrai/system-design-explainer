import Link from "next/link";
import SystemNav from "@/components/system/SystemNav";
import { systemCategoryLabels, systems } from "@/content";

export default function HomePage() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <SystemNav />
      <main className="min-w-0 flex-1 overflow-y-auto px-8 py-10">
        <h1 className="text-3xl font-bold text-white">How are large systems built?</h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          Pick a system to see its requirements, capacity estimates, data model and an interactive
          architecture you can switch between AWS, Google Cloud, Azure and open-source tools.
        </p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {systems.map((system) => (
            <li key={system.slug}>
              <Link
                href={`/systems/${system.slug}`}
                className="block h-full rounded-xl border border-slate-800 bg-slate-900/40 p-5 transition-colors hover:border-slate-600 hover:bg-slate-900"
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  {systemCategoryLabels[system.category]}
                </p>
                <p className="mt-1 text-lg font-semibold text-white">{system.name}</p>
                <p className="mt-1 text-sm text-slate-400">{system.tagline}</p>
                <p className="mt-3 text-xs text-slate-500">
                  {system.nodes.length} components · {system.flows.length} walkthroughs
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

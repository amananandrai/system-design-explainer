import type { Metadata } from "next";
import Link from "next/link";
import { concepts, systemsUsingConcept } from "@/content";

export const metadata: Metadata = {
  title: "Concepts · System Design Explainer",
  description: "The recurring ideas behind large systems: caching, sharding, fan-out, idempotency, sagas and more.",
};

export default function ConceptsPage() {
  return (
    <div className="px-4 py-6 md:px-8 md:py-10">
      <h1 className="text-3xl font-bold text-white">Concepts</h1>
      <p className="mt-2 max-w-2xl text-slate-400">
        The same handful of ideas appear again and again across the designs. Each page explains one and
        links to the systems that rely on it.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {concepts.map((concept) => {
          const usedIn = systemsUsingConcept(concept.slug);
          return (
            <li key={concept.slug}>
              <Link
                href={`/concepts/${concept.slug}`}
                className="flex h-full flex-col rounded-xl border border-slate-800 bg-slate-900/40 p-5 transition-colors hover:border-slate-600 hover:bg-slate-900"
              >
                <p className="font-semibold text-white">{concept.name}</p>
                <p className="mt-1 flex-1 text-sm text-slate-400">{concept.summary}</p>
                <p className="mt-3 text-xs text-slate-400">
                  {usedIn.length > 0 ? `Seen in ${usedIn.map((s) => s.name).join(", ")}` : "Reference"}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

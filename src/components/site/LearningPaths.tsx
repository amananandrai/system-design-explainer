"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useVisitedSystems } from "@/lib/visited";

export interface LearningPath {
  title: string;
  level: string;
  /** Category whose hue tints the path header. */
  hue: string;
  systems: { slug: string; name: string }[];
}

/** Four-segment progress bar: one segment per system in the path. */
function ProgressSegments({ done, total }: { done: number; total: number }) {
  return (
    <div role="img" aria-label={`${done} of ${total} visited`} className="flex gap-[3px]">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`h-[7px] flex-1 border border-edge transition-colors duration-500 ${i < done ? "bg-cat" : "bg-surface-2"}`} />
      ))}
    </div>
  );
}

/** Each card sits a step lower than the one before, so the row reads as a staircase. */
const stairs = ["", "xl:mt-6", "xl:mt-12", "xl:mt-[4.5rem]"];

export default function LearningPaths({ paths }: { paths: LearningPath[] }) {
  const visited = useVisitedSystems();

  return (
    <div className="mt-6 grid items-start gap-4 md:grid-cols-2 xl:grid-cols-4">
      {paths.map((path, index) => {
        const done = path.systems.filter((s) => visited.includes(s.slug)).length;
        const next = path.systems.find((s) => !visited.includes(s.slug));
        return (
          <article
            key={path.title}
            data-category={path.hue}
            className={`bp-card overflow-hidden ${stairs[index] ?? ""}`}
          >
            <header className="border-b-2 border-edge bg-cat px-5 py-3 text-on-cat">
              <p className="bp-label">{path.level}</p>
              <h3 className="mt-0.5 font-semibold">{path.title}</h3>
            </header>
            <div className="px-5 pt-3">
              <ProgressSegments done={done} total={path.systems.length} />
            </div>
            <ol className="space-y-2 px-5 py-4">
              {path.systems.map((s, i) => {
                const seen = visited.includes(s.slug);
                return (
                  <li key={s.slug}>
                    <Link href={`/systems/${s.slug}`} className="group flex items-center gap-3 text-sm">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded font-mono text-xs font-medium transition-colors ${
                          seen
                            ? "bg-cat text-on-cat"
                            : "bg-surface-2 text-muted group-hover:bg-cat-tint group-hover:text-fg"
                        }`}
                      >
                        {seen ? <Check size={13} aria-label="Visited" /> : i + 1}
                      </span>
                      <span className="text-fg-soft group-hover:text-fg">{s.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
            {next ? (
              <Link
                href={`/systems/${next.slug}`}
                className="block border-t border-dashed border-edge px-5 py-2.5 font-mono text-[11.5px] text-fg hover:underline"
              >
                {done > 0 ? "continue" : "start"} → {next.name}
              </Link>
            ) : (
              <p className="border-t border-dashed border-edge px-5 py-2.5 font-mono text-[11.5px] text-fg">
                path complete
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}

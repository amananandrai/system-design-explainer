import type { Metadata } from "next";
import Link from "next/link";
import type { ComponentCategory, ServiceProvider } from "@/types/schema";
import { componentCategoryLabels, components, usagesOfComponent } from "@/content";
import { providers } from "@/content/providers";
import { KindIcon } from "@/lib/icons";
import { getCategoryColor } from "@/lib/resolve";

export const metadata: Metadata = {
  title: "Components · System Design Explainer",
  description: "Every building block used in the system designs, mapped to AWS, Google Cloud, Azure and open-source tools.",
};

const serviceProviders = providers.filter((p) => p.id !== "generic") as (typeof providers[number] & {
  id: ServiceProvider;
})[];

export default function ComponentsPage() {
  const groups = (Object.keys(componentCategoryLabels) as ComponentCategory[])
    .map((category) => ({ category, items: components.filter((c) => c.category === category) }))
    .filter((g) => g.items.length > 0 && g.category !== "client");

  return (
    <div className="px-4 py-6 md:px-8 md:py-10">
      <h1 className="text-3xl font-bold text-fg">Components</h1>
      <p className="mt-2 max-w-2xl text-muted">
        The building blocks behind every design, with the default service on each cloud and open-source
        alternatives. Open one for all the options, when to use it and where it appears.
      </p>

      <div className="mt-8 space-y-10">
        {groups.map(({ category, items }) => (
          <section key={category}>
            <h2 className="bp-label flex items-center gap-2" style={{ color: getCategoryColor(category) }}>
              <span className="h-[7px] w-[7px]" style={{ background: getCategoryColor(category) }} aria-hidden />
              {componentCategoryLabels[category]}
              <span className="text-faint">/ {items.length}</span>
            </h2>
            <div className="mt-2.5 overflow-x-auto rounded-[10px] border-2 border-edge bg-surface shadow-soft">
              <table className="w-full min-w-[900px] border-collapse text-left text-[13.5px]">
                <thead className="bp-grid font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted">
                  <tr className="[&>th+th]:border-l [&>th+th]:border-line [&>th]:border-b-2 [&>th]:border-edge">
                    <th className="w-60 px-3.5 py-2.5 font-medium">Component</th>
                    {serviceProviders.map((p) => (
                      <th key={p.id} className="whitespace-nowrap px-3.5 py-2.5 font-medium" style={{ color: p.accent }}>
                        <span
                          className="mr-1.5 inline-block h-1.5 w-1.5 align-[1px]"
                          style={{ background: p.accent }}
                          aria-hidden
                        />
                        {p.shortName}
                      </th>
                    ))}
                    <th className="w-28 px-3.5 py-2.5 font-medium">Used in</th>
                  </tr>
                </thead>
                <tbody className="[&>tr+tr>td]:border-t [&>tr+tr>td]:border-dashed [&>tr+tr>td]:border-t-line-strong">
                  {items.map((c) => {
                    const used = usagesOfComponent(c.id).length;
                    return (
                      <tr
                        key={c.id}
                        className="align-top transition-colors hover:bg-surface-2 [&>td+td]:border-l [&>td+td]:border-l-line"
                      >
                        <td
                          className="px-3.5 py-2.5"
                          style={{ boxShadow: `inset 5px 0 0 ${getCategoryColor(c.category)}` }}
                        >
                          <Link href={`/components/${c.id}`} className="group flex items-center gap-2.5">
                            <span
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm"
                              style={{ backgroundColor: `color-mix(in srgb, ${getCategoryColor(c.category)} 22%, var(--surface))`, color: getCategoryColor(c.category) }}
                            >
                              <KindIcon kindId={c.id} size={15} />
                            </span>
                            <span className="font-semibold text-fg group-hover:underline">{c.name}</span>
                          </Link>
                        </td>
                        {serviceProviders.map((p) => {
                          const options = c.providers[p.id];
                          return (
                            <td key={p.id} className="px-3.5 py-2.5 text-fg-soft">
                              {options ? (
                                <>
                                  {options[0].name}
                                  {options.length > 1 && (
                                    <span className="ml-1 text-xs text-muted">+{options.length - 1}</span>
                                  )}
                                </>
                              ) : c.thirdParty.length > 0 ? (
                                <span className="text-xs text-muted">Third-party</span>
                              ) : (
                                <span className="text-faint">—</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="whitespace-nowrap px-3.5 py-2.5 font-mono text-xs tabular-nums text-muted">
                          {used > 0 ? `${used} system${used === 1 ? "" : "s"}` : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

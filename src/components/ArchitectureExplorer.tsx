"use client";

import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import AppSidebar from "@/components/AppSidebar";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import CloudProviderSelector from "@/components/CloudProviderSelector";
import NodeDetailPanel from "@/components/NodeDetailPanel";
import { getSystem, systems } from "@/content";
import { providerSchema, type Provider } from "@/types/schema";

/*
 * All view state lives in the URL (?system=…&cloud=…&node=…) so any view can be
 * shared or bookmarked. Writes go through the History API, which Next.js keeps
 * in sync with useSearchParams.
 */
export default function ArchitectureExplorer() {
  const searchParams = useSearchParams();

  const system = getSystem(searchParams.get("system") ?? "") ?? systems[0];
  const parsedProvider = providerSchema.safeParse(searchParams.get("cloud"));
  const provider: Provider = parsedProvider.success ? parsedProvider.data : "generic";
  const requestedNode = searchParams.get("node");
  const selectedNodeId = system.nodes.some((n) => n.id === requestedNode) ? requestedNode : null;

  const updateParams = useCallback(
    (changes: Record<string, string | null>, mode: "push" | "replace") => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value === null) params.delete(key);
        else params.set(key, value);
      }
      const query = params.toString();
      const url = query ? `?${query}` : window.location.pathname;
      if (mode === "push") window.history.pushState(null, "", url);
      else window.history.replaceState(null, "", url);
    },
    [searchParams],
  );

  const handleSystemSelect = useCallback(
    (slug: string) => updateParams({ system: slug, node: null }, "push"),
    [updateParams],
  );

  const handleProviderChange = useCallback(
    (next: Provider) => updateParams({ cloud: next === "generic" ? null : next }, "replace"),
    [updateParams],
  );

  const handleNodeSelect = useCallback(
    (nodeId: string | null) => updateParams({ node: nodeId }, "replace"),
    [updateParams],
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <AppSidebar
        systems={systems}
        selectedSlug={system.slug}
        onSelect={handleSystemSelect}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-800 px-6 py-4">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-white">{system.name}</h2>
            <p className="mt-0.5 truncate text-sm text-slate-400">
              {system.tagline}
            </p>
          </div>
          <CloudProviderSelector selected={provider} onChange={handleProviderChange} />
        </header>

        <div className="shrink-0 border-b border-slate-800 px-6 py-3">
          <p className="text-sm leading-relaxed text-slate-400">
            {system.description}
          </p>
        </div>

        <div className="min-h-0 flex-1 p-4">
          <ArchitectureDiagram
            system={system}
            provider={provider}
            selectedNodeId={selectedNodeId}
            onNodeSelect={handleNodeSelect}
          />
        </div>
      </main>

      <NodeDetailPanel
        nodeId={selectedNodeId}
        system={system}
        provider={provider}
        onClose={() => handleNodeSelect(null)}
      />
    </div>
  );
}

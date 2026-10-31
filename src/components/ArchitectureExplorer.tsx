"use client";

import { useCallback, useMemo, useState } from "react";
import type { Node } from "@xyflow/react";
import AppSidebar from "@/components/AppSidebar";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import CloudProviderSelector from "@/components/CloudProviderSelector";
import NodeDetailPanel from "@/components/NodeDetailPanel";
import { systems } from "@/content";
import type { Provider } from "@/types/schema";
import type { ArchitectureNodeData } from "@/lib/transformDiagram";

export default function ArchitectureExplorer() {
  const [selectedSlug, setSelectedSlug] = useState(systems[0].slug);
  const [provider, setProvider] = useState<Provider>("generic");
  const [selectedNode, setSelectedNode] = useState<Node<ArchitectureNodeData> | null>(
    null,
  );

  const system = useMemo(
    () => systems.find((s) => s.slug === selectedSlug) ?? systems[0],
    [selectedSlug],
  );

  const handleSystemSelect = useCallback((slug: string) => {
    setSelectedSlug(slug);
    setSelectedNode(null);
  }, []);

  const handleProviderChange = useCallback((next: Provider) => {
    setProvider(next);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <AppSidebar
        systems={systems}
        selectedSlug={selectedSlug}
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
            onNodeSelect={setSelectedNode}
          />
        </div>
      </main>

      <NodeDetailPanel
        node={selectedNode}
        system={system}
        provider={provider}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
}

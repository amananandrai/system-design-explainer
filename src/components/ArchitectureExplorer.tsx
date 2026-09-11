"use client";

import { useCallback, useMemo, useState } from "react";
import type { Node } from "@xyflow/react";
import AppSidebar from "@/components/AppSidebar";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import CloudProviderSelector from "@/components/CloudProviderSelector";
import NodeDetailPanel from "@/components/NodeDetailPanel";
import { applications } from "@/data/applications";
import type { CloudProvider } from "@/data/types";
import type { ArchitectureNodeData } from "@/lib/transformDiagram";

export default function ArchitectureExplorer() {
  const [selectedAppId, setSelectedAppId] = useState(applications[0].id);
  const [provider, setProvider] = useState<CloudProvider>("generic");
  const [selectedNode, setSelectedNode] = useState<Node<ArchitectureNodeData> | null>(
    null,
  );

  const architecture = useMemo(
    () => applications.find((app) => app.id === selectedAppId) ?? applications[0],
    [selectedAppId],
  );

  const handleAppSelect = useCallback((id: string) => {
    setSelectedAppId(id);
    setSelectedNode(null);
  }, []);

  const handleProviderChange = useCallback((next: CloudProvider) => {
    setProvider(next);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <AppSidebar
        applications={applications}
        selectedId={selectedAppId}
        onSelect={handleAppSelect}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-800 px-6 py-4">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-white">{architecture.name}</h2>
            <p className="mt-0.5 truncate text-sm text-slate-400">
              {architecture.tagline}
            </p>
          </div>
          <CloudProviderSelector selected={provider} onChange={handleProviderChange} />
        </header>

        <div className="shrink-0 border-b border-slate-800 px-6 py-3">
          <p className="text-sm leading-relaxed text-slate-400">
            {architecture.description}
          </p>
        </div>

        <div className="min-h-0 flex-1 p-4">
          <ArchitectureDiagram
            architecture={architecture}
            provider={provider}
            onNodeSelect={setSelectedNode}
          />
        </div>
      </main>

      <NodeDetailPanel
        node={selectedNode}
        provider={provider}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import ArchitectureNode from "./ArchitectureNode";
import TierNode from "./TierNode";
import type { Provider, SystemDesign } from "@/types/schema";
import { edgeStyles, systemToFlow, type FlowHighlight } from "@/lib/transformDiagram";
import { layoutSystem, type SystemLayout } from "@/lib/layout";

const nodeTypes = { architecture: ArchitectureNode, tier: TierNode };

interface ArchitectureDiagramProps {
  system: SystemDesign;
  provider: Provider;
  selectedNodeId: string | null;
  flowHighlight?: FlowHighlight | null;
  onNodeSelect: (nodeId: string | null) => void;
}

export default function ArchitectureDiagram({
  system,
  provider,
  selectedNodeId,
  flowHighlight = null,
  onNodeSelect,
}: ArchitectureDiagramProps) {
  const [computed, setComputed] = useState<{ slug: string; layout: SystemLayout } | null>(null);

  useEffect(() => {
    let active = true;
    layoutSystem(system).then((layout) => {
      if (active) setComputed({ slug: system.slug, layout });
    });
    return () => {
      active = false;
    };
  }, [system]);

  const layout = computed?.slug === system.slug ? computed.layout : null;

  const graph = useMemo(
    () => (layout ? systemToFlow(system, provider, layout, selectedNodeId, flowHighlight) : null),
    [system, provider, layout, selectedNodeId, flowHighlight],
  );

  const protocols = useMemo(
    () => [
      ...new Set(
        system.edges.map((e) => (!e.protocol || e.protocol === "https" ? "default" : e.protocol)),
      ),
    ],
    [system],
  );

  return (
    <div className="relative h-full w-full rounded-2xl border border-slate-800 bg-slate-950/50">
      {graph ? (
        // Remount per system so fitView frames each new diagram.
        <FlowCanvas
          key={system.slug}
          nodes={graph.nodes}
          edges={graph.edges}
          protocols={protocols}
          onNodeSelect={onNodeSelect}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-slate-400">
          Laying out diagram…
        </div>
      )}
    </div>
  );
}

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  protocols: (keyof typeof edgeStyles)[];
  onNodeSelect: (nodeId: string | null) => void;
}

function FlowCanvas({ nodes: nextNodes, edges: nextEdges, protocols, onNodeSelect }: FlowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(nextNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(nextEdges);

  useEffect(() => {
    setNodes(nextNodes);
    setEdges(nextEdges);
  }, [nextNodes, nextEdges, setNodes, setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={(_, node) => node.type === "architecture" && onNodeSelect(node.id)}
      onPaneClick={() => onNodeSelect(null)}
      nodeTypes={nodeTypes}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable
      fitView
      fitViewOptions={{ padding: 0.12 }}
      minZoom={0.2}
      maxZoom={1.75}
      proOptions={{ hideAttribution: true }}
      className="architecture-flow"
    >
      <Background gap={20} size={1} color="var(--color-slate-800)" />
      <Controls
        showInteractive={false}
        className="!border-slate-700 !bg-slate-900 !shadow-lg [&>button]:!border-slate-600 [&>button]:!bg-slate-800 [&>button]:!text-slate-200 [&>button:hover]:!bg-slate-700"
      />
      <Panel position="top-right">
        <ul className="space-y-1 rounded-lg border border-slate-800 bg-slate-950/90 px-3 py-2">
          {protocols.map((p) => {
            const style = edgeStyles[p];
            return (
              <li key={p} className="flex items-center gap-2 text-[11px] text-slate-400">
                <svg width="28" height="6" aria-hidden>
                  <line
                    x1="0"
                    y1="3"
                    x2="28"
                    y2="3"
                    stroke={style.color}
                    strokeWidth="2"
                    strokeDasharray={style.dash}
                  />
                </svg>
                {style.label}
              </li>
            );
          })}
        </ul>
      </Panel>
    </ReactFlow>
  );
}

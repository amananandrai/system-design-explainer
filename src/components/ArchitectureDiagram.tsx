"use client";

import { useCallback, useEffect, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type OnSelectionChangeParams,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import ArchitectureNode from "./ArchitectureNode";
import type { Provider, SystemDesign } from "@/types/schema";
import {
  systemToFlow,
  type ArchitectureNodeData,
} from "@/lib/transformDiagram";
import { getCategoryColor } from "@/lib/resolve";

const nodeTypes = { architecture: ArchitectureNode };

interface ArchitectureDiagramProps {
  system: SystemDesign;
  provider: Provider;
  onNodeSelect: (node: Node<ArchitectureNodeData> | null) => void;
}

export default function ArchitectureDiagram({
  system,
  provider,
  onNodeSelect,
}: ArchitectureDiagramProps) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => systemToFlow(system, provider),
    [system, provider],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    const transformed = systemToFlow(system, provider);
    setNodes(transformed.nodes);
    setEdges(transformed.edges);
  }, [system, provider, setNodes, setEdges]);

  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: OnSelectionChangeParams) => {
      const selected = selectedNodes[0] as Node<ArchitectureNodeData> | undefined;
      onNodeSelect(selected ?? null);
    },
    [onNodeSelect],
  );

  return (
    <div className="h-full w-full rounded-2xl border border-slate-800 bg-slate-950/50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        className="architecture-flow"
      >
        <Background gap={20} size={1} color="#1e293b" />
        <Controls className="!bg-slate-900 !border-slate-700 !shadow-lg [&>button]:!bg-slate-800 [&>button]:!border-slate-600 [&>button]:!text-slate-200 [&>button:hover]:!bg-slate-700" />
        <MiniMap
          nodeColor={(node) => getCategoryColor((node.data as ArchitectureNodeData).category)}
          maskColor="rgba(15, 23, 42, 0.75)"
          className="!bg-slate-900 !border-slate-700"
        />
      </ReactFlow>
    </div>
  );
}

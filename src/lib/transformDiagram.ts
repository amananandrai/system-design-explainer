import type { Node, Edge } from "@xyflow/react";
import type { ComponentCategory, Provider, SystemDesign } from "@/types/schema";
import { getComponentKind } from "@/content";
import { resolveService } from "./resolve";

export interface ArchitectureNodeData extends Record<string, unknown> {
  nodeId: string;
  kindId: string;
  label: string;
  genericLabel: string;
  role: string;
  category: ComponentCategory | undefined;
  provider: Provider;
  mapped: boolean;
}

export function systemToFlow(
  system: SystemDesign,
  provider: Provider,
): { nodes: Node<ArchitectureNodeData>[]; edges: Edge[] } {
  const nodes: Node<ArchitectureNodeData>[] = system.nodes.map((node, index) => {
    const kind = getComponentKind(node.kind);
    const resolved = resolveService(node, kind, provider);

    return {
      id: node.id,
      type: "architecture",
      // Grid fallback until auto-layout replaces hand-placed positions.
      position: node.position ?? { x: (index % 5) * 240, y: Math.floor(index / 5) * 140 },
      data: {
        nodeId: node.id,
        kindId: node.kind,
        label: resolved.label,
        genericLabel: node.label,
        role: node.role,
        category: kind?.category,
        provider,
        mapped: resolved.mapped,
      },
    };
  });

  const edges: Edge[] = system.edges.map((edge) => ({
    id: edge.id,
    source: edge.from,
    target: edge.to,
    label: edge.label,
    animated: edge.protocol === "async" || edge.protocol === "stream",
    style: { stroke: "#475569", strokeWidth: 1.5 },
    labelStyle: { fill: "#94a3b8", fontSize: 11 },
  }));

  return { nodes, edges };
}

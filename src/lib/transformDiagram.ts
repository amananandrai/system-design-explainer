import { MarkerType, type Edge, type Node } from "@xyflow/react";
import type { ComponentCategory, Provider, SystemDesign, SystemEdge } from "@/types/schema";
import { getComponentKind } from "@/content";
import { resolveService } from "./resolve";
import type { SystemLayout } from "./layout";

export interface ArchitectureNodeData extends Record<string, unknown> {
  kindId: string;
  kindName: string;
  label: string;
  genericLabel: string;
  category: ComponentCategory | undefined;
  mapped: boolean;
}

export interface TierNodeData extends Record<string, unknown> {
  label: string;
}

type Protocol = NonNullable<SystemEdge["protocol"]> | "default";

export const edgeStyles: Record<Protocol, { label: string; color: string; dash?: string; animated?: boolean }> = {
  default: { label: "Request (HTTPS)", color: "#64748b" },
  https: { label: "Request (HTTPS)", color: "#64748b" },
  grpc: { label: "Internal RPC (gRPC)", color: "#38bdf8" },
  ws: { label: "Persistent connection (WebSocket)", color: "#4ade80" },
  async: { label: "Async message / job", color: "#c084fc", dash: "6 4", animated: true },
  stream: { label: "Event stream", color: "#2dd4bf", dash: "6 4", animated: true },
  cdc: { label: "Change data capture", color: "#fb923c", dash: "2 4" },
};

export function systemToFlow(
  system: SystemDesign,
  provider: Provider,
  layout: SystemLayout,
  selectedNodeId: string | null,
): { nodes: Node[]; edges: Edge[] } {
  const tierNodes: Node<TierNodeData>[] = layout.tierBoxes.map((box) => ({
    id: `tier-${box.id}`,
    type: "tier",
    position: { x: box.x, y: box.y },
    data: { label: box.label },
    style: { width: box.width, height: box.height },
    draggable: false,
    selectable: false,
    focusable: false,
    zIndex: -1,
  }));

  const componentNodes: Node<ArchitectureNodeData>[] = system.nodes.map((node) => {
    const kind = getComponentKind(node.kind);
    const resolved = resolveService(node, kind, provider);

    return {
      id: node.id,
      type: "architecture",
      position: layout.positions[node.id] ?? { x: 0, y: 0 },
      selected: node.id === selectedNodeId,
      data: {
        kindId: node.kind,
        kindName: kind?.name ?? node.kind,
        label: resolved.label,
        genericLabel: node.label,
        category: kind?.category,
        mapped: resolved.mapped,
      },
    };
  });

  const edges: Edge[] = system.edges.map((edge) => {
    const style = edgeStyles[edge.protocol ?? "default"];
    const touchesSelection =
      selectedNodeId !== null && (edge.from === selectedNodeId || edge.to === selectedNodeId);
    const dimmed = selectedNodeId !== null && !touchesSelection;

    return {
      id: edge.id,
      source: edge.from,
      target: edge.to,
      type: "smoothstep",
      label: edge.label,
      animated: style.animated,
      markerEnd: { type: MarkerType.ArrowClosed, color: style.color, width: 16, height: 16 },
      style: {
        stroke: style.color,
        strokeWidth: touchesSelection ? 2.5 : 1.5,
        strokeDasharray: style.dash,
        opacity: dimmed ? 0.25 : 1,
      },
      labelStyle: { fill: "#cbd5e1", fontSize: 11 },
      labelBgStyle: { fill: "#0f172a" },
      labelBgPadding: [4, 2] as [number, number],
      zIndex: touchesSelection ? 1 : 0,
    };
  });

  return { nodes: [...tierNodes, ...componentNodes], edges };
}

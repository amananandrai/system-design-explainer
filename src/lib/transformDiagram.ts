import type { Node, Edge } from "@xyflow/react";
import type { ApplicationArchitecture, CloudProvider } from "@/data/types";
import {
  categoryColors,
  cloudProviders,
  getServiceDescription,
  getServiceLabel,
} from "@/data/cloudMappings";

export interface ArchitectureNodeData extends Record<string, unknown> {
  label: string;
  genericLabel: string;
  cloudLabel: string;
  description: string;
  serviceType: string;
  category: string;
  provider: CloudProvider;
  providerColor: string;
}

export function architectureToFlow(
  architecture: ApplicationArchitecture,
  provider: CloudProvider,
): { nodes: Node<ArchitectureNodeData>[]; edges: Edge[] } {
  const providerMeta = cloudProviders.find((p) => p.id === provider)!;

  const nodes: Node<ArchitectureNodeData>[] = architecture.nodes.map((node) => {
    const cloudLabel = getServiceLabel(node.serviceType, provider, node.label);

    return {
      id: node.id,
      type: "architecture",
      position: node.position,
      data: {
        label: provider === "generic" ? node.label : cloudLabel,
        genericLabel: node.label,
        cloudLabel,
        description: node.description,
        serviceType: node.serviceType,
        category: node.category,
        provider,
        providerColor: providerMeta.accent,
      },
    };
  });

  const edges: Edge[] = architecture.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    animated: edge.animated,
    style: { stroke: "#475569", strokeWidth: 1.5 },
    labelStyle: { fill: "#94a3b8", fontSize: 11 },
  }));

  return { nodes, edges };
}

export function getCategoryColor(category: string): string {
  return categoryColors[category] ?? "#64748b";
}

export function getNodeDetailLines(
  data: ArchitectureNodeData,
  provider: CloudProvider,
): { label: string; value: string }[] {
  const providerName = cloudProviders.find((p) => p.id === provider)?.name ?? provider;
  const serviceDesc = getServiceDescription(data.serviceType);

  return [
    { label: "Component", value: data.genericLabel },
    ...(provider !== "generic"
      ? [{ label: providerName + " Service", value: data.cloudLabel }]
      : []),
    { label: "Category", value: data.category },
    { label: "Description", value: data.description },
    ...(serviceDesc ? [{ label: "Service Type", value: serviceDesc }] : []),
  ];
}

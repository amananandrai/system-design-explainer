import type { ComponentType } from "../cloud-providers";

export interface ArchitectureNode {
  id: string;
  label: string;
  componentType: ComponentType;
  description: string;
  position: { x: number; y: number };
}

export interface ArchitectureEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface Architecture {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: "consumer" | "infrastructure" | "ecommerce" | "social";
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
}

export interface AppCatalogItem {
  id: string;
  name: string;
  tagline: string;
  category: Architecture["category"];
  color: string;
}

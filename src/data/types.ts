export type CloudProvider = "generic" | "aws" | "azure" | "gcp";

export type ServiceCategory =
  | "client"
  | "network"
  | "compute"
  | "storage"
  | "database"
  | "cache"
  | "messaging"
  | "analytics"
  | "security";

export interface ArchitectureNode {
  id: string;
  serviceType: string;
  label: string;
  description: string;
  category: ServiceCategory;
  position: { x: number; y: number };
}

export interface ArchitectureEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}

export interface ApplicationArchitecture {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: "social" | "streaming" | "ecommerce" | "transport" | "infrastructure" | "messaging";
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
}

export interface CloudServiceMapping {
  generic: string;
  aws: string;
  azure: string;
  gcp: string;
  description: string;
}

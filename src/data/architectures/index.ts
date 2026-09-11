import { uberArchitecture } from "./uber";
import { youtubeArchitecture } from "./youtube";
import { instagramArchitecture } from "./instagram";
import { amazonArchitecture } from "./amazon";
import { redisArchitecture } from "./redis";
import type { Architecture, AppCatalogItem } from "./types";

export const ARCHITECTURES: Architecture[] = [
  uberArchitecture,
  youtubeArchitecture,
  instagramArchitecture,
  amazonArchitecture,
  redisArchitecture,
];

export const APP_CATALOG: AppCatalogItem[] = ARCHITECTURES.map((arch) => ({
  id: arch.id,
  name: arch.name,
  tagline: arch.tagline,
  category: arch.category,
  color: CATEGORY_COLORS[arch.category],
}));

export const CATEGORY_COLORS: Record<Architecture["category"], string> = {
  consumer: "#8B5CF6",
  social: "#EC4899",
  ecommerce: "#F59E0B",
  infrastructure: "#EF4444",
};

export const CATEGORY_LABELS: Record<Architecture["category"], string> = {
  consumer: "Consumer Apps",
  social: "Social Media",
  ecommerce: "E-Commerce",
  infrastructure: "Infrastructure",
};

export function getArchitecture(id: string): Architecture | undefined {
  return ARCHITECTURES.find((a) => a.id === id);
}

export type { Architecture, AppCatalogItem };

import {
  componentKindSchema,
  systemSchema,
  type ComponentKind,
  type SystemCategory,
  type SystemDesign,
} from "@/types/schema";
import { componentCatalogue } from "./components";
import { systemInputs } from "./systems";

/** Parsed content with defaults applied. Throws at build time if a file is malformed. */
export const components: ComponentKind[] = componentCatalogue.map((c) => componentKindSchema.parse(c));
export const systems: SystemDesign[] = systemInputs.map((s) => systemSchema.parse(s));

const componentsById = new Map(components.map((c) => [c.id, c]));

export function getComponentKind(id: string): ComponentKind | undefined {
  return componentsById.get(id);
}

export function getSystem(slug: string): SystemDesign | undefined {
  return systems.find((s) => s.slug === slug);
}

export const systemCategoryLabels: Record<SystemCategory, string> = {
  "media-social": "Media & Social",
  mobility: "Mobility & Logistics",
  "commerce-fintech": "Commerce & Fintech",
  bookings: "Bookings & Marketplaces",
  infrastructure: "Building Blocks",
};

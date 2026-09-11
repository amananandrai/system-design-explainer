import type { ApplicationArchitecture } from "../types";
import { uber } from "./uber";
import { youtube } from "./youtube";
import { instagram } from "./instagram";
import { amazon } from "./amazon";
import { redis } from "./redis";
import { netflix } from "./netflix";
import { whatsapp } from "./whatsapp";

export const applications: ApplicationArchitecture[] = [
  uber,
  youtube,
  instagram,
  amazon,
  netflix,
  whatsapp,
  redis,
];

export function getApplication(id: string): ApplicationArchitecture | undefined {
  return applications.find((app) => app.id === id);
}

export const categoryLabels: Record<ApplicationArchitecture["category"], string> = {
  transport: "Transport",
  streaming: "Streaming",
  social: "Social",
  ecommerce: "E-Commerce",
  infrastructure: "Infrastructure",
  messaging: "Messaging",
};

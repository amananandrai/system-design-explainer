import type { SystemDesignInput } from "@/types/schema";
import { uber } from "./uber";
import { youtube } from "./youtube";
import { instagram } from "./instagram";
import { amazon } from "./amazon";
import { netflix } from "./netflix";
import { whatsapp } from "./whatsapp";
import { redis } from "./redis";

export const systemInputs: SystemDesignInput[] = [
  youtube,
  netflix,
  instagram,
  whatsapp,
  uber,
  amazon,
  redis,
];

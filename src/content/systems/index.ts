import type { SystemDesignInput } from "@/types/schema";
import { uber } from "./uber";
import { youtube } from "./youtube";
import { instagram } from "./instagram";
import { twitter } from "./twitter";
import { amazon } from "./amazon";
import { netflix } from "./netflix";
import { whatsapp } from "./whatsapp";
import { payments } from "./payments";
import { urlShortener } from "./url-shortener";
import { rateLimiter } from "./rate-limiter";
import { redis } from "./redis";

export const systemInputs: SystemDesignInput[] = [
  youtube,
  netflix,
  instagram,
  twitter,
  whatsapp,
  uber,
  amazon,
  payments,
  urlShortener,
  rateLimiter,
  redis,
];

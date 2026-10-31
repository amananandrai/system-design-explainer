import type { Provider } from "@/types/schema";

export interface ProviderMeta {
  id: Provider;
  name: string;
  shortName: string;
  accent: string;
}

export const providers: ProviderMeta[] = [
  { id: "generic", name: "Generic", shortName: "Generic", accent: "#94a3b8" },
  { id: "aws", name: "Amazon Web Services", shortName: "AWS", accent: "#ff9900" },
  { id: "gcp", name: "Google Cloud", shortName: "GCP", accent: "#669df6" },
  { id: "azure", name: "Microsoft Azure", shortName: "Azure", accent: "#50a0e8" },
  { id: "oss", name: "Open source / self-hosted", shortName: "Open source", accent: "#4ade80" },
];

export function getProvider(id: Provider): ProviderMeta {
  return providers.find((p) => p.id === id) ?? providers[0];
}

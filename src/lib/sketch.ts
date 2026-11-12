import type { SystemDesign } from "@/types/schema";

/**
 * A five-box thumbnail of a design for its catalogue card: the entry point, the
 * component it calls, two things that component fans out to, and one store or
 * service behind them. Every box and every line is a real node and edge.
 */
export interface Sketch {
  /** Slots: 0 entry · 1 hub · 2 upper branch · 3 lower branch · 4 sink. */
  labels: (string | null)[];
  /** Slot pairs to connect, e.g. "1-2". */
  links: string[];
}

const MAX_LABEL = 12;

function short(label: string): string {
  const trimmed = label.replace(/\s+(service|servers?|cluster)$/i, "");
  return trimmed.length > MAX_LABEL ? `${trimmed.slice(0, MAX_LABEL - 1).replace(/[\s/&(,-]+$/, "")}…` : trimmed;
}

export function buildSketch(system: SystemDesign): Sketch {
  const label = new Map(system.nodes.map((n) => [n.id, n.label]));
  const out = new Map<string, string[]>();
  for (const e of system.edges) {
    if (e.from === e.to || !label.has(e.from) || !label.has(e.to)) continue;
    const targets = out.get(e.from) ?? [];
    if (!targets.includes(e.to)) targets.push(e.to);
    out.set(e.from, targets);
  }
  const connected = (a: string, b: string) => out.get(a)?.includes(b) || out.get(b)?.includes(a);

  // Walk edges in walkthrough order first, so the sketch follows the main request path.
  const byId = new Map(system.edges.map((e) => [e.id, e]));
  const ordered = [
    ...system.flows.flatMap((f) => f.steps.flatMap((s) => byId.get(s.edge) ?? [])),
    ...system.edges,
  ];

  let best: { ids: (string | null)[]; score: number } | null = null;
  for (const { from, to: hub } of ordered) {
    const branches = (out.get(hub) ?? []).filter((id) => id !== from);
    if (from === hub || branches.length < 2) continue;
    for (let i = 0; i < branches.length && (best?.score ?? 0) < 2; i++) {
      for (let j = i + 1; j < branches.length; j++) {
        const [a, b] = [branches[i], branches[j]];
        const taken = new Set([from, hub, a, b]);
        const sinks = system.nodes.map((n) => n.id).filter((id) => !taken.has(id));
        const shared = sinks.find((id) => connected(a, id) && connected(b, id));
        const single = shared ?? sinks.find((id) => connected(a, id) || connected(b, id));
        const score = shared ? 2 : single ? 1 : 0;
        if (!best || score > best.score) best = { ids: [from, hub, a, b, single ?? null], score };
        if (score === 2) break;
      }
    }
    if (best?.score === 2) break;
  }

  if (!best) {
    // No fan-out anywhere: show the first hops as a straight line.
    const chain: string[] = [];
    for (const e of ordered) {
      if (chain.length === 0) chain.push(e.from, e.to);
      else if (e.from === chain[chain.length - 1] && !chain.includes(e.to)) chain.push(e.to);
      if (chain.length === 2) break;
    }
    if (chain.length === 0) chain.push(system.nodes[0].id);
    return {
      labels: [chain[0], chain[1] ?? null, null, null, null].map((id) => (id ? short(label.get(id)!) : null)),
      links: chain.length > 1 ? ["0-1"] : [],
    };
  }

  const [, , a, b, sink] = best.ids;
  const links = ["0-1", "1-2", "1-3"];
  if (sink && connected(a!, sink)) links.push("2-4");
  if (sink && connected(b!, sink)) links.push("3-4");
  return { labels: best.ids.map((id) => (id ? short(label.get(id)!) : null)), links };
}

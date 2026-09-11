"use client";

import { X } from "lucide-react";
import type { Node } from "@xyflow/react";
import type { CloudProvider } from "@/data/types";
import {
  getCategoryColor,
  getNodeDetailLines,
  type ArchitectureNodeData,
} from "@/lib/transformDiagram";
import { cloudProviders } from "@/data/cloudMappings";

interface NodeDetailPanelProps {
  node: Node<ArchitectureNodeData> | null;
  provider: CloudProvider;
  onClose: () => void;
}

export default function NodeDetailPanel({
  node,
  provider,
  onClose,
}: NodeDetailPanelProps) {
  if (!node) {
    return (
      <aside className="flex h-full w-72 shrink-0 flex-col border-l border-slate-800 bg-slate-950 px-5 py-6">
        <h2 className="text-sm font-semibold text-white">Component Details</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Click any node in the diagram to inspect its role and see how it maps
          across cloud providers.
        </p>
        <div className="mt-6 rounded-xl border border-dashed border-slate-700 p-4">
          <p className="text-xs text-slate-500">
            Tip: Switch between Generic, AWS, Azure, and GCP to instantly
            relabel every component with the equivalent managed service.
          </p>
        </div>
      </aside>
    );
  }

  const data = node.data;
  const lines = getNodeDetailLines(data, provider);
  const color = getCategoryColor(data.category);
  const providerName = cloudProviders.find((p) => p.id === provider)?.name;

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-l border-slate-800 bg-slate-950">
      <div className="flex items-start justify-between border-b border-slate-800 px-5 py-4">
        <div>
          <span
            className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
            style={{ backgroundColor: color }}
          >
            {data.category}
          </span>
          <h2 className="mt-2 text-base font-semibold text-white">{data.label}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          aria-label="Close panel"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <dl className="space-y-4">
          {lines.map((line) => (
            <div key={line.label}>
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {line.label}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-slate-200">
                {line.value}
              </dd>
            </div>
          ))}
        </dl>

        {provider !== "generic" && (
          <div
            className="mt-6 rounded-xl border p-4"
            style={{ borderColor: cloudProviders.find((p) => p.id === provider)?.accent + "55" }}
          >
            <p className="text-xs font-medium text-slate-300">
              Mapped to {providerName}
            </p>
            <p className="mt-1 text-sm font-semibold text-white">{data.cloudLabel}</p>
          </div>
        )}
      </div>
    </aside>
  );
}

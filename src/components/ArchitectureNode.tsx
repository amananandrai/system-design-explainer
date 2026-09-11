"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { ArchitectureNodeData } from "@/lib/transformDiagram";
import { getCategoryColor } from "@/lib/transformDiagram";

function ArchitectureNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as ArchitectureNodeData;
  const color = getCategoryColor(nodeData.category);

  return (
    <div
      className={`architecture-node min-w-[160px] max-w-[200px] rounded-xl border bg-slate-900/90 px-3 py-2.5 shadow-lg backdrop-blur transition-all ${
        selected
          ? "border-slate-300 ring-2 ring-white/20"
          : "border-slate-700 hover:border-slate-500"
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-slate-500 !w-2 !h-2" />

      <div className="flex items-start gap-2">
        <span
          className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden
        />
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-400">
            {nodeData.category}
          </p>
          <p className="mt-0.5 text-sm font-semibold leading-snug text-white">
            {nodeData.label}
          </p>
          {nodeData.provider !== "generic" && (
            <p className="mt-1 truncate text-[11px] text-slate-500">
              was: {nodeData.genericLabel}
            </p>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="!bg-slate-500 !w-2 !h-2" />
    </div>
  );
}

export default memo(ArchitectureNodeComponent);

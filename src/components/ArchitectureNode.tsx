"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { ArchitectureNodeData } from "@/lib/transformDiagram";
import { getCategoryColor } from "@/lib/resolve";
import { KindIcon } from "@/lib/icons";
import { NODE_HEIGHT, NODE_WIDTH } from "@/lib/layout";

function ArchitectureNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as ArchitectureNodeData;
  const color = getCategoryColor(nodeData.category);

  return (
    <div
      style={{ width: NODE_WIDTH, height: NODE_HEIGHT }}
      className={`architecture-node flex cursor-pointer items-center gap-2.5 rounded-xl border bg-slate-900 px-3 shadow-lg transition-all ${
        nodeData.dimmed ? "opacity-30" : ""
      } ${
        selected
          ? "border-slate-200 ring-2 ring-white/25"
          : "border-slate-700 hover:border-slate-500"
      }`}
    >
      <Handle type="target" position={Position.Top} className="!h-2 !w-2 !border-0 !bg-slate-500" />

      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${color}26`, color }}
        aria-hidden
      >
        <KindIcon kindId={nodeData.kindId} size={18} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[10px] font-medium uppercase tracking-wide text-slate-400">
          {nodeData.kindName}
        </p>
        <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-white">
          {nodeData.label}
        </p>
        {nodeData.mapped && (
          <p className="truncate text-[11px] text-slate-400">{nodeData.genericLabel}</p>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!h-2 !w-2 !border-0 !bg-slate-500" />
    </div>
  );
}

export default memo(ArchitectureNodeComponent);

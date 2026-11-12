"use client";

import { memo, type CSSProperties } from "react";
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
      style={{ width: NODE_WIDTH, height: NODE_HEIGHT, borderLeftColor: color }}
      className={`architecture-node relative flex cursor-pointer items-center gap-2.5 rounded-[3px] border border-l-[3px] pl-2.5 pr-3 transition-colors duration-200 ${
        nodeData.dimmed ? "opacity-35" : ""
      } ${
        selected
          ? "border-accent bg-surface ring-2 ring-accent/30"
          : nodeData.inStep
            ? "border-[#f59e0b] bg-[color-mix(in_srgb,#f59e0b_12%,var(--surface))]"
            : "border-line-strong bg-surface hover:border-faint"
      }`}
    >
      {/* Re-keyed on provider change so the ring replays as the labels swap. */}
      <span
        key={nodeData.provider}
        aria-hidden
        className="pointer-events-none absolute inset-0 animate-flash rounded-[3px]"
        style={{ "--flash-colour": `var(--provider-${nodeData.provider})` } as CSSProperties}
      />
      <Handle type="target" position={Position.Top} className="!h-1.5 !w-1.5 !border-0 !bg-line-strong" />

      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm"
        style={{ backgroundColor: `${color}1f`, color }}
        aria-hidden
      >
        <KindIcon kindId={nodeData.kindId} size={16} />
      </span>
      <div className="min-w-0">
        <p className="truncate font-mono text-[9.5px] uppercase tracking-wider text-muted">{nodeData.kindName}</p>
        <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-fg">{nodeData.label}</p>
        {nodeData.mapped && <p className="truncate text-[11px] text-muted">{nodeData.genericLabel}</p>}
      </div>

      <Handle type="source" position={Position.Bottom} className="!h-1.5 !w-1.5 !border-0 !bg-line-strong" />
    </div>
  );
}

export default memo(ArchitectureNodeComponent);

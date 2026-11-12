"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import type { TierNodeData } from "@/lib/transformDiagram";
import { tierHues, type TierId } from "@/lib/layout";

/** A horizontal swimlane behind one tier of components. */
function TierNodeComponent({ data }: NodeProps) {
  const { label, tier } = data as TierNodeData;
  const hue = tierHues[tier as TierId] ?? "#64748b";

  return (
    <div
      className="pointer-events-none h-full w-full rounded-[3px] border border-dashed"
      style={{
        background: `color-mix(in srgb, ${hue} 4%, transparent)`,
        borderColor: `color-mix(in srgb, ${hue} 45%, var(--line-strong))`,
      }}
    >
      <p className="flex items-center gap-1.5 px-4 pt-2 font-mono text-[10px] uppercase tracking-widest text-fg-soft">
        <span className="h-1.5 w-1.5 rounded-[1px]" style={{ background: hue }} aria-hidden />
        {label}
      </p>
    </div>
  );
}

export default memo(TierNodeComponent);

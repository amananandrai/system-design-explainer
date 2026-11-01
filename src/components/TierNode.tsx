"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import type { TierNodeData } from "@/lib/transformDiagram";

/** A horizontal swimlane behind one tier of components. */
function TierNodeComponent({ data }: NodeProps) {
  const { label } = data as TierNodeData;

  return (
    <div className="pointer-events-none h-full w-full rounded-2xl bg-surface-2/60">
      <p className="px-4 pt-2 text-[10px] font-semibold uppercase tracking-widest text-muted">
        {label}
      </p>
    </div>
  );
}

export default memo(TierNodeComponent);

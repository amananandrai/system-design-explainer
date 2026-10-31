"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import type { TierNodeData } from "@/lib/transformDiagram";

function TierNodeComponent({ data }: NodeProps) {
  const { label } = data as TierNodeData;

  return (
    <div className="pointer-events-none h-full w-full rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
      <p className="px-4 pt-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </p>
    </div>
  );
}

export default memo(TierNodeComponent);

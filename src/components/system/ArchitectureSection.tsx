"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, X } from "lucide-react";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import CloudProviderSelector from "@/components/CloudProviderSelector";
import NodeDetailPanel from "@/components/NodeDetailPanel";
import { providerSchema, type Provider, type SystemDesign } from "@/types/schema";
import type { FlowHighlight } from "@/lib/transformDiagram";
import { PLAY_FLOW_EVENT, updateSearchParams } from "@/lib/url";

const STEP_INTERVAL_MS = 2600;

export default function ArchitectureSection({ system }: { system: SystemDesign }) {
  const searchParams = useSearchParams();

  const parsedProvider = providerSchema.safeParse(searchParams.get("cloud"));
  const provider: Provider = parsedProvider.success ? parsedProvider.data : "generic";

  const requestedNode = searchParams.get("node");
  const selectedNodeId = system.nodes.some((n) => n.id === requestedNode) ? requestedNode : null;

  const activeFlow = system.flows.find((f) => f.id === searchParams.get("flow")) ?? null;
  const requestedStep = Number.parseInt(searchParams.get("step") ?? "0", 10);
  const step = activeFlow
    ? Math.min(Math.max(Number.isNaN(requestedStep) ? 0 : requestedStep, 0), activeFlow.steps.length - 1)
    : 0;

  const [playing, setPlaying] = useState(false);

  const flowHighlight = useMemo<FlowHighlight | null>(() => {
    if (!activeFlow) return null;
    return {
      activeEdgeId: activeFlow.steps[step].edge,
      visitedEdgeIds: new Set(activeFlow.steps.slice(0, step).map((s) => s.edge)),
    };
  }, [activeFlow, step]);

  const goToStep = useCallback((next: number) => {
    updateSearchParams({ step: String(next) });
  }, []);

  const selectFlow = useCallback((flowId: string | null) => {
    setPlaying(flowId !== null);
    updateSearchParams({ flow: flowId, step: flowId ? "0" : null, node: null });
  }, []);

  useEffect(() => {
    const play = () => setPlaying(true);
    window.addEventListener(PLAY_FLOW_EVENT, play);
    return () => window.removeEventListener(PLAY_FLOW_EVENT, play);
  }, []);

  // Auto-advance while playing; stop on the last step.
  useEffect(() => {
    if (!playing || !activeFlow) return;
    if (step >= activeFlow.steps.length - 1) {
      const id = window.setTimeout(() => setPlaying(false), STEP_INTERVAL_MS);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => goToStep(step + 1), STEP_INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [playing, activeFlow, step, goToStep]);

  const handleNodeSelect = useCallback(
    (nodeId: string | null) => {
      if (nodeId) {
        setPlaying(false);
        updateSearchParams({ node: nodeId, flow: null, step: null });
      } else if (!activeFlow) {
        updateSearchParams({ node: null });
      }
    },
    [activeFlow],
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
        <CloudProviderSelector
          selected={provider}
          onChange={(next) => updateSearchParams({ cloud: next === "generic" ? null : next })}
        />
        {system.flows.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Walkthrough</span>
            <div className="flex rounded-xl border border-slate-700 bg-slate-900 p-1">
              {system.flows.map((flow) => (
                <button
                  key={flow.id}
                  type="button"
                  onClick={() => selectFlow(activeFlow?.id === flow.id ? null : flow.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeFlow?.id === flow.id
                      ? "bg-amber-400 text-slate-950"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {flow.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* The diagram gets the full width; details slide over it when a node is selected. */}
      <div className="relative h-[min(78vh,820px)] min-h-[520px] p-3">
        <ArchitectureDiagram
          system={system}
          provider={provider}
          selectedNodeId={selectedNodeId}
          flowHighlight={flowHighlight}
          onNodeSelect={handleNodeSelect}
        />
        {selectedNodeId && (
          <div className="absolute inset-y-0 right-0 z-10 shadow-2xl shadow-black/60">
            <NodeDetailPanel
              nodeId={selectedNodeId}
              system={system}
              provider={provider}
              onClose={() => updateSearchParams({ node: null })}
            />
          </div>
        )}
      </div>

      {activeFlow && (
        <div className="flex items-center gap-4 border-t border-amber-500/30 bg-amber-500/5 px-4 py-3">
          <div className="flex shrink-0 items-center gap-1">
            <IconButton label="Previous step" disabled={step === 0} onClick={() => goToStep(step - 1)}>
              <ChevronLeft size={16} />
            </IconButton>
            <IconButton
              label={playing ? "Pause" : "Play"}
              onClick={() => {
                if (!playing && step === activeFlow.steps.length - 1) goToStep(0);
                setPlaying(!playing);
              }}
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}
            </IconButton>
            <IconButton
              label="Next step"
              disabled={step === activeFlow.steps.length - 1}
              onClick={() => goToStep(step + 1)}
            >
              <ChevronRight size={16} />
            </IconButton>
            <IconButton label="Restart" onClick={() => goToStep(0)}>
              <RotateCcw size={14} />
            </IconButton>
          </div>
          <p className="min-w-0 flex-1 text-sm text-slate-200" aria-live="polite">
            <span className="mr-2 font-semibold text-amber-300">
              {activeFlow.name} · {step + 1}/{activeFlow.steps.length}
            </span>
            {activeFlow.steps[step].text}
          </p>
          <IconButton label="Close walkthrough" onClick={() => selectFlow(null)}>
            <X size={16} />
          </IconButton>
        </div>
      )}
    </div>
  );
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ProgressIndicatorProps = {
  progress: number;
  isManual?: boolean | null;
  manualObservation?: string | null;
  className?: string;
};

export function ProgressIndicator({
  progress,
  isManual,
  manualObservation,
  className = "",
}: ProgressIndicatorProps) {
  const value = Math.min(100, Math.max(0, Math.round(progress || 0)));
  if (!isManual) return <span className={className}>{value}%</span>;

  return (
    <TooltipProvider delayDuration={120}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            role="img"
            tabIndex={0}
            className={`inline-flex items-center gap-0.5 underline decoration-dotted underline-offset-4 ${className}`}
            aria-label={`Progresso manual: ${value}%. Ver observação.`}
          >
            {value}%<sup className="text-[0.7em]">*</sup>
            <Info className="h-3 w-3" aria-hidden="true" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-[#171717] text-white">
          <p className="text-xs font-semibold">
            Observação do progresso manual
          </p>
          <p className="mt-1 text-xs leading-5 text-white/80">
            {manualObservation || "Nenhuma observação informada."}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function ProgressBar({
  progress,
  isCompleted,
  className = "",
}: {
  progress: number;
  isCompleted?: boolean;
  className?: string;
}) {
  const value = Math.min(100, Math.max(0, Math.round(progress || 0)));
  return (
    <div
      className={`h-2 overflow-hidden rounded-full bg-neutral-200 ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all ${isCompleted ? "bg-emerald-500" : "bg-[#e30613]"}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

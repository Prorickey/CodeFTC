"use client"

import { Check, Lock } from "lucide-react"
import type { Stage } from "@/lib/types"

interface ModuleStageStepperProps {
  stages: Stage[]
  current: number
  completed: number[]
  onJump: (index: number) => void
}

export function ModuleStageStepper({
  stages,
  current,
  completed,
  onJump,
}: ModuleStageStepperProps) {
  const completedSet = new Set(completed)

  return (
    <ol className="flex flex-wrap items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 lg:px-8">
      {stages.map((stage, idx) => {
        const isCurrent = idx === current
        const isCompleted = completedSet.has(idx)
        const isUnlocked = isCompleted || isCurrent
        const state = isCompleted ? "completed" : isCurrent ? "current" : "locked"

        return (
          <li key={stage.slug} className="flex items-center gap-2">
            <button
              type="button"
              disabled={!isUnlocked}
              onClick={() => isUnlocked && onJump(idx)}
              aria-current={isCurrent ? "step" : undefined}
              title={stage.title}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                state === "completed"
                  ? "border-[var(--color-success)] bg-[var(--color-success)]/10 text-[var(--color-success)] hover:bg-[var(--color-success)]/20"
                  : state === "current"
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                    : "border-[var(--color-border)] bg-transparent text-[var(--color-text-muted)] opacity-60"
              } ${isUnlocked ? "cursor-pointer" : "cursor-not-allowed"}`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${
                  state === "completed"
                    ? "bg-[var(--color-success)] text-white"
                    : state === "current"
                      ? "bg-[var(--color-accent)] text-white"
                      : "bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]"
                }`}
              >
                {state === "completed" ? (
                  <Check className="h-3 w-3" />
                ) : state === "locked" ? (
                  <Lock className="h-3 w-3" />
                ) : (
                  idx + 1
                )}
              </span>
              <span className="max-w-[160px] truncate">{stage.title}</span>
            </button>
            {idx < stages.length - 1 && (
              <span
                className={`h-px w-4 ${
                  completedSet.has(idx)
                    ? "bg-[var(--color-success)]"
                    : "bg-[var(--color-border)]"
                }`}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

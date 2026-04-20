"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Lock } from "lucide-react"
import type { Stage } from "@/lib/types"

interface ModuleStageStepperProps {
  stages: Stage[]
  current: number
  completed: number[]
}

export function ModuleStageStepper({
  stages,
  current,
  completed,
}: ModuleStageStepperProps) {
  const completedSet = new Set(completed)
  const trackRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const el = track.children[current] as HTMLElement | undefined
    if (!el) return
    const viewport = track.parentElement
    if (!viewport) return
    const viewportWidth = viewport.clientWidth
    const target = el.offsetLeft + el.offsetWidth / 2 - viewportWidth / 2
    setOffset(-target)
  }, [current, stages.length])

  return (
    <div className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-surface)] py-3">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--color-surface)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--color-surface)] to-transparent" />
      <div
        ref={trackRef}
        className="flex items-center gap-3 transition-transform duration-500 ease-out"
        style={{ transform: `translateX(${offset}px)`, willChange: "transform" }}
      >
        {stages.map((stage, idx) => {
          const isCurrent = idx === current
          const isCompleted = completedSet.has(idx)
          const state = isCompleted ? "completed" : isCurrent ? "current" : "locked"

          return (
            <div
              key={stage.slug}
              aria-current={isCurrent ? "step" : undefined}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-500 ${
                state === "completed"
                  ? "border-[var(--color-success)] bg-[var(--color-success)]/10 text-[var(--color-success)]"
                  : state === "current"
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)] scale-110 shadow-sm"
                    : "border-[var(--color-border)] bg-transparent text-[var(--color-text-muted)] opacity-50"
              }`}
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
              <span className="max-w-[180px] truncate">{stage.title}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

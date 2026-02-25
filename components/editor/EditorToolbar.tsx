"use client"

import { Play, RotateCcw, Eye } from "lucide-react"

interface EditorToolbarProps {
  onRun: () => void
  onReset: () => void
  onShowSolution: () => void
  isRunning: boolean
}

export function EditorToolbar({
  onRun,
  onReset,
  onShowSolution,
  isRunning,
}: EditorToolbarProps) {
  return (
    <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
      <button
        onClick={onRun}
        disabled={isRunning}
        className="flex items-center gap-1.5 rounded-md bg-[var(--color-success)] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isRunning ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <Play className="h-4 w-4" />
        )}
        <span>{isRunning ? "Running..." : "Run"}</span>
      </button>

      <button
        onClick={onReset}
        disabled={isRunning}
        className="flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-hover)] px-3 py-1.5 text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-border)] hover:text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RotateCcw className="h-4 w-4" />
        <span>Reset</span>
      </button>

      <div className="flex-1" />

      <button
        onClick={onShowSolution}
        disabled={isRunning}
        className="flex items-center gap-1.5 rounded-md border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10 px-3 py-1.5 text-sm text-[var(--color-warning)] transition-colors hover:bg-[var(--color-warning)]/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Eye className="h-4 w-4" />
        <span>Show Solution</span>
      </button>
    </div>
  )
}

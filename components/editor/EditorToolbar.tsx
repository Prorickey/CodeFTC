"use client"

import { Play, RotateCcw, Eye, EyeOff, LogIn } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface EditorToolbarProps {
  onRun: () => void
  onReset: () => void
  onToggleSolution: () => void
  showingSolution: boolean
  isRunning: boolean
  isAuthenticated: boolean
}

export function EditorToolbar({
  onRun,
  onReset,
  onToggleSolution,
  showingSolution,
  isRunning,
  isAuthenticated,
}: EditorToolbarProps) {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
      {!showingSolution && (
        <>
          {isAuthenticated ? (
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
          ) : (
            <Link
              href={`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`}
              className="flex items-center gap-1.5 rounded-md border border-[var(--color-success)]/40 bg-[var(--color-success)]/20 px-3 py-1.5 text-sm font-medium text-[var(--color-success)] transition-colors hover:bg-[var(--color-success)]/30"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign in to Run</span>
            </Link>
          )}

          <button
            onClick={onReset}
            disabled={isRunning}
            className="flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-hover)] px-3 py-1.5 text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-border)] hover:text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </>
      )}

      <div className="flex-1" />

      <button
        onClick={onToggleSolution}
        disabled={isRunning}
        className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
          showingSolution
            ? "border-[var(--color-warning)]/60 bg-[var(--color-warning)]/20 text-[var(--color-warning)] hover:bg-[var(--color-warning)]/30"
            : "border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10 text-[var(--color-warning)] hover:bg-[var(--color-warning)]/20"
        }`}
      >
        {showingSolution ? (
          <>
            <EyeOff className="h-4 w-4" />
            <span>Hide Solution</span>
          </>
        ) : (
          <>
            <Eye className="h-4 w-4" />
            <span>Show Solution</span>
          </>
        )}
      </button>
    </div>
  )
}

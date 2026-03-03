"use client"

import { Play, RotateCcw, Eye, EyeOff, PanelRightClose } from "lucide-react"
import { DownloadButton } from "./DownloadButton"
import type { Language } from "@/lib/types"

interface EditorToolbarProps {
  onRun: () => void
  onReset: () => void
  onToggleSolution: () => void
  onCollapse: () => void
  showingSolution: boolean
  isRunning: boolean
  code: string
  language: Language
  onLanguageChange: (language: Language) => void
  hasKotlin: boolean
}

export function EditorToolbar({
  onRun,
  onReset,
  onToggleSolution,
  onCollapse,
  showingSolution,
  isRunning,
  code,
  language,
  onLanguageChange,
  hasKotlin,
}: EditorToolbarProps) {

  return (
    <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
      {!showingSolution && (
        <>
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
        </>
      )}

      {hasKotlin && (
        <div className="flex rounded-md border border-[var(--color-border)] bg-[var(--color-surface-hover)] text-sm">
          <button
            onClick={() => onLanguageChange("java")}
            disabled={isRunning}
            className={`px-2.5 py-1 rounded-l-md transition-colors disabled:cursor-not-allowed ${
              language === "java"
                ? "bg-[var(--color-accent)] text-white"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            Java
          </button>
          <button
            onClick={() => onLanguageChange("kotlin")}
            disabled={isRunning}
            className={`px-2.5 py-1 rounded-r-md transition-colors disabled:cursor-not-allowed ${
              language === "kotlin"
                ? "bg-[var(--color-accent)] text-white"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            Kotlin
          </button>
        </div>
      )}

      <div className="flex-1" />

      <DownloadButton code={code} language={language} />

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

      <button
        onClick={onCollapse}
        title="Collapse editor"
        className="shrink-0 rounded p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
      >
        <PanelRightClose className="h-4 w-4" />
      </button>
    </div>
  )
}

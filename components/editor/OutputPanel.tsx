"use client"

import type { ExecutionResult } from "@/lib/types"
import { TestResults } from "@/components/ui/TestResults"

interface OutputPanelProps {
  result: ExecutionResult | null
  isRunning: boolean
  isLoggedIn?: boolean
}

export function OutputPanel({ result, isRunning, isLoggedIn }: OutputPanelProps) {
  const showSignIn = !isLoggedIn && result !== null && !isRunning

  return (
    <div className="h-full border-t border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="mb-3 flex items-center gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          Output
        </h3>
        {showSignIn && (
          <a
            href="/auth/signin"
            className="rounded-md bg-[var(--color-accent)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent)]/20 transition-colors"
          >
            Sign in to save
          </a>
        )}
      </div>

      {isRunning && (
        <div className="flex items-center gap-3 text-[var(--color-text-muted)]">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--color-text-muted)] border-t-transparent" />
          <span className="text-sm">Compiling and running your code...</span>
        </div>
      )}

      {!isRunning && !result && (
        <p className="text-sm text-[var(--color-text-muted)]">
          Click <span className="font-medium text-[var(--color-success)]">Run</span> to
          execute your code
        </p>
      )}

      {!isRunning && result && (
        <div className="space-y-3">
          {result.timeout && (
            <div className="rounded-md border border-[var(--color-error)]/30 bg-[var(--color-error)]/10 p-3">
              <p className="text-sm font-medium text-[var(--color-error)]">
                Execution timed out. Check for infinite loops in your code.
              </p>
            </div>
          )}

          {result.compilationError && (
            <div className="rounded-md border border-[var(--color-error)]/30 bg-[var(--color-error)]/10 p-3">
              <p className="mb-1 text-xs font-semibold uppercase text-[var(--color-error)]">
                Compilation Error
              </p>
              <pre className="whitespace-pre-wrap font-mono text-sm text-[var(--color-error)]">
                {result.compilationError}
              </pre>
            </div>
          )}

          {result.runtimeError && (
            <div className="rounded-md border border-[var(--color-error)]/30 bg-[var(--color-error)]/10 p-3">
              <p className="mb-1 text-xs font-semibold uppercase text-[var(--color-error)]">
                Runtime Error
              </p>
              <pre className="whitespace-pre-wrap font-mono text-sm text-[var(--color-error)]">
                {result.runtimeError}
              </pre>
            </div>
          )}

          {result.output && (
            <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] p-3">
              <p className="mb-1 text-xs font-semibold uppercase text-[var(--color-text-muted)]">
                Console Output
              </p>
              <pre className="whitespace-pre-wrap font-mono text-sm text-[var(--color-text)]">
                {result.output}
              </pre>
            </div>
          )}

          {result.testResults.length > 0 && (
            <TestResults results={result.testResults} />
          )}
        </div>
      )}
    </div>
  )
}

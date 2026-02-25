"use client"

import { CheckCircle2, XCircle } from "lucide-react"
import type { TestResult } from "@/lib/types"

interface TestResultsProps {
  results: TestResult[]
}

export function TestResults({ results }: TestResultsProps) {
  const passed = results.filter((r) => r.passed).length
  const total = results.length
  const allPassed = passed === total

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span
          className={`text-sm font-medium ${
            allPassed ? "text-[var(--color-success)]" : "text-[var(--color-error)]"
          }`}
        >
          {passed}/{total} tests passed
        </span>
        {allPassed && (
          <span className="rounded-full bg-[var(--color-success)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-success)]">
            All passing
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        {results.map((result, index) => (
          <div
            key={index}
            className={`flex items-start gap-2.5 rounded-md border p-2.5 ${
              result.passed
                ? "border-[var(--color-success)]/30 bg-[var(--color-success)]/5"
                : "border-[var(--color-error)]/30 bg-[var(--color-error)]/5"
            }`}
          >
            {result.passed ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-success)]" />
            ) : (
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-error)]" />
            )}
            <div className="min-w-0">
              <p
                className={`text-sm font-medium ${
                  result.passed
                    ? "text-[var(--color-success)]"
                    : "text-[var(--color-error)]"
                }`}
              >
                {result.name}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {result.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

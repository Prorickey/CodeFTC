"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { SidebarModule } from "@/lib/types"

interface LessonProgress {
  passed: number
  total: number
}

type AllProgress = Record<string, LessonProgress>

function loadAllProgress(modules: SidebarModule[]): AllProgress {
  const result: AllProgress = {}
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      const id = `${lesson.moduleSlug}/${lesson.slug}`
      try {
        const raw = localStorage.getItem(`ftc-tests:${id}`)
        if (raw) result[id] = JSON.parse(raw) as LessonProgress
      } catch { /* ignore */ }
    }
  }
  return result
}

function ProgressBar({ passed, total }: { passed: number; total: number }) {
  const pct = total > 0 ? Math.round((passed / total) * 100) : 0
  const color =
    passed === total && total > 0
      ? "bg-[var(--color-success)]"
      : passed > 0
      ? "bg-[var(--color-warning)]"
      : "bg-red-500"

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-[var(--color-border)]">
        <div
          className={`h-1.5 rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className={`w-10 text-right font-mono text-xs ${
          passed === total && total > 0
            ? "text-[var(--color-success)]"
            : passed > 0
            ? "text-[var(--color-warning)]"
            : "text-red-500"
        }`}
      >
        {passed}/{total}
      </span>
    </div>
  )
}

export function ProgressPage({ modules }: { modules: SidebarModule[] }) {
  const [progress, setProgress] = useState<AllProgress>({})

  useEffect(() => {
    const handler = () => setProgress(loadAllProgress(modules))
    handler()
    window.addEventListener("ftc-tests-updated", handler)
    return () => window.removeEventListener("ftc-tests-updated", handler)
  }, [modules])

  // Compute totals
  let totalPassed = 0
  let totalTests = 0
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      const id = `${lesson.moduleSlug}/${lesson.slug}`
      const p = progress[id]
      totalPassed += p?.passed ?? 0
      totalTests += p?.total ?? lesson.testCount
    }
  }
  const overallPct = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-1 text-2xl font-bold text-[var(--color-text)]">My Progress</h1>
      <p className="mb-8 text-sm text-[var(--color-text-muted)]">
        Track your test results across all lessons.
      </p>

      {/* Overall stat */}
      <div className="mb-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-sm font-medium text-[var(--color-text)]">Overall</span>
          <span className="font-mono text-sm text-[var(--color-text-muted)]">
            {totalPassed}/{totalTests} checks · {overallPct}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-[var(--color-border)]">
          <div
            className={`h-2 rounded-full transition-all ${
              overallPct === 100
                ? "bg-[var(--color-success)]"
                : overallPct > 0
                ? "bg-[var(--color-warning)]"
                : "bg-red-500"
            }`}
            style={{ width: `${overallPct}%` }}
          />
        </div>
      </div>

      {/* Per-module breakdown */}
      <div className="space-y-6">
        {modules.map((mod) => {
          let modPassed = 0
          let modTotal = 0
          for (const lesson of mod.lessons) {
            const id = `${lesson.moduleSlug}/${lesson.slug}`
            const p = progress[id]
            modPassed += p?.passed ?? 0
            modTotal += p?.total ?? lesson.testCount
          }

          return (
            <div key={mod.meta.slug}>
              <div className="mb-2 flex items-baseline justify-between">
                <h2 className="text-sm font-semibold text-[var(--color-text)]">
                  {mod.meta.title}
                </h2>
                <span className="font-mono text-xs text-[var(--color-text-muted)]">
                  {modPassed}/{modTotal}
                </span>
              </div>

              <div className="overflow-hidden rounded-lg border border-[var(--color-border)]">
                {mod.lessons.map((lesson, i) => {
                  const id = `${lesson.moduleSlug}/${lesson.slug}`
                  const p = progress[id]
                  const passed = p?.passed ?? 0
                  const total = p?.total ?? lesson.testCount
                  const isComplete = total > 0 && passed === total

                  return (
                    <Link
                      key={lesson.slug}
                      href={`/lessons/${lesson.moduleSlug}/${lesson.slug}`}
                      className={`flex items-center gap-4 px-4 py-3 text-sm transition-colors hover:bg-[var(--color-surface-hover)] ${
                        i > 0 ? "border-t border-[var(--color-border)]" : ""
                      }`}
                    >
                      {/* Completion dot */}
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          isComplete
                            ? "bg-[var(--color-success)]"
                            : passed > 0
                            ? "bg-[var(--color-warning)]"
                            : "bg-red-500"
                        }`}
                      />
                      <span className="flex-1 truncate text-[var(--color-text)]">
                        {lesson.title}
                      </span>
                      <div className="w-40 shrink-0">
                        <ProgressBar passed={passed} total={total} />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { ModuleSection, SidebarModule } from "@/lib/types"

interface ItemProgress {
  passed: number
  total: number
}

type AllProgress = Record<string, ItemProgress>

function loadAllProgress(modules: SidebarModule[]): AllProgress {
  const result: AllProgress = {}
  for (const mod of modules) {
    if (mod.meta.type === "multistage") {
      for (let i = 0; i < mod.stages.length; i++) {
        const id = `${mod.meta.slug}#${i}`
        try {
          const raw = localStorage.getItem(`ftc-tests:${id}`)
          if (raw) result[id] = JSON.parse(raw) as ItemProgress
        } catch { /* ignore */ }
      }
      continue
    }
    for (const lesson of mod.lessons) {
      const id = `${lesson.moduleSlug}/${lesson.slug}`
      try {
        const raw = localStorage.getItem(`ftc-tests:${id}`)
        if (raw) result[id] = JSON.parse(raw) as ItemProgress
      } catch { /* ignore */ }
    }
  }
  return result
}

interface Row {
  id: string
  title: string
  href: string
  passed: number
  total: number
}

function buildRows(mod: SidebarModule, progress: AllProgress): Row[] {
  if (mod.meta.type === "multistage") {
    return mod.stages.map((stage, i) => {
      const id = `${mod.meta.slug}#${i}`
      const p = progress[id]
      return {
        id,
        title: stage.title,
        href: `/lessons/${mod.meta.slug}?stage=${i + 1}`,
        passed: p?.passed ?? 0,
        total: p?.total ?? stage.testCount,
      }
    })
  }
  return mod.lessons.map((lesson) => {
    const id = `${lesson.moduleSlug}/${lesson.slug}`
    const p = progress[id]
    return {
      id,
      title: lesson.title,
      href: `/lessons/${lesson.moduleSlug}/${lesson.slug}`,
      passed: p?.passed ?? 0,
      total: p?.total ?? lesson.testCount,
    }
  })
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

export function ProgressPage({ sections }: { sections: ModuleSection[] }) {
  const modules: SidebarModule[] = sections.flatMap((s) => s.modules)
  const [progress, setProgress] = useState<AllProgress>({})

  useEffect(() => {
    const handler = () => setProgress(loadAllProgress(modules))
    handler()
    window.addEventListener("ftc-tests-updated", handler)
    return () => window.removeEventListener("ftc-tests-updated", handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections])

  const sectionData = sections.map((section) => ({
    title: section.title,
    modules: section.modules.map((mod) => ({ mod, rows: buildRows(mod, progress) })),
  }))

  let totalPassed = 0
  let totalTests = 0
  for (const section of sectionData) {
    for (const { rows } of section.modules) {
      for (const row of rows) {
        totalPassed += row.passed
        totalTests += row.total
      }
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

      {/* Section-grouped module breakdown */}
      <div className="space-y-10">
        {sectionData.map((section) => {
          const visibleModules = section.modules.filter(({ rows }) => rows.length > 0)
          if (visibleModules.length === 0) return null
          return (
            <section key={section.title}>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                {section.title}
              </h2>
              <div className="space-y-6">
                {visibleModules.map(({ mod, rows }) => {
          const modPassed = rows.reduce((s, r) => s + r.passed, 0)
          const modTotal = rows.reduce((s, r) => s + r.total, 0)

          return (
            <div key={mod.meta.slug}>
              <div className="mb-2 flex items-baseline justify-between">
                <h3 className="text-sm font-semibold text-[var(--color-text)]">
                  {mod.meta.title}
                </h3>
                <span className="font-mono text-xs text-[var(--color-text-muted)]">
                  {modPassed}/{modTotal}
                </span>
              </div>

              <div className="overflow-hidden rounded-lg border border-[var(--color-border)]">
                {rows.map((row, i) => {
                  const isComplete = row.total > 0 && row.passed === row.total

                  return (
                    <Link
                      key={row.id}
                      href={row.href}
                      className={`flex items-center gap-4 px-4 py-3 text-sm transition-colors hover:bg-[var(--color-surface-hover)] ${
                        i > 0 ? "border-t border-[var(--color-border)]" : ""
                      }`}
                    >
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          isComplete
                            ? "bg-[var(--color-success)]"
                            : row.passed > 0
                            ? "bg-[var(--color-warning)]"
                            : "bg-red-500"
                        }`}
                      />
                      <span className="flex-1 truncate text-[var(--color-text)]">
                        {row.title}
                      </span>
                      <div className="w-40 shrink-0">
                        <ProgressBar passed={row.passed} total={row.total} />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

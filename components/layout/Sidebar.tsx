"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, ChevronDown, BookOpen, Home, Menu, X } from "lucide-react"
import type { SidebarModule } from "@/lib/types"

interface SidebarProps {
  modules: SidebarModule[]
  moduleSlug: string
  lessonSlug: string
}

export function Sidebar({ modules, moduleSlug, lessonSlug }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(() => {
    const initial = new Set<string>()
    initial.add(moduleSlug)
    return initial
  })

  function toggleModule(slug: string) {
    setExpandedModules((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) {
        next.delete(slug)
      } else {
        next.add(slug)
      }
      return next
    })
  }

  const navContent = (
    <nav className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-3">
        <BookOpen className="h-5 w-5 text-[var(--color-accent)]" />
        <Link
          href="/lessons/introduction"
          className="text-sm font-bold text-[var(--color-text)]"
        >
          <span className="text-[var(--color-accent)]">Code</span> FTC
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <Link
          href="/lessons/introduction"
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            moduleSlug === "" && lessonSlug === ""
              ? "border-r-2 border-[var(--color-accent)] bg-[var(--color-surface-hover)] text-[var(--color-accent)]"
              : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
          }`}
        >
          <Home className="h-4 w-4 shrink-0" />
          <span>Introduction</span>
        </Link>

        {modules.map((mod) => {
          const isExpanded = expandedModules.has(mod.meta.slug)
          return (
            <div key={mod.meta.slug}>
              <button
                onClick={() => toggleModule(mod.meta.slug)}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0" />
                )}
                <span className="truncate">{mod.meta.title}</span>
              </button>

              {isExpanded && (
                <ul className="pb-1">
                  {mod.lessons.map((lesson) => {
                    const isActive =
                      lesson.moduleSlug === moduleSlug &&
                      lesson.slug === lessonSlug
                    return (
                      <li key={lesson.slug}>
                        <Link
                          href={`/lessons/${lesson.moduleSlug}/${lesson.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className={`block py-1.5 pl-10 pr-4 text-sm transition-colors ${
                            isActive
                              ? "border-r-2 border-[var(--color-accent)] bg-[var(--color-surface-hover)] font-medium text-[var(--color-accent)]"
                              : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                          }`}
                        >
                          {lesson.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-3 top-3 z-50 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-[var(--color-text)] lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-[var(--color-border)] bg-[var(--color-bg)] transition-transform lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-3 rounded p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </button>
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden w-[250px] shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg)] lg:block">
        {navContent}
      </aside>
    </>
  )
}

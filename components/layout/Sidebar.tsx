"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, ChevronDown, BookOpen, Home, Menu, X, LogIn, LogOut, PanelLeftClose, BarChart2 } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import type { SidebarModule } from "@/lib/types"

interface SidebarProps {
  modules: SidebarModule[]
  moduleSlug: string
  lessonSlug: string
  onCollapse?: () => void
}

function TestIndicator({ progress, testCount }: { progress?: { passed: number; total: number }; testCount: number }) {
  const passed = progress?.passed ?? 0
  const total = progress?.total ?? testCount

  let color: string
  if (total > 0 && passed === total) {
    color = "text-[var(--color-success)]"
  } else if (passed > 0) {
    color = "text-[var(--color-warning)]"
  } else {
    color = "text-red-500"
  }

  return (
    <span className={`shrink-0 font-mono text-xs ${color}`}>
      {passed}/{total}
    </span>
  )
}

function UserFooter() {
  const { data: session, status } = useSession()
  const [signingOut, setSigningOut] = useState(false)

  if (status === "loading") {
    return (
      <div className="border-t border-[var(--color-border)] p-3">
        <div className="h-10 animate-pulse rounded-lg bg-[var(--color-surface-hover)]" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="border-t border-[var(--color-border)] p-3">
        <Link
          href="/auth/signin"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
        >
          <LogIn className="h-4 w-4 shrink-0" />
          <span>Sign in</span>
        </Link>
      </div>
    )
  }

  const { user } = session

  return (
    <div className="border-t border-[var(--color-border)] p-3">
      <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
        {user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt={user.name ?? "User avatar"}
            className="h-8 w-8 shrink-0 rounded-full ring-1 ring-[var(--color-border)]"
          />
        ) : (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/20 text-xs font-bold text-[var(--color-accent)] ring-1 ring-[var(--color-border)]">
            {(user?.name ?? user?.email ?? "?")[0].toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          {user?.name && (
            <p className="truncate text-sm font-medium text-[var(--color-text)]">
              {user.name}
            </p>
          )}
          {user?.email && (
            <p className="truncate text-xs text-[var(--color-text-muted)]">
              {user.email}
            </p>
          )}
        </div>
        <button
          onClick={async () => {
            setSigningOut(true)
            await signOut({ redirectTo: "/lessons/introduction" })
          }}
          disabled={signingOut}
          title="Sign out"
          className="shrink-0 rounded p-1 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

type TestProgress = Record<string, { passed: number; total: number }>

function loadTestProgress(modules: SidebarModule[]): TestProgress {
  const result: TestProgress = {}
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      const key = `ftc-tests:${lesson.moduleSlug}/${lesson.slug}`
      try {
        const raw = localStorage.getItem(key)
        if (raw) result[`${lesson.moduleSlug}/${lesson.slug}`] = JSON.parse(raw) as { passed: number; total: number }
      } catch { /* ignore */ }
    }
  }
  return result
}

export function Sidebar({ modules, moduleSlug, lessonSlug, onCollapse }: SidebarProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(() => {
    const initial = new Set<string>()
    initial.add(moduleSlug)
    return initial
  })
  const [testProgress, setTestProgress] = useState<TestProgress>({})

  useEffect(() => {
    const handler = () => setTestProgress(loadTestProgress(modules))
    handler()
    window.addEventListener("ftc-tests-updated", handler)
    return () => window.removeEventListener("ftc-tests-updated", handler)
  }, [modules])

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
        <BookOpen className="h-5 w-5 shrink-0 text-[var(--color-accent)]" />
        <Link
          href="/lessons/introduction"
          className="flex-1 text-sm font-bold text-[var(--color-text)]"
        >
          <span className="text-[var(--color-accent)]">Code</span> FTC
        </Link>
        {onCollapse && (
          <button
            onClick={onCollapse}
            title="Collapse sidebar"
            className="shrink-0 rounded p-1 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <Link
          href="/lessons/introduction"
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            moduleSlug === "" && lessonSlug === "" && pathname !== "/progress"
              ? "border-r-2 border-[var(--color-accent)] bg-[var(--color-surface-hover)] text-[var(--color-accent)]"
              : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
          }`}
        >
          <Home className="h-4 w-4 shrink-0" />
          <span>Introduction</span>
        </Link>

        {session && (
          <Link
            href="/progress"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              pathname === "/progress"
                ? "border-r-2 border-[var(--color-accent)] bg-[var(--color-surface-hover)] text-[var(--color-accent)]"
                : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
            }`}
          >
            <BarChart2 className="h-4 w-4 shrink-0" />
            <span>Progress</span>
          </Link>
        )}

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
                          className={`flex items-center gap-2 py-1.5 pl-10 pr-3 text-sm transition-colors ${
                            isActive
                              ? "border-r-2 border-[var(--color-accent)] bg-[var(--color-surface-hover)] font-medium text-[var(--color-accent)]"
                              : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                          }`}
                        >
                          <span className="flex-1 truncate">{lesson.title}</span>
                          {session && <TestIndicator progress={testProgress[`${lesson.moduleSlug}/${lesson.slug}`]} testCount={lesson.testCount} />}
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

      <UserFooter />
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

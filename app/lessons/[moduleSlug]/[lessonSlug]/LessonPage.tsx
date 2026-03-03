"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { PanelLeftOpen, PanelRightOpen } from "lucide-react"
import { Group, Panel, Separator } from "react-resizable-panels"
import { LessonLayout } from "@/components/layout/LessonLayout"
import { Sidebar } from "@/components/layout/Sidebar"
import { LessonContent } from "@/components/lesson/LessonContent"
import { LessonNav } from "@/components/lesson/LessonNav"
import { CodeEditor } from "@/components/editor/CodeEditor"
import { EditorToolbar } from "@/components/editor/EditorToolbar"
import { OutputPanel } from "@/components/editor/OutputPanel"
import { HintAccordion } from "@/components/ui/HintAccordion"
import { useCheerpJ } from "@/lib/cheerpj-context"
import { executeInBrowser } from "@/lib/cheerpj-executor"
import type { LessonData, SidebarModule, ExecutionResult } from "@/lib/types"

interface LessonPageProps {
  data: LessonData
  modules: SidebarModule[]
  moduleSlug: string
  lessonSlug: string
  userId: string | null
}

function getLessonId(moduleSlug: string, lessonSlug: string) {
  return `${moduleSlug}/${lessonSlug}`
}

function getStorageKey(moduleSlug: string, lessonSlug: string) {
  return `ftc-code:${getLessonId(moduleSlug, lessonSlug)}`
}

// Debounce helper
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export function LessonPage({
  data,
  modules,
  moduleSlug,
  lessonSlug,
  userId,
}: LessonPageProps) {
  const lessonId = getLessonId(moduleSlug, lessonSlug)
  const storageKey = getStorageKey(moduleSlug, lessonSlug)

  const { status: cheerpjStatus } = useCheerpJ()

  const [code, setCode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey)
      if (saved) return saved
    }
    return data.exercise.starterCode
  })
  const [result, setResult] = useState<ExecutionResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [showingSolution, setShowingSolution] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [editorCollapsed, setEditorCollapsed] = useState(false)

  // Track whether we've loaded from the DB yet to avoid overwriting with stale localStorage
  const dbLoadedRef = useRef(false)
  const prevLessonIdRef = useRef(lessonId)

  // Save to localStorage on every code change
  useEffect(() => {
    localStorage.setItem(storageKey, code)
  }, [code, storageKey])

  // Debounced save to DB for logged-in users
  const debouncedCode = useDebounce(code, 1500)
  const lastSavedRef = useRef<string | null>(null)
  useEffect(() => {
    if (!userId || !dbLoadedRef.current) return
    if (debouncedCode === lastSavedRef.current) return
    lastSavedRef.current = debouncedCode
    fetch("/api/progress", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, code: debouncedCode }),
    }).catch(() => {})
  }, [debouncedCode, lessonId, userId])

  // When navigating between lessons, reset state and load saved code
  useEffect(() => {
    if (prevLessonIdRef.current === lessonId) return
    prevLessonIdRef.current = lessonId
    dbLoadedRef.current = false
    lastSavedRef.current = null
    setResult(null)
    setIsRunning(false)
    setShowingSolution(false)

    // Load code: start with localStorage, then fetch DB if logged in
    const localSaved = localStorage.getItem(storageKey)
    setCode(localSaved ?? data.exercise.starterCode)

    if (userId) {
      fetch(`/api/progress?lessonId=${encodeURIComponent(lessonId)}`)
        .then((r) => r.json())
        .then(({ code: dbCode }: { code: string | null }) => {
          if (dbCode !== null) {
            setCode(dbCode)
            localStorage.setItem(storageKey, dbCode)
          }
          dbLoadedRef.current = true
          lastSavedRef.current = dbCode ?? (localSaved ?? data.exercise.starterCode)
        })
        .catch(() => { dbLoadedRef.current = true })
    } else {
      dbLoadedRef.current = true
    }
  }, [lessonId, storageKey, data.exercise.starterCode, userId])

  // Load from DB on first mount for logged-in users
  useEffect(() => {
    if (!userId) {
      dbLoadedRef.current = true
      return
    }
    fetch(`/api/progress?lessonId=${encodeURIComponent(lessonId)}`)
      .then((r) => r.json())
      .then(({ code: dbCode }: { code: string | null }) => {
        if (dbCode !== null) {
          setCode(dbCode)
          localStorage.setItem(storageKey, dbCode)
        }
        dbLoadedRef.current = true
        lastSavedRef.current = dbCode ?? code
      })
      .catch(() => { dbLoadedRef.current = true })
    // Only run once on mount — intentional empty-ish deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function trackEvent(type: string, extra?: Record<string, unknown>) {
    fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, lessonId, ...extra }),
    }).catch(() => {})
  }

  useEffect(() => {
    trackEvent("lesson_view")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleSlug, lessonSlug])

  const handleRun = useCallback(async () => {
    if (cheerpjStatus !== "ready") {
      setResult({
        success: false,
        runtimeError: cheerpjStatus === "loading"
          ? "Java runtime is still loading — please wait a moment and try again"
          : "Java runtime failed to load. Try refreshing the page.",
        testResults: [],
      })
      return
    }

    setIsRunning(true)
    setResult(null)

    try {
      const execResult = await executeInBrowser(
        code,
        data.testCode,
      )
      setResult(execResult)

      // Persist test progress to localStorage so sidebar can show it
      if (execResult.testResults.length > 0) {
        const passed = execResult.testResults.filter((t) => t.passed).length
        const total = execResult.testResults.length
        localStorage.setItem(`ftc-tests:${lessonId}`, JSON.stringify({ passed, total }))
        window.dispatchEvent(new Event("ftc-tests-updated"))
      }

      // Fire analytics (non-blocking)
      fetch("/api/analytics/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          allPassed: execResult.testResults.length > 0 && execResult.testResults.every((t) => t.passed),
        }),
      }).catch(() => {})
    } catch (err) {
      setResult({
        success: false,
        runtimeError:
          err instanceof Error ? err.message : "Execution failed unexpectedly",
        testResults: [],
      })
    } finally {
      setIsRunning(false)
    }
  }, [code, lessonId, data.testCode, cheerpjStatus])

  const handleReset = useCallback(() => {
    setCode(data.exercise.starterCode)
    setResult(null)
    setShowingSolution(false)
    localStorage.removeItem(storageKey)
    lastSavedRef.current = data.exercise.starterCode
    if (userId) {
      fetch("/api/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, code: data.exercise.starterCode }),
      }).catch(() => {})
    }
  }, [data.exercise.starterCode, storageKey, lessonId, userId])

  const handleToggleSolution = useCallback(() => {
    setShowingSolution((prev) => {
      if (!prev) trackEvent("solution_view")
      return !prev
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleHintOpen = useCallback((index: number) => {
    trackEvent("hint_view", { hintIndex: index })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex h-screen overflow-hidden">
      {!sidebarCollapsed && (
        <Sidebar
          modules={modules}
          moduleSlug={moduleSlug}
          lessonSlug={lessonSlug}
          onCollapse={() => setSidebarCollapsed(true)}
        />
      )}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            title="Expand sidebar"
            className="hidden lg:flex absolute left-2 top-2 z-10 items-center gap-1.5 rounded-lg border border-(--color-border) bg-(--color-surface) px-2 py-1.5 text-xs text-(--color-text-muted) transition-colors hover:bg-(--color-surface-hover) hover:text-(--color-text)"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        )}
        {editorCollapsed ? (
          <>
            <div className="flex h-full flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto">
                <LessonContent content={data.content} />
                {data.exercise.hints.length > 0 && (
                  <div className="px-6 pb-4 lg:px-8">
                    <HintAccordion hints={data.exercise.hints} onHintOpen={handleHintOpen} />
                  </div>
                )}
              </div>
              <LessonNav prev={data.prev} next={data.next} />
            </div>
            <button
              onClick={() => setEditorCollapsed(false)}
              title="Expand editor"
              className="absolute right-4 top-2 z-10 flex items-center gap-1.5 rounded-lg border border-(--color-border) bg-(--color-surface) px-2 py-1.5 text-xs text-(--color-text-muted) transition-colors hover:bg-(--color-surface-hover) hover:text-(--color-text)"
            >
              <PanelRightOpen className="h-4 w-4" />
            </button>
          </>
        ) : (
          <LessonLayout
            leftPanel={
              <div className="flex h-full flex-col">
                <div className="flex-1 overflow-y-auto">
                  <LessonContent content={data.content} />
                  {data.exercise.hints.length > 0 && (
                    <div className="px-6 pb-4 lg:px-8">
                      <HintAccordion hints={data.exercise.hints} onHintOpen={handleHintOpen} />
                    </div>
                  )}
                </div>
                <LessonNav prev={data.prev} next={data.next} />
              </div>
            }
            rightPanel={
              <>
                <EditorToolbar
                  onRun={handleRun}
                  onReset={handleReset}
                  onToggleSolution={handleToggleSolution}
                  onCollapse={() => setEditorCollapsed(true)}
                  showingSolution={showingSolution}
                  isRunning={isRunning}
                  code={code}
                />
                <Group orientation="vertical" className="flex-1 overflow-hidden">
                  <Panel defaultSize={showingSolution ? "100%" : "65%"} minSize="20%">
                    <div className="relative h-full overflow-hidden">
                      <div className={`absolute inset-0 ${showingSolution ? "invisible pointer-events-none" : ""}`}>
                        <CodeEditor value={code} onChange={setCode} />
                      </div>
                      <div className={`absolute inset-0 ${showingSolution ? "" : "invisible pointer-events-none"}`}>
                        <CodeEditor value={data.exercise.solutionCode} onChange={() => {}} readOnly />
                      </div>
                    </div>
                  </Panel>
                  {!showingSolution && (
                    <>
                      <Separator className="h-1.5 cursor-row-resize bg-[var(--color-border)] transition-colors hover:bg-[var(--color-accent)] active:bg-[var(--color-accent)]" />
                      <Panel defaultSize="35%" minSize="10%">
                        <div className="h-full overflow-y-auto">
                          <OutputPanel result={result} isRunning={isRunning} isLoggedIn={!!userId} />
                        </div>
                      </Panel>
                    </>
                  )}
                </Group>
              </>
            }
          />
        )}
      </div>
    </div>
  )
}

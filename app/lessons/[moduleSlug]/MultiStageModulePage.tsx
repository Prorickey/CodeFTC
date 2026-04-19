"use client"

import { useState, useCallback, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { PanelLeftOpen, PanelRightOpen, ArrowRight, CheckCircle2 } from "lucide-react"
import { Group, Panel, Separator } from "react-resizable-panels"
import { LessonLayout } from "@/components/layout/LessonLayout"
import { Sidebar } from "@/components/layout/Sidebar"
import { LessonContent } from "@/components/lesson/LessonContent"
import { ModuleStageStepper } from "@/components/lesson/ModuleStageStepper"
import { CodeEditor } from "@/components/editor/CodeEditor"
import { EditorToolbar } from "@/components/editor/EditorToolbar"
import { OutputPanel } from "@/components/editor/OutputPanel"
import { HintAccordion } from "@/components/ui/HintAccordion"
import { useCheerpJ } from "@/lib/cheerpj-context"
import { executeInBrowser } from "@/lib/cheerpj-executor"
import {
  isMultiStageProgressState,
  type ExecutionResult,
  type MultiStageModuleData,
  type MultiStageProgressState,
  type SidebarModule,
} from "@/lib/types"

interface MultiStageModulePageProps {
  data: MultiStageModuleData
  modules: SidebarModule[]
  moduleSlug: string
  userId: string | null
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

function storageKey(moduleSlug: string) {
  return `ftc-module:${moduleSlug}`
}

function testsStorageKey(moduleSlug: string, stageIndex: number) {
  return `ftc-tests:${moduleSlug}#${stageIndex}`
}

function clampStage(n: number, total: number) {
  if (!Number.isFinite(n) || n < 0) return 0
  if (n > total - 1) return total - 1
  return Math.floor(n)
}

export function MultiStageModulePage({
  data,
  modules,
  moduleSlug,
  userId,
}: MultiStageModulePageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { status: cheerpjStatus } = useCheerpJ()

  const totalStages = data.stages.length

  const [hydrated, setHydrated] = useState(false)
  const [currentStage, setCurrentStageState] = useState(0)
  const [perStageCode, setPerStageCode] = useState<Record<string, string>>({})
  const [completedStages, setCompletedStages] = useState<number[]>([])
  const [code, setCode] = useState(data.starterCode)
  const [result, setResult] = useState<ExecutionResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [showingSolution, setShowingSolution] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [editorCollapsed, setEditorCollapsed] = useState(false)

  const activeStage = data.stages[currentStage] ?? data.stages[0]!
  const lessonId = moduleSlug // multi-stage lessonId = moduleSlug

  const dbLoadedRef = useRef(false)
  const lastSavedSerializedRef = useRef<string | null>(null)
  const codeRef = useRef(code)
  useEffect(() => { codeRef.current = code }, [code])
  const handleJumpStageRef = useRef<((idx: number) => void) | null>(null)

  // Initialize editor buffer for the active stage.
  // Priority: persisted perStageCode -> per-stage Starter.java -> carry-forward -> module starter
  const initBufferForStage = useCallback(
    (nextIndex: number, state: { perStageCode: Record<string, string>; carryFrom?: string }) => {
      const saved = state.perStageCode[String(nextIndex)]
      if (saved !== undefined) return saved
      const stage = data.stages[nextIndex]
      if (stage?.starterCode !== undefined) return stage.starterCode
      if (state.carryFrom !== undefined) return state.carryFrom
      // First stage fallback
      return data.starterCode
    },
    [data.stages, data.starterCode]
  )

  const applyState = useCallback(
    (state: MultiStageProgressState) => {
      const stage = clampStage(state.currentStage, totalStages)
      setPerStageCode(state.perStageCode)
      setCompletedStages(state.completedStages)
      setCurrentStageState(stage)
      const next = initBufferForStage(stage, {
        perStageCode: state.perStageCode,
        carryFrom: undefined,
      })
      setCode(next)
    },
    [initBufferForStage, totalStages]
  )

  // Hydrate from ?stage= or localStorage on mount; then from DB if logged in
  useEffect(() => {
    const key = storageKey(moduleSlug)
    let initialState: MultiStageProgressState = {
      __v: 2,
      currentStage: 0,
      perStageCode: {},
      completedStages: [],
    }

    try {
      const rawLocal = localStorage.getItem(key)
      if (rawLocal) {
        const parsed = JSON.parse(rawLocal) as unknown
        if (isMultiStageProgressState(parsed)) initialState = parsed
      }
    } catch { /* ignore */ }

    // ?stage= overrides current stage for deep-linking
    const stageParam = searchParams.get("stage")
    if (stageParam) {
      const n = Number(stageParam) - 1
      if (Number.isInteger(n)) {
        initialState = { ...initialState, currentStage: clampStage(n, totalStages) }
      }
    }

    applyState(initialState)
    setHydrated(true)

    if (userId) {
      fetch(`/api/progress?lessonId=${encodeURIComponent(lessonId)}`)
        .then((r) => r.json())
        .then(({ code: dbCode }: { code: string | null }) => {
          if (dbCode) {
            try {
              const parsed = JSON.parse(dbCode) as unknown
              if (isMultiStageProgressState(parsed)) {
                let dbState = parsed
                if (stageParam) {
                  const n = Number(stageParam) - 1
                  if (Number.isInteger(n)) {
                    dbState = { ...dbState, currentStage: clampStage(n, totalStages) }
                  }
                }
                applyState(dbState)
                localStorage.setItem(key, JSON.stringify(dbState))
                lastSavedSerializedRef.current = JSON.stringify(dbState)
              }
            } catch { /* treat as legacy plain string — ignore */ }
          }
          dbLoadedRef.current = true
        })
        .catch(() => { dbLoadedRef.current = true })
    } else {
      dbLoadedRef.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Track test-pass indicator per stage (for stepper + sidebar)
  const [stageTestsPassed, setStageTestsPassed] = useState<Record<number, boolean>>({})

  useEffect(() => {
    if (typeof window === "undefined") return
    const passed: Record<number, boolean> = {}
    for (let i = 0; i < totalStages; i++) {
      try {
        const raw = localStorage.getItem(testsStorageKey(moduleSlug, i))
        if (raw) {
          const { passed: p, total } = JSON.parse(raw) as { passed: number; total: number }
          if (total > 0 && p === total) passed[i] = true
        }
      } catch { /* ignore */ }
    }
    setStageTestsPassed(passed)
  }, [moduleSlug, totalStages])

  // Keep ?stage= URL param in sync with currentStage (1-indexed for humans)
  useEffect(() => {
    if (!hydrated) return
    const params = new URLSearchParams(searchParams.toString())
    params.set("stage", String(currentStage + 1))
    router.replace(`/lessons/${moduleSlug}?${params.toString()}`, { scroll: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStage, hydrated])

  // React to external ?stage= changes (e.g. sidebar link clicks)
  const stageParamValue = searchParams.get("stage")
  useEffect(() => {
    if (!hydrated) return
    if (!stageParamValue) return
    const n = Number(stageParamValue) - 1
    if (!Number.isInteger(n)) return
    const target = clampStage(n, totalStages)
    if (target === currentStage) return
    handleJumpStageRef.current?.(target)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageParamValue, hydrated])

  // Serialize + persist state (localStorage always; DB debounced for logged-in)
  const state: MultiStageProgressState = useMemo(
    () => ({
      __v: 2 as const,
      currentStage,
      perStageCode: { ...perStageCode, [String(currentStage)]: code },
      completedStages,
    }),
    [currentStage, perStageCode, completedStages, code]
  )

  const serialized = JSON.stringify(state)

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(storageKey(moduleSlug), serialized)
    window.dispatchEvent(new Event("ftc-tests-updated"))
  }, [hydrated, serialized, moduleSlug])

  const debouncedSerialized = useDebounce(serialized, 1500)
  useEffect(() => {
    if (!userId || !dbLoadedRef.current || !hydrated) return
    if (debouncedSerialized === lastSavedSerializedRef.current) return
    lastSavedSerializedRef.current = debouncedSerialized
    fetch("/api/progress", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, code: debouncedSerialized }),
    }).catch(() => {})
  }, [debouncedSerialized, lessonId, userId, hydrated])

  // Analytics: lesson_view fires on module entry and every stage change
  useEffect(() => {
    if (!hydrated) return
    fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "lesson_view",
        lessonId: `${moduleSlug}/${activeStage.slug}`,
      }),
    }).catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, moduleSlug, activeStage.slug])

  const latestRunAllPassed =
    result !== null &&
    result.testResults.length > 0 &&
    result.testResults.every((t) => t.passed)

  const canAdvance = latestRunAllPassed || stageTestsPassed[currentStage] === true
  const isFinalStage = currentStage === totalStages - 1

  const handleJumpStage = useCallback(
    (targetIndex: number) => {
      if (targetIndex === currentStage) return
      const newPerStage = { ...perStageCode, [String(currentStage)]: codeRef.current }
      setPerStageCode(newPerStage)
      setResult(null)
      setShowingSolution(false)
      const nextBuffer = initBufferForStage(targetIndex, {
        perStageCode: newPerStage,
        carryFrom: codeRef.current,
      })
      setCode(nextBuffer)
      setCurrentStageState(targetIndex)
    },
    [currentStage, perStageCode, initBufferForStage]
  )

  useEffect(() => {
    handleJumpStageRef.current = handleJumpStage
  }, [handleJumpStage])

  const handleAdvance = useCallback(() => {
    if (!canAdvance) return
    const stageSlug = activeStage.slug
    const completedIdx = currentStage

    // Record completion
    const nextCompleted = completedStages.includes(completedIdx)
      ? completedStages
      : [...completedStages, completedIdx].sort((a, b) => a - b)
    setCompletedStages(nextCompleted)

    // Fire stage_complete analytics
    fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "stage_complete",
        lessonId: `${moduleSlug}/${stageSlug}`,
        moduleSlug,
        stageIndex: completedIdx,
        stageSlug,
      }),
    }).catch(() => {})

    if (isFinalStage) {
      // Fire exercise_complete for the module as a whole
      fetch("/api/analytics/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: moduleSlug, allPassed: true }),
      }).catch(() => {})
      return
    }

    // Advance to next stage
    handleJumpStage(completedIdx + 1)
  }, [
    canAdvance,
    activeStage.slug,
    currentStage,
    completedStages,
    moduleSlug,
    isFinalStage,
    handleJumpStage,
  ])

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
      const execResult = await executeInBrowser(code, activeStage.testCode)
      setResult(execResult)

      if (execResult.testResults.length > 0) {
        const passed = execResult.testResults.filter((t) => t.passed).length
        const total = execResult.testResults.length
        localStorage.setItem(
          testsStorageKey(moduleSlug, currentStage),
          JSON.stringify({ passed, total })
        )
        setStageTestsPassed((prev) => ({
          ...prev,
          [currentStage]: total > 0 && passed === total,
        }))
        window.dispatchEvent(new Event("ftc-tests-updated"))
      }

      const allPassed =
        execResult.testResults.length > 0 &&
        execResult.testResults.every((t) => t.passed)

      fetch("/api/analytics/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: `${moduleSlug}/${activeStage.slug}`,
          allPassed,
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
  }, [code, activeStage.testCode, activeStage.slug, cheerpjStatus, moduleSlug, currentStage])

  const handleReset = useCallback(() => {
    const resetBuffer = activeStage.starterCode ?? data.starterCode
    setCode(resetBuffer)
    setResult(null)
    setShowingSolution(false)
  }, [activeStage.starterCode, data.starterCode])

  const handleToggleSolution = useCallback(() => {
    setShowingSolution((prev) => {
      if (!prev) {
        fetch("/api/analytics/event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "solution_view",
            lessonId: `${moduleSlug}/${activeStage.slug}`,
          }),
        }).catch(() => {})
      }
      return !prev
    })
  }, [moduleSlug, activeStage.slug])

  const handleHintOpen = useCallback(
    (index: number) => {
      fetch("/api/analytics/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "hint_view",
          lessonId: `${moduleSlug}/${activeStage.slug}`,
          hintIndex: index,
        }),
      }).catch(() => {})
    },
    [moduleSlug, activeStage.slug]
  )

  const moduleCompleted = completedStages.includes(totalStages - 1)

  const solutionCode = activeStage.solutionCode ?? data.solutionCode
  const introContent = currentStage === 0 && data.intro ? data.intro : ""
  const leftContent = introContent
    ? `${introContent}\n\n${activeStage.content}`
    : activeStage.content

  const stepperNode = (
    <ModuleStageStepper
      stages={data.stages}
      current={currentStage}
      completed={completedStages}
    />
  )

  const hintsNode =
    activeStage.hints.length > 0 ? (
      <div className="px-6 pb-4 lg:px-8">
        <HintAccordion hints={activeStage.hints} onHintOpen={handleHintOpen} />
      </div>
    ) : null

  const footerNode = (
    <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3">
      <div className="text-xs text-[var(--color-text-muted)]">
        Stage {currentStage + 1} of {totalStages}
      </div>
      {isFinalStage ? (
        moduleCompleted ? (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-sm font-medium text-[var(--color-success)]">
              <CheckCircle2 className="h-4 w-4" />
              Module complete
            </span>
            {data.nextModule && (
              <Link
                href={`/lessons/${data.nextModule.slug}`}
                className="flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)]"
              >
                <span>Next module</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        ) : (
          <button
            type="button"
            disabled={!canAdvance}
            onClick={handleAdvance}
            className="flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Finish module</span>
          </button>
        )
      ) : (
        <button
          type="button"
          disabled={!canAdvance}
          onClick={handleAdvance}
          className="flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>Advance</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden">
      {!sidebarCollapsed && (
        <Sidebar
          modules={modules}
          moduleSlug={moduleSlug}
          lessonSlug=""
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
              {stepperNode}
              <div className="flex-1 overflow-y-auto">
                <LessonContent content={leftContent} />
                {hintsNode}
              </div>
              {footerNode}
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
                {stepperNode}
                <div className="flex-1 overflow-y-auto">
                  <LessonContent content={leftContent} />
                  {hintsNode}
                </div>
                {footerNode}
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
                        <CodeEditor value={solutionCode} onChange={() => {}} readOnly />
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

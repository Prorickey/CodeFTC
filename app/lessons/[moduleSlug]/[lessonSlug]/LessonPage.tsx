"use client"

import { useState, useCallback, useEffect } from "react"
import { LessonLayout } from "@/components/layout/LessonLayout"
import { Sidebar } from "@/components/layout/Sidebar"
import { LessonContent } from "@/components/lesson/LessonContent"
import { LessonNav } from "@/components/lesson/LessonNav"
import { CodeEditor } from "@/components/editor/CodeEditor"
import { EditorToolbar } from "@/components/editor/EditorToolbar"
import { OutputPanel } from "@/components/editor/OutputPanel"
import { HintAccordion } from "@/components/ui/HintAccordion"
import type { LessonData, SidebarModule, ExecutionResult } from "@/lib/types"

interface LessonPageProps {
  data: LessonData
  modules: SidebarModule[]
  moduleSlug: string
  lessonSlug: string
}

function getStorageKey(moduleSlug: string, lessonSlug: string) {
  return `ftc-code:${moduleSlug}/${lessonSlug}`
}

export function LessonPage({
  data,
  modules,
  moduleSlug,
  lessonSlug,
}: LessonPageProps) {
  const [code, setCode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(getStorageKey(moduleSlug, lessonSlug))
      if (saved) return saved
    }
    return data.exercise.starterCode
  })
  const [result, setResult] = useState<ExecutionResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  // Save code to localStorage
  useEffect(() => {
    const key = getStorageKey(moduleSlug, lessonSlug)
    localStorage.setItem(key, code)
  }, [code, moduleSlug, lessonSlug])

  // Reset state when navigating between lessons
  useEffect(() => {
    const saved = localStorage.getItem(getStorageKey(moduleSlug, lessonSlug))
    setCode(saved ?? data.exercise.starterCode)
    setResult(null)
    setIsRunning(false)
  }, [moduleSlug, lessonSlug, data.exercise.starterCode])

  const handleRun = useCallback(async () => {
    setIsRunning(true)
    setResult(null)

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          lessonId: `${moduleSlug}/${lessonSlug}`,
        }),
      })

      const data = await response.json()
      setResult(data as ExecutionResult)
    } catch (err) {
      setResult({
        success: false,
        runtimeError:
          err instanceof Error ? err.message : "Failed to connect to server",
        testResults: [],
      })
    } finally {
      setIsRunning(false)
    }
  }, [code, moduleSlug, lessonSlug])

  const handleReset = useCallback(() => {
    setCode(data.exercise.starterCode)
    setResult(null)
    localStorage.removeItem(getStorageKey(moduleSlug, lessonSlug))
  }, [data.exercise.starterCode, moduleSlug, lessonSlug])

  const handleShowSolution = useCallback(() => {
    setCode(data.exercise.solutionCode)
  }, [data.exercise.solutionCode])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        modules={modules}
        moduleSlug={moduleSlug}
        lessonSlug={lessonSlug}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <LessonLayout
          leftPanel={
            <div className="flex h-full flex-col">
              <div className="flex-1 overflow-y-auto">
                <LessonContent content={data.content} />
                {data.exercise.hints.length > 0 && (
                  <div className="px-6 pb-4 lg:px-8">
                    <HintAccordion hints={data.exercise.hints} />
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
                onShowSolution={handleShowSolution}
                isRunning={isRunning}
              />
              <div className="flex-1 overflow-hidden">
                <CodeEditor value={code} onChange={setCode} />
              </div>
              <div className="h-[200px] shrink-0 overflow-y-auto border-t border-[var(--color-border)]">
                <OutputPanel result={result} isRunning={isRunning} />
              </div>
            </>
          }
        />
      </div>
    </div>
  )
}

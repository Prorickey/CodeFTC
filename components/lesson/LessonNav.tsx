"use client"

import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface NavTarget {
  moduleSlug: string
  lessonSlug: string
}

interface LessonNavProps {
  prev: NavTarget | null
  next: NavTarget | null
}

export function LessonNav({ prev, next }: LessonNavProps) {
  return (
    <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3">
      {prev ? (
        <Link
          href={`/lessons/${prev.moduleSlug}/${prev.lessonSlug}`}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/lessons/${next.moduleSlug}/${next.lessonSlug}`}
          className="flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)]"
        >
          <span>Next Lesson</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  )
}

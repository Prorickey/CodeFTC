"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, Lightbulb } from "lucide-react"

interface Hint {
  title: string
  content: string
}

interface HintAccordionProps {
  hints: Hint[]
}

export function HintAccordion({ hints }: HintAccordionProps) {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set())

  function toggle(index: number) {
    setOpenIndices((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  if (hints.length === 0) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-[var(--color-warning)]">
        <Lightbulb className="h-4 w-4" />
        <span className="text-sm font-medium">Hints</span>
      </div>

      <div className="space-y-1">
        {hints.map((hint, index) => {
          const isOpen = openIndices.has(index)
          return (
            <div
              key={index}
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]"
            >
              <button
                onClick={() => toggle(index)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
              >
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0" />
                )}
                <span>{hint.title}</span>
              </button>

              {isOpen && (
                <div
                  className="border-t border-[var(--color-border)] px-3 py-2"
                >
                  <div
                    className="prose prose-invert prose-sm max-w-none text-[var(--color-text-muted)]"
                    dangerouslySetInnerHTML={{
                      __html: formatHintContent(hint.content),
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function formatHintContent(content: string): string {
  let html = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

  // Convert inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code class="rounded bg-[#1e1e1e] px-1.5 py-0.5 font-mono text-xs text-[var(--color-accent)]">$1</code>')

  // Convert code blocks: ```lang\ncode\n```
  html = html.replace(
    /```\w*\n([\s\S]*?)```/g,
    '<pre class="rounded-md border border-[var(--color-border)] bg-[#1e1e1e] p-3 overflow-x-auto"><code class="font-mono text-xs">$1</code></pre>'
  )

  // Convert newlines to <br> (outside of pre blocks)
  html = html.replace(/\n/g, "<br>")

  return html
}

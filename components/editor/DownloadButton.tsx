"use client"

import { useEffect, useRef, useState } from "react"
import { Download, Copy, FileCode, FolderArchive, Check, Loader2 } from "lucide-react"
import type { Language } from "@/lib/types"

interface DownloadButtonProps {
  code: string
  language?: Language
}

function extractClassName(code: string, language: Language): string {
  if (language === "kotlin") {
    const match = code.match(/class\s+(\w+)/)
    return match ? match[1] : "MyOpMode"
  }
  const match = code.match(/public\s+class\s+(\w+)/)
  return match ? match[1] : "MyOpMode"
}

export function DownloadButton({ code, language = "java" }: DownloadButtonProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [downloadingProject, setDownloadingProject] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
    setOpen(false)
  }

  function handleDownloadFile() {
    const className = extractClassName(code, language)
    const ext = language === "kotlin" ? "kt" : "java"
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${className}.${ext}`
    a.click()
    URL.revokeObjectURL(url)
    setOpen(false)
  }

  async function handleDownloadProject() {
    setOpen(false)
    setDownloadingProject(true)
    try {
      const className = extractClassName(code, language)
      const response = await fetch("/api/download-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
      if (!response.ok) throw new Error("Server error")
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${className}-FtcRobotController.zip`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDownloadingProject(false)
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        title="Download options"
        className="flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-hover)] px-3 py-1.5 text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-border)] hover:text-[var(--color-text)]"
      >
        {copied ? (
          <Check className="h-4 w-4 text-[var(--color-success)]" />
        ) : downloadingProject ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        <span>Export</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-52 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-lg">
          <button
            onClick={handleCopy}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
          >
            <Copy className="h-4 w-4 shrink-0" />
            <span>Copy Code</span>
          </button>
          <button
            onClick={handleDownloadFile}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
          >
            <FileCode className="h-4 w-4 shrink-0" />
            <span>Download File</span>
          </button>
          <button
            onClick={handleDownloadProject}
            disabled={downloadingProject}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FolderArchive className="h-4 w-4 shrink-0" />
            <span>Download Project</span>
          </button>
        </div>
      )}
    </div>
  )
}

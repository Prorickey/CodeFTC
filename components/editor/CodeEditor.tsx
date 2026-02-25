"use client"

import dynamic from "next/dynamic"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-[#1e1e1e] text-[var(--color-text-muted)]">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--color-text-muted)] border-t-transparent" />
        <span className="text-sm">Loading editor...</span>
      </div>
    </div>
  ),
})

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  readOnly?: boolean
}

export function CodeEditor({
  value,
  onChange,
  language = "java",
  readOnly = false,
}: CodeEditorProps) {
  return (
    <div className="relative h-full w-full">
      <MonacoEditor
        language={language}
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange(v ?? "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          padding: { top: 12 },
          lineNumbersMinChars: 3,
          renderLineHighlight: "line",
          wordWrap: "on",
          bracketPairColorization: { enabled: true },
          suggest: { showKeywords: true },
          readOnly,
          domReadOnly: readOnly,
        }}
      />
      {readOnly && (
        <div className="pointer-events-none absolute right-3 top-3 rounded border border-[var(--color-warning)]/40 bg-[var(--color-warning)]/10 px-2 py-0.5 text-xs text-[var(--color-warning)]">
          Solution — read only
        </div>
      )}
    </div>
  )
}

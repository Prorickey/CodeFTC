"use client"

import dynamic from "next/dynamic"
import type { OnMount } from "@monaco-editor/react"
import completionsData from "@/lib/ftc-completions.json"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-[#1e1e1e] text-(--color-text-muted)">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-(--color-text-muted) border-t-transparent" />
        <span className="text-sm">Loading editor...</span>
      </div>
    </div>
  ),
})

// ── Completion types ──────────────────────────────────────────────────────────

type CompletionParam = { type: string; name: string }
type CompletionMethod = { name: string; returnType: string; params: CompletionParam[]; doc: string }
type CompletionField = { name: string; type: string; doc: string }
type ClassEntry = {
  kind: string
  parents: string[]
  methods: CompletionMethod[]
  fields: CompletionField[]
  enums: Record<string, string[]>
}
const db = completionsData as Record<string, ClassEntry>

// ── Inheritance resolution ────────────────────────────────────────────────────

function resolveClass(className: string, visited = new Set<string>()): ClassEntry | null {
  const entry = db[className]
  if (!entry || visited.has(className)) return entry ?? null
  visited.add(className)

  const resolved: ClassEntry = {
    ...entry,
    methods: [...entry.methods],
    fields: [...entry.fields],
    enums: { ...entry.enums },
  }

  for (const parent of entry.parents) {
    const parentEntry = resolveClass(parent, visited)
    if (!parentEntry) continue
    // Merge methods (avoid duplicates)
    const existing = new Set(resolved.methods.map((m) => m.name))
    for (const m of parentEntry.methods) {
      if (!existing.has(m.name)) resolved.methods.push(m)
    }
    // Merge fields
    const existingFields = new Set(resolved.fields.map((f) => f.name))
    for (const f of parentEntry.fields) {
      if (!existingFields.has(f.name)) resolved.fields.push(f)
    }
    // Merge enums
    for (const [k, v] of Object.entries(parentEntry.enums)) {
      if (!resolved.enums[k]) resolved.enums[k] = v
    }
  }

  return resolved
}

// ── Type inference ────────────────────────────────────────────────────────────

// Built-in fields available in every LinearOpMode / OpMode
const BUILTIN_TYPES: Record<string, string> = {
  hardwareMap: "HardwareMap",
  telemetry: "Telemetry",
  gamepad1: "Gamepad",
  gamepad2: "Gamepad",
}

function inferTypes(code: string): Record<string, string> {
  const map: Record<string, string> = { ...BUILTIN_TYPES }
  const knownTypes = new Set(Object.keys(db))

  // Match: TypeName varName = ... or TypeName varName;
  const re = /\b([A-Z]\w*)\s+([a-z]\w*)\s*(?:=|;)/g
  let m
  while ((m = re.exec(code)) !== null) {
    const [, type, varName] = m
    if (knownTypes.has(type)) map[varName] = type
  }
  return map
}

// ── Monaco provider (registered once) ────────────────────────────────────────

let providerRegistered = false

function registerFtcProvider(monaco: Parameters<OnMount>[1]) {
  if (providerRegistered) return
  providerRegistered = true

  const CIK = monaco.languages.CompletionItemKind

  monaco.languages.registerCompletionItemProvider("java", {
    triggerCharacters: ["."],

    provideCompletionItems(model: import("monaco-editor").editor.ITextModel, position: import("monaco-editor").Position) {
      const lineText = model.getLineContent(position.lineNumber)
      const prefix = lineText.substring(0, position.column - 1)
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }

      const fullCode = model.getValue()
      const typeMap = inferTypes(fullCode)

      // ── Dot-triggered completions ─────────────────────────────────────────

      const dotMatch = prefix.match(/(\w+)\.$/)
      if (dotMatch) {
        const varName = dotMatch[1]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const suggestions: any[] = []

        // Case 1: variable name → look up its type
        const typeName = typeMap[varName]
        if (typeName) {
          const cls = resolveClass(typeName)
          if (cls) {
            for (const m of cls.methods) {
              suggestions.push(buildMethodSuggestion(m, range, CIK))
            }
            for (const f of cls.fields) {
              suggestions.push(buildFieldSuggestion(f, range, CIK))
            }
          }
        }

        // Case 2: ClassName.EnumName. → show enum values
        const enumDotMatch = prefix.match(/(\w+)\.(\w+)\.$/)
        if (enumDotMatch) {
          const [, cls2, enumName] = enumDotMatch
          const entry = db[cls2]
          if (entry?.enums[enumName]) {
            return {
              suggestions: entry.enums[enumName].map((val) => ({
                label: val,
                kind: CIK.EnumMember,
                insertText: val,
                range,
              })),
            }
          }
        }

        // Case 3: ClassName. → show static enum members and methods
        const clsEntry = db[varName]
        if (clsEntry) {
          for (const [enumName, values] of Object.entries(clsEntry.enums)) {
            for (const val of values) {
              suggestions.push({
                label: `${enumName}.${val}`,
                kind: CIK.EnumMember,
                insertText: `${enumName}.${val}`,
                range,
              })
            }
          }
          const resolved = resolveClass(varName)
          if (resolved) {
            for (const m of resolved.methods) {
              suggestions.push(buildMethodSuggestion(m, range, CIK))
            }
          }
        }

        if (suggestions.length) return { suggestions }
        return { suggestions: [] }
      }

      // ── Non-dot completions: OpMode lifecycle + snippets ──────────────────

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const suggestions: any[] = []

      // LinearOpMode lifecycle methods
      const lifecycle = resolveClass("LinearOpMode")
      if (lifecycle) {
        for (const m of lifecycle.methods) {
          if (m.name === "runOpMode") continue // abstract, not called directly
          suggestions.push(buildMethodSuggestion(m, range, CIK))
        }
      }

      // Common FTC snippets
      suggestions.push(
        {
          label: "while (opModeIsActive())",
          kind: CIK.Snippet,
          insertText: "while (opModeIsActive()) {\n\t${1}\n}",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Main TeleOp loop — runs until the driver presses STOP",
          range,
        },
        {
          label: "@TeleOp",
          kind: CIK.Snippet,
          insertText: '@TeleOp(name = "${1:MyTeleOp}", group = "${2:TeleOp}")',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Registers this class as a TeleOp OpMode",
          range,
        },
        {
          label: "@Autonomous",
          kind: CIK.Snippet,
          insertText: '@Autonomous(name = "${1:MyAuto}", group = "${2:Autonomous}")',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Registers this class as an Autonomous OpMode",
          range,
        },
        {
          label: "hardwareMap.get",
          kind: CIK.Snippet,
          insertText: 'hardwareMap.get(${1:DcMotor}.class, "${2:deviceName}")',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Retrieve a hardware device by type and config name",
          range,
        },
        {
          label: "telemetry.addData",
          kind: CIK.Snippet,
          insertText: 'telemetry.addData("${1:label}", ${2:value});\ntelemetry.update();',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Send a key/value pair to the Driver Station display",
          range,
        }
      )

      return { suggestions }
    },
  })
}

// ── Suggestion builders ───────────────────────────────────────────────────────

type Range = { startLineNumber: number; endLineNumber: number; startColumn: number; endColumn: number }

function buildMethodSuggestion(
  m: CompletionMethod,
  range: Range,
  CIK: Parameters<OnMount>[1]["languages"]["CompletionItemKind"]
) {
  const paramList = m.params.map((p) => `${p.type} ${p.name}`).join(", ")
  const snippet =
    m.params.length === 0
      ? `${m.name}()`
      : `${m.name}(${m.params.map((p, i) => `\${${i + 1}:${p.name}}`).join(", ")})`

  return {
    label: m.name,
    kind: CIK.Method,
    detail: `${m.returnType} ${m.name}(${paramList})`,
    documentation: m.doc || undefined,
    insertText: snippet,
    insertTextRules: 4 as const, // InsertAsSnippet
    range,
  }
}

function buildFieldSuggestion(
  f: CompletionField,
  range: Range,
  CIK: Parameters<OnMount>[1]["languages"]["CompletionItemKind"]
) {
  return {
    label: f.name,
    kind: CIK.Field,
    detail: f.type,
    documentation: f.doc || undefined,
    insertText: f.name,
    insertTextRules: 4 as const,
    range,
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

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
  const handleMount: OnMount = (_editor, monaco) => {
    registerFtcProvider(monaco)
  }

  return (
    <div className="relative h-full w-full">
      <MonacoEditor
        language={language}
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange(v ?? "")}
        onMount={handleMount}
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
        <div className="pointer-events-none absolute right-3 top-3 rounded border border-(--color-warning)/40 bg-(--color-warning)/10 px-2 py-0.5 text-xs text-(--color-warning)">
          Solution — read only
        </div>
      )}
    </div>
  )
}

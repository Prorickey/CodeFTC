#!/usr/bin/env node
/**
 * Parses all FTC SDK Java stubs and generates lib/ftc-completions.json
 * for use by the Monaco editor completion provider.
 *
 * Run: bun run generate:completions
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const STUBS_DIR = join(__dirname, "../ftc-stubs")
const OUTPUT = join(__dirname, "../lib/ftc-completions.json")

// Methods that exist only in the test stub, not the real FTC SDK
const TEST_ONLY = new Set([
  "getCallLog", "clearCallLog", "setStarted", "setStopRequested",
  "setMaxActiveLoops", "getActiveLoopCount", "resetActiveLoopCount",
  "registerDevice", "contains", "clear", "reset",
  "toString", "hashCode", "equals",
])

// Internal fields to skip
const INTERNAL_FIELDS = new Set([
  "deviceMap", "callLog", "started", "stopRequested",
  "maxActiveLoops", "activeLoopCount",
])

function getAllJavaFiles(dir) {
  const results = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      results.push(...getAllJavaFiles(full))
    } else if (entry.endsWith(".java")) {
      results.push(full)
    }
  }
  return results
}

function cleanJavadoc(raw) {
  if (!raw) return ""
  return raw
    .split("\n")
    .map((l) => l.replace(/^\s*\*\s?/, ""))
    .join("\n")
    .replace(/@\w[\s\S]*/g, "") // strip @param, @return etc.
    .trim()
}

function parseStub(content) {
  // Class/interface/enum declaration
  const classMatch = content.match(
    /public\s+(abstract\s+)?(class|interface|enum)\s+(\w+)(?:\s+extends\s+([\w,\s.<>]+?))?(?:\s+implements\s+([\w,\s.<>]+?))?\s*\{/
  )
  if (!classMatch) return null

  const kind = classMatch[2]
  const name = classMatch[3]

  const parseParentList = (raw) =>
    (raw || "")
      .split(",")
      .map((s) => s.trim().split(".").pop().replace(/<.*>/, "").trim())
      .filter(Boolean)

  const parents = [
    ...parseParentList(classMatch[4]),
    ...parseParentList(classMatch[5]),
  ]

  // ── Inner enums ──────────────────────────────────────────────────────────
  const enums = {}
  const enumRe = /\benum\s+(\w+)\s*\{([^}]+)\}/g
  let em
  while ((em = enumRe.exec(content)) !== null) {
    const values = em[2]
      .split(",")
      .map((v) => v.replace(/\/\/.*/, "").replace(/\/\*[\s\S]*?\*\//g, "").trim())
      .filter((v) => /^[A-Z_][A-Z0-9_]*$/.test(v))
    if (values.length) enums[em[1]] = values
  }

  // ── Public fields (Gamepad axes, buttons, etc.) ───────────────────────────
  const fields = []
  const fieldRe =
    /(?:\/\*\*([\s\S]*?)\*\/\s*)?public\s+(?:static\s+)?(?:final\s+)?(\w+)\s+(\w+)\s*=\s*[^;]+;/g
  let fm
  while ((fm = fieldRe.exec(content)) !== null) {
    const fname = fm[3]
    if (INTERNAL_FIELDS.has(fname)) continue
    const doc = cleanJavadoc(fm[1] || "")
    fields.push({ name: fname, type: fm[2], doc })
  }

  // ── Methods ───────────────────────────────────────────────────────────────
  const methods = []
  const methodRe =
    /(?:\/\*\*([\s\S]*?)\*\/\s*)?(?:@\w+[^\n]*\n\s*)*(?:public\s+)?(?:abstract\s+)?(?:static\s+)?(?:<[^>]+>\s+)?([\w][\w.<>, \[\]]*?)\s+(\w+)\s*\(([^)]*)\)\s*(?:throws\s+[\w,\s]+)?\s*[{;]/gm
  let mm
  while ((mm = methodRe.exec(content)) !== null) {
    const returnType = mm[2].trim()
    const mName = mm[3]
    const paramsRaw = mm[4]

    // Skip non-methods
    const skipKeywords = ["class", "interface", "enum", "new", "return", "if", "while", "for", "switch", "catch"]
    if (skipKeywords.includes(returnType)) continue
    if (mName === name) continue // constructor
    if (TEST_ONLY.has(mName)) continue

    const params = paramsRaw
      .split(",")
      .map((p) => p.replace(/@\w+\s+/g, "").trim())
      .filter(Boolean)
      .map((p) => {
        const parts = p.trim().split(/\s+/)
        return {
          type: parts.slice(0, -1).join(" ") || parts[0],
          name: parts[parts.length - 1].replace(/[^a-zA-Z0-9_]/, "") || "arg",
        }
      })

    const doc = cleanJavadoc(mm[1] || "")
    methods.push({ name: mName, returnType, params, doc })
  }

  return { name, kind, parents, methods, fields, enums }
}

// ── Main ─────────────────────────────────────────────────────────────────────

const files = getAllJavaFiles(STUBS_DIR)
const completions = {}

for (const file of files) {
  const content = readFileSync(file, "utf-8")
  const parsed = parseStub(content)
  if (parsed) {
    completions[parsed.name] = {
      kind: parsed.kind,
      parents: parsed.parents,
      methods: parsed.methods,
      fields: parsed.fields,
      enums: parsed.enums,
    }
    console.log(
      `  ${parsed.name} (${parsed.kind}): ${parsed.methods.length} methods, ${parsed.fields.length} fields, ${Object.keys(parsed.enums).length} enums`
    )
  }
}

writeFileSync(OUTPUT, JSON.stringify(completions, null, 2))
console.log(`\n✓ Written to lib/ftc-completions.json (${Object.keys(completions).length} classes)`)

"use client"

import { useMemo } from "react"
import hljs from "highlight.js/lib/core"
import java from "highlight.js/lib/languages/java"
import xml from "highlight.js/lib/languages/xml"
import bash from "highlight.js/lib/languages/bash"
import plaintext from "highlight.js/lib/languages/plaintext"
import "highlight.js/styles/vs2015.css"

hljs.registerLanguage("java", java)
hljs.registerLanguage("xml", xml)
hljs.registerLanguage("bash", bash)
hljs.registerLanguage("plaintext", plaintext)
hljs.registerLanguage("text", plaintext)

interface LessonContentProps {
  content: string
}

export function LessonContent({ content }: LessonContentProps) {
  const html = useMemo(() => renderMarkdown(content), [content])

  return (
    <div className="mx-auto max-w-none p-6 lg:p-8">
      <article
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

// Simple markdown renderer — handles the subset we use in lessons
function renderMarkdown(md: string): string {
  let html = md

  // Extract code blocks first to protect them from paragraph processing
  const codeBlocks: string[] = []
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (_match, lang: string, code: string) => {
      const trimmed = code.trim()
      const language = lang || "plaintext"
      const highlighted = hljs.getLanguage(language)
        ? hljs.highlight(trimmed, { language }).value
        : escapeHtml(trimmed)
      const block = `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`
      codeBlocks.push(block)
      return `\x00CODE_BLOCK_${codeBlocks.length - 1}\x00`
    }
  )

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>")

  // Headers
  html = html.replace(/^#### (.+)$/gm, "<h4>$1</h4>")
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>")
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>")
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>")

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>")

  // Images (must come before links)
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" class="rounded-lg">'
  )

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  )

  // Horizontal rules
  html = html.replace(/^---$/gm, "<hr>")

  // Tables
  html = html.replace(
    /^\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)*)/gm,
    (_match, headerRow: string, bodyRows: string) => {
      const headers = headerRow
        .split("|")
        .map((h: string) => h.trim())
      const rows = bodyRows
        .trim()
        .split("\n")
        .map((row: string) =>
          row
            .split("|")
            .map((c: string) => c.trim())
            .filter(Boolean)
        )

      let table = "<table><thead><tr>"
      for (const h of headers) {
        table += `<th>${h}</th>`
      }
      table += "</tr></thead><tbody>"
      for (const row of rows) {
        table += "<tr>"
        for (const cell of row) {
          table += `<td>${cell}</td>`
        }
        table += "</tr>"
      }
      table += "</tbody></table>"
      return table
    }
  )

  // Unordered lists
  html = html.replace(
    /^((?:- .+\n?)+)/gm,
    (_match, listBlock: string) => {
      const items = listBlock
        .trim()
        .split("\n")
        .map((line: string) => `<li>${line.replace(/^- /, "")}</li>`)
        .join("")
      return `<ul>${items}</ul>`
    }
  )

  // Ordered lists
  html = html.replace(
    /^((?:\d+\. .+\n?)+)/gm,
    (_match, listBlock: string) => {
      const items = listBlock
        .trim()
        .split("\n")
        .map((line: string) => `<li>${line.replace(/^\d+\. /, "")}</li>`)
        .join("")
      return `<ol>${items}</ol>`
    }
  )

  // Blockquotes
  html = html.replace(
    /^((?:> .+\n?)+)/gm,
    (_match, block: string) => {
      const content = block
        .split("\n")
        .map((line: string) => line.replace(/^> ?/, ""))
        .join("\n")
      return `<blockquote><p>${content.trim()}</p></blockquote>`
    }
  )

  // Paragraphs — wrap consecutive non-tag text lines
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim()
      if (!trimmed) return ""
      if (
        trimmed.startsWith("\x00CODE_BLOCK_") ||
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<pre") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<ol") ||
        trimmed.startsWith("<table") ||
        trimmed.startsWith("<blockquote") ||
        trimmed.startsWith("<hr")
      ) {
        return trimmed
      }
      return `<p>${trimmed.replace(/\n/g, "<br>")}</p>`
    })
    .join("\n")

  // Restore code blocks
  html = html.replace(/\x00CODE_BLOCK_(\d+)\x00/g, (_match, i) => codeBlocks[Number(i)])

  return html
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

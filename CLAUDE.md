# Code FTC

## Overview
Codecademy-style interactive learning platform for FTC (FIRST Tech Challenge) programming in Java. Students read lesson content on the left panel and write/run real Java code on the right panel.

## Tech Stack
- **Framework**: Next.js 16.1 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + @tailwindcss/typography
- **Editor**: Monaco Editor (@monaco-editor/react)
- **Package Manager**: Bun (always use `bun` commands, never npm/yarn/pnpm)
- **Java Sandbox**: Docker (JDK 17 Alpine, FTC SDK stubs)

## Commands
- `bun dev` — Start dev server (Turbopack)
- `bun run build` — Production build
- `bun run lint` — ESLint
- `bun run docker:build-sandbox` — Build Java sandbox Docker image

## Project Structure
- `app/` — Next.js App Router pages and API routes
- `components/` — React components (layout, lesson, editor, ui)
- `content/lessons/` — Lesson content (MDX + exercise.json per lesson)
- `lib/` — Server-side utilities (Docker, compiler, lesson loader, types)
- `ftc-stubs/` — Java FTC SDK stub source files
- `docker/java-sandbox/` — Dockerfile + entrypoint for Java compilation sandbox

## Conventions
- Use `@/*` path alias for imports
- Components use named exports
- Server components by default; `"use client"` only when needed
- MDX for lesson content with gray-matter frontmatter
- Exercise definitions in exercise.json alongside content.mdx
- Monaco editor loaded via dynamic import (no SSR)

#!/usr/bin/env node
/**
 * Downloads the official FTC Robot Controller project from GitHub
 * and saves it as ftc-template/FtcRobotController.zip
 *
 * Run: bun run setup:ftc-template
 */

import { mkdirSync, existsSync, writeFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")
const OUT_DIR = join(ROOT, "ftc-template")
const OUT_FILE = join(OUT_DIR, "FtcRobotController.zip")

const ZIP_URL =
  "https://codeload.github.com/FIRST-Tech-Challenge/FtcRobotController/zip/refs/heads/master"

async function main() {
  if (existsSync(OUT_FILE)) {
    console.log("✓ ftc-template/FtcRobotController.zip already exists, skipping download.")
    return
  }

  mkdirSync(OUT_DIR, { recursive: true })

  console.log("Downloading FTC Robot Controller from GitHub...")
  console.log(`  ${ZIP_URL}`)

  const response = await fetch(ZIP_URL)
  if (!response.ok) {
    throw new Error(`Failed to download: HTTP ${response.status}`)
  }

  const total = parseInt(response.headers.get("content-length") ?? "0", 10)
  const reader = response.body.getReader()
  const chunks = []
  let received = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    received += value.length
    if (total) {
      const pct = ((received / total) * 100).toFixed(0)
      process.stdout.write(`\r  ${(received / 1024 / 1024).toFixed(1)} MB / ${(total / 1024 / 1024).toFixed(1)} MB (${pct}%)`)
    } else {
      process.stdout.write(`\r  ${(received / 1024 / 1024).toFixed(1)} MB downloaded`)
    }
  }

  console.log()

  const buffer = Buffer.concat(chunks)
  writeFileSync(OUT_FILE, buffer)
  console.log(`✓ Saved to ftc-template/FtcRobotController.zip (${(buffer.length / 1024 / 1024).toFixed(1)} MB)`)
}

main().catch((err) => {
  console.error("Error:", err.message)
  process.exit(1)
})

import { mkdtemp, writeFile, copyFile, rm, mkdir } from "node:fs/promises"
import { join } from "node:path"
import type { Exercise, ExecutionResult } from "./types"
import { runInSandbox, isDockerAvailable, isSandboxImageBuilt } from "./docker"

export async function executeCode(
  code: string,
  exercise: Exercise,
  lessonId: string
): Promise<ExecutionResult> {
  if (!(await isDockerAvailable())) {
    return {
      success: false,
      compilationError: "Docker is not running. Please start Docker to run code.",
      testResults: [],
    }
  }

  if (!(await isSandboxImageBuilt())) {
    return {
      success: false,
      compilationError: 'Sandbox image not built. Run "bun run docker:build-sandbox" first.',
      testResults: [],
    }
  }

  const tmpBase = join(process.cwd(), ".tmp-exec")
  await mkdir(tmpBase, { recursive: true })
  const workDir = await mkdtemp(join(tmpBase, "run-"))

  try {
    // Write student code
    await writeFile(join(workDir, "StudentCode.java"), code)

    // Copy the lesson's Test.java into the work directory
    const testSrcPath = join(
      process.cwd(),
      "content/lessons",
      ...lessonId.split("/"),
      "Test.java"
    )
    await copyFile(testSrcPath, join(workDir, "Test.java"))

    await mkdir(join(workDir, "out"), { recursive: true })

    const rawOutput = await runInSandbox(workDir)

    try {
      return JSON.parse(rawOutput) as ExecutionResult
    } catch {
      return {
        success: false,
        runtimeError: `Unexpected output from sandbox: ${rawOutput.slice(0, 500)}`,
        testResults: [],
      }
    }
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {})
  }
}

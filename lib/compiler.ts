import { mkdtemp, writeFile, copyFile, rm, mkdir, chmod } from "node:fs/promises"
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
      compilationError: "Sandbox image not available. Please ensure the sandbox image is pulled.",
      testResults: [],
    }
  }

  const tmpBase = process.env.EXEC_TMP_DIR ?? join(process.cwd(), ".tmp-exec")
  await mkdir(tmpBase, { recursive: true })
  const workDir = await mkdtemp(join(tmpBase, "run-"))
  // mkdtemp creates dirs with 0700; the sandbox container runs as a different
  // user, so we need 0755 so it can read and enter the directory.
  await chmod(workDir, 0o755)

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

    const outDir = join(workDir, "out")
    await mkdir(outDir, { recursive: true })
    // The sandbox user needs write access to compile class files into out/.
    await chmod(outDir, 0o777)

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

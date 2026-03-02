import type { ExecutionResult } from "./types"

const COMPILE_TIMEOUT_MS = 30_000
const RUN_TIMEOUT_MS = 15_000

const STUBS_JAR = "/app/cheerpj/ftc-stubs.jar"
const TOOLS_JAR = "/app/cheerpj/tools.jar"
const COMPILE_CP = `${TOOLS_JAR}:${STUBS_JAR}`
const RUN_CP = `${STUBS_JAR}:/files/`

/**
 * Compile and execute Java code entirely in the browser using CheerpJ.
 *
 * Flow:
 *  1. Write StudentCode.java and Test.java to CheerpJ's virtual FS
 *  2. Invoke javac (com.sun.tools.javac.Main) to compile both files
 *  3. If compilation succeeds, run Test.main()
 *  4. Parse the JSON test results from captured console output
 *
 * In CheerpJ 3.0, System.out.println goes to console.log, so we intercept
 * console.log to capture the output.
 */
export async function executeInBrowser(
  studentCode: string,
  testCode: string,
): Promise<ExecutionResult> {
  const encoder = new TextEncoder()

  // Write source files to CheerpJ virtual filesystem
  // CheerpJ 3.0 renamed cheerpjAddStringFile → cheerpOSAddStringFile,
  // but still supports the old name (with a deprecation warning)
  const addFile = typeof cheerpOSAddStringFile === "function"
    ? cheerpOSAddStringFile
    : cheerpjAddStringFile

  addFile("/str/StudentCode.java", encoder.encode(studentCode))
  addFile("/str/Test.java", encoder.encode(testCode))

  // ── Compile ──────────────────────────────────────────────────────────
  const compileLog = createConsoleCapture()
  let compileExit: number
  try {
    compileExit = await withTimeout(
      cheerpjRunMain(
        "com.sun.tools.javac.Main",
        COMPILE_CP,
        "-d", "/files/",
        "-cp", STUBS_JAR,
        "/str/StudentCode.java",
        "/str/Test.java"
      ),
      COMPILE_TIMEOUT_MS
    )
  } catch {
    compileLog.restore()
    return {
      success: false,
      compilationError: "Compilation timed out (30 second limit)",
      timeout: true,
      testResults: [],
    }
  }
  const compileOutput = compileLog.restore()

  if (compileExit !== 0) {
    return {
      success: false,
      compilationError: compileOutput || "Compilation failed",
      testResults: [],
    }
  }

  // ── Execute ──────────────────────────────────────────────────────────
  const runLog = createConsoleCapture()
  let runExit: number
  try {
    runExit = await withTimeout(
      cheerpjRunMain("Test", RUN_CP),
      RUN_TIMEOUT_MS
    )
  } catch {
    runLog.restore()
    return {
      success: false,
      runtimeError: "Execution timed out (15 second limit)",
      timeout: true,
      testResults: [],
    }
  }
  const runOutput = runLog.restore()

  // Parse output: TestBase.printResults() outputs a single JSON line to stdout.
  const parsed = parseTestOutput(runOutput)

  if (parsed) {
    return {
      ...parsed,
      output: parsed.output || undefined,
    }
  }

  // Couldn't parse JSON — treat as runtime error
  if (runExit !== 0) {
    return {
      success: false,
      runtimeError: runOutput || "Runtime error (non-zero exit code)",
      testResults: [],
    }
  }

  return {
    success: false,
    runtimeError: runOutput || "No test output produced",
    testResults: [],
  }
}

/**
 * Parse the captured console output to extract the JSON test results.
 * TestBase.printResults() writes a JSON object as the last line of stdout.
 */
function parseTestOutput(rawOutput: string): (ExecutionResult & { output?: string }) | null {
  if (!rawOutput) return null

  const lines = rawOutput.split("\n")

  // Scan from the end for a line that looks like JSON
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i]!.trim()
    if (line.startsWith("{") && line.endsWith("}")) {
      try {
        const result = JSON.parse(line) as ExecutionResult
        if ("testResults" in result && Array.isArray(result.testResults)) {
          // Everything before this line is console output
          const consoleOutput = lines.slice(0, i).join("\n").trim()
          return {
            ...result,
            output: consoleOutput || undefined,
          }
        }
      } catch {
        // Not valid JSON — keep scanning
      }
    }
  }

  return null
}

/**
 * Intercept console.log/warn/error to capture Java stdout/stderr.
 * Returns an object with a `restore()` method that stops capturing
 * and returns the accumulated text.
 */
function createConsoleCapture() {
  const lines: string[] = []
  const origLog = console.log
  const origWarn = console.warn
  const origError = console.error

  console.log = (...args: unknown[]) => {
    lines.push(args.map(String).join(" "))
    origLog.apply(console, args)
  }
  console.warn = (...args: unknown[]) => {
    lines.push(args.map(String).join(" "))
    origWarn.apply(console, args)
  }
  console.error = (...args: unknown[]) => {
    lines.push(args.map(String).join(" "))
    origError.apply(console, args)
  }

  return {
    restore(): string {
      console.log = origLog
      console.warn = origWarn
      console.error = origError
      return lines.join("\n").trim()
    },
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), ms)
    ),
  ])
}

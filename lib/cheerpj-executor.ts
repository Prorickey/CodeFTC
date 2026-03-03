import type { ExecutionResult, Language } from "./types"

const JAVA_COMPILE_TIMEOUT_MS = 30_000
const KOTLIN_COMPILE_TIMEOUT_MS = 60_000
const RUN_TIMEOUT_MS = 15_000

const STUBS_JAR = "/app/cheerpj/ftc-stubs.jar"
const TOOLS_JAR = "/app/cheerpj/tools.jar"
const KOTLIN_COMPILER_JAR = "/app/cheerpj/kotlin-compiler-embeddable.jar"
const KOTLIN_STDLIB_JAR = "/app/cheerpj/kotlin-stdlib.jar"

const COMPILE_CP = `${TOOLS_JAR}:${STUBS_JAR}`
const RUN_CP_JAVA = `${STUBS_JAR}:/files/`
const RUN_CP_KOTLIN = `${KOTLIN_STDLIB_JAR}:${STUBS_JAR}:/files/`

/**
 * Compile and execute code entirely in the browser using CheerpJ.
 *
 * Java flow:
 *  1. Write StudentCode.java and Test.java to CheerpJ's virtual FS
 *  2. Invoke javac to compile both files
 *  3. Run Test.main()
 *
 * Kotlin flow:
 *  1. Write StudentCode.kt and Test.java to CheerpJ's virtual FS
 *  2. Invoke K2JVMCompiler to compile StudentCode.kt
 *  3. Invoke javac to compile Test.java (with /files/ on classpath to see Kotlin output)
 *  4. Run Test.main() with kotlin-stdlib on the runtime classpath
 *
 * In CheerpJ 3.0, System.out.println goes to console.log, so we intercept
 * console.log to capture the output.
 */
export async function executeInBrowser(
  studentCode: string,
  testCode: string,
  language: Language = "java",
): Promise<ExecutionResult> {
  const encoder = new TextEncoder()

  // Write source files to CheerpJ virtual filesystem
  // CheerpJ 3.0 renamed cheerpjAddStringFile → cheerpOSAddStringFile,
  // but still supports the old name (with a deprecation warning)
  const addFile = typeof cheerpOSAddStringFile === "function"
    ? cheerpOSAddStringFile
    : cheerpjAddStringFile

  addFile("/str/Test.java", encoder.encode(testCode))

  if (language === "kotlin") {
    return executeKotlin(studentCode, addFile, encoder)
  }

  return executeJava(studentCode, addFile, encoder)
}

async function executeJava(
  studentCode: string,
  addFile: (path: string, data: Uint8Array) => void,
  encoder: TextEncoder,
): Promise<ExecutionResult> {
  addFile("/str/StudentCode.java", encoder.encode(studentCode))

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
      JAVA_COMPILE_TIMEOUT_MS
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

  return runTests(RUN_CP_JAVA)
}

async function executeKotlin(
  studentCode: string,
  addFile: (path: string, data: Uint8Array) => void,
  encoder: TextEncoder,
): Promise<ExecutionResult> {
  addFile("/str/StudentCode.kt", encoder.encode(studentCode))

  // ── Step 1: Compile Kotlin ────────────────────────────────────────────
  const kotlinLog = createConsoleCapture()
  let kotlinExit: number
  try {
    kotlinExit = await withTimeout(
      cheerpjRunMain(
        "org.jetbrains.kotlin.cli.jvm.K2JVMCompiler",
        KOTLIN_COMPILER_JAR,
        "-no-stdlib",
        "-cp", `${KOTLIN_STDLIB_JAR}:${STUBS_JAR}`,
        "-d", "/files/",
        "/str/StudentCode.kt"
      ),
      KOTLIN_COMPILE_TIMEOUT_MS
    )
  } catch {
    kotlinLog.restore()
    return {
      success: false,
      compilationError: "Kotlin compilation timed out (60 second limit)",
      timeout: true,
      testResults: [],
    }
  }
  const kotlinOutput = kotlinLog.restore()

  if (kotlinExit !== 0) {
    return {
      success: false,
      compilationError: kotlinOutput || "Kotlin compilation failed",
      testResults: [],
    }
  }

  // ── Step 2: Compile Test.java (needs /files/ on classpath for Kotlin output) ──
  const javacLog = createConsoleCapture()
  let javacExit: number
  try {
    javacExit = await withTimeout(
      cheerpjRunMain(
        "com.sun.tools.javac.Main",
        COMPILE_CP,
        "-d", "/files/",
        "-cp", `${STUBS_JAR}:/files/`,
        "/str/Test.java"
      ),
      JAVA_COMPILE_TIMEOUT_MS
    )
  } catch {
    javacLog.restore()
    return {
      success: false,
      compilationError: "Test compilation timed out (30 second limit)",
      timeout: true,
      testResults: [],
    }
  }
  const javacOutput = javacLog.restore()

  if (javacExit !== 0) {
    return {
      success: false,
      compilationError: javacOutput || "Test compilation failed",
      testResults: [],
    }
  }

  return runTests(RUN_CP_KOTLIN)
}

async function runTests(classpath: string): Promise<ExecutionResult> {
  const runLog = createConsoleCapture()
  let runExit: number
  try {
    runExit = await withTimeout(
      cheerpjRunMain("Test", classpath),
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

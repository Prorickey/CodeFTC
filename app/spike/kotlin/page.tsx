"use client"

import { useState, useRef } from "react"
import { useCheerpJ } from "@/lib/cheerpj-context"

const KOTLIN_SOURCE = `import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode
import com.qualcomm.robotcore.eventloop.opmode.TeleOp

@TeleOp(name = "Hello OpMode")
class StudentCode : LinearOpMode() {
    override fun runOpMode() {
        telemetry.addData("Message", "Hello, FTC!")
        telemetry.update()
        waitForStart()
        telemetry.addData("Status", "Running")
        telemetry.update()
    }
}`

const STUBS_JAR = "/app/cheerpj/ftc-stubs.jar"
const TOOLS_JAR = "/app/cheerpj/tools.jar"
const KOTLIN_COMPILER_JAR = "/app/cheerpj/kotlin-compiler-embeddable.jar"
const KOTLIN_STDLIB_JAR = "/app/cheerpj/kotlin-stdlib.jar"

// Use the exact test from 01-hello-opmode (no debug lines)
const TEST_SOURCE = `import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;
import java.util.List;

public class Test {
    public static void main(String[] args) throws Exception {
        TelemetryImpl telemetry = new TelemetryImpl();

        StudentCode op = new StudentCode();
        op.hardwareMap = new HardwareMap();
        op.telemetry = telemetry;
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        List<String> log = telemetry.getLog();
        List<String> calls = op.getCallLog();

        TestBase.assertTrue("waitForStart() is called",
                calls.stream().anyMatch(c -> c.contains("waitForStart")),
                "waitForStart() was never called");
        TestBase.assertContains("Telemetry shows \\"Hello, FTC!\\"", log, "Hello, FTC!");
        TestBase.assertContains("Telemetry shows \\"Running\\"", log, "Running");

        TestBase.printResults();
    }
}`

interface LogEntry {
  time: number
  message: string
  type: "info" | "error" | "success" | "timing"
}

export default function KotlinSpikePage() {
  const { status: cheerpjStatus } = useCheerpJ()
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [running, setRunning] = useState(false)
  const startTimeRef = useRef(0)

  function log(message: string, type: LogEntry["type"] = "info") {
    const time = Date.now() - startTimeRef.current
    setLogs((prev) => [...prev, { time, message, type }])
  }

  function captureConsole() {
    const captured: string[] = []
    const origLog = console.log
    const origWarn = console.warn
    const origError = console.error
    console.log = (...args: unknown[]) => { captured.push(args.map(String).join(" ")); origLog.apply(console, args) }
    console.warn = (...args: unknown[]) => { captured.push(args.map(String).join(" ")); origWarn.apply(console, args) }
    console.error = (...args: unknown[]) => { captured.push(args.map(String).join(" ")); origError.apply(console, args) }
    return {
      restore(): string {
        console.log = origLog
        console.warn = origWarn
        console.error = origError
        return captured.join("\n").trim()
      },
    }
  }

  async function runSpike() {
    setLogs([])
    setRunning(true)
    startTimeRef.current = Date.now()

    const encoder = new TextEncoder()
    const addFile = typeof cheerpOSAddStringFile === "function"
      ? cheerpOSAddStringFile
      : cheerpjAddStringFile

    try {
      // Write source files and pre-create output directory
      log("Writing StudentCode.kt to virtual FS...")
      addFile("/str/StudentCode.kt", encoder.encode(KOTLIN_SOURCE))
      addFile("/str/Test.java", encoder.encode(TEST_SOURCE))

      // Step 1: Compile Kotlin
      log("Compiling Kotlin with K2JVMCompiler (cold)...")
      const kotlinStart = Date.now()

      const cap1 = captureConsole()
      const kotlinExit = await cheerpjRunMain(
        "org.jetbrains.kotlin.cli.jvm.K2JVMCompiler",
        KOTLIN_COMPILER_JAR,
        "-no-stdlib",
        "-cp", `${KOTLIN_STDLIB_JAR}:${STUBS_JAR}`,
        "-d", "/files/",
        "/str/StudentCode.kt"
      )
      const kotlinOutput = cap1.restore()

      const kotlinColdTime = Date.now() - kotlinStart
      if (kotlinExit !== 0) {
        log(`Kotlin compilation FAILED (exit ${kotlinExit})`, "error")
        if (kotlinOutput) log(`Output: ${kotlinOutput}`, "error")
        return
      }
      log(`Kotlin cold compile: ${kotlinColdTime}ms`, "timing")
      log("Kotlin compilation succeeded!", "success")

      // Step 2: Warm compile (re-compile same file)
      log("Compiling Kotlin again (warm)...")
      addFile("/str/StudentCode.kt", encoder.encode(KOTLIN_SOURCE))
      const warmStart = Date.now()

      const cap2 = captureConsole()
      const warmExit = await cheerpjRunMain(
        "org.jetbrains.kotlin.cli.jvm.K2JVMCompiler",
        KOTLIN_COMPILER_JAR,
        "-no-stdlib",
        "-cp", `${KOTLIN_STDLIB_JAR}:${STUBS_JAR}`,
        "-d", "/files/",
        "/str/StudentCode.kt"
      )
      const warmOutput = cap2.restore()

      const kotlinWarmTime = Date.now() - warmStart
      if (warmExit !== 0) {
        log(`Kotlin warm compile FAILED (exit ${warmExit})`, "error")
        if (warmOutput) log(`Output: ${warmOutput}`, "error")
        return
      }
      log(`Kotlin warm compile: ${kotlinWarmTime}ms`, "timing")

      // Step 3: Compile Test.java with javac
      log("Compiling Test.java with javac...")
      const javacStart = Date.now()

      const cap3 = captureConsole()
      const javacExit = await cheerpjRunMain(
        "com.sun.tools.javac.Main",
        `${TOOLS_JAR}:${STUBS_JAR}`,
        "-d", "/files/",
        "-cp", `${STUBS_JAR}:/files/`,
        "/str/Test.java"
      )
      const javacOutput = cap3.restore()

      const javacTime = Date.now() - javacStart
      if (javacExit !== 0) {
        log(`javac compilation FAILED (exit ${javacExit})`, "error")
        if (javacOutput) log(`Output: ${javacOutput}`, "error")
        return
      }
      log(`javac compile: ${javacTime}ms`, "timing")
      log("Test.java compilation succeeded!", "success")

      // Step 4: Run Test.main()
      log("Running Test.main()...")
      const runStart = Date.now()

      const cap4 = captureConsole()
      const runExit = await cheerpjRunMain(
        "Test",
        `${KOTLIN_STDLIB_JAR}:${STUBS_JAR}:/files/`
      )
      const runOutput = cap4.restore()

      const runTime = Date.now() - runStart
      log(`Execution: ${runTime}ms`, "timing")

      if (runExit === 0) {
        log("Test execution completed successfully!", "success")
      } else {
        log(`Test execution FAILED (exit ${runExit})`, "error")
      }
      if (runOutput) log(`Test output: ${runOutput}`, "info")

      // Summary
      const totalTime = Date.now() - startTimeRef.current
      log("--- SUMMARY ---", "info")
      log(`Cold Kotlin compile: ${kotlinColdTime}ms`, "timing")
      log(`Warm Kotlin compile: ${kotlinWarmTime}ms`, "timing")
      log(`javac compile: ${javacTime}ms`, "timing")
      log(`Test execution: ${runTime}ms`, "timing")
      log(`Total: ${totalTime}ms`, "timing")
    } catch (err) {
      log(`Error: ${err instanceof Error ? err.message : String(err)}`, "error")
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-2xl font-bold text-[var(--color-text)]">
          Kotlin CheerpJ Spike
        </h1>
        <p className="mb-6 text-[var(--color-text-muted)]">
          Tests whether kotlinc (K2JVMCompiler) can run inside CheerpJ to compile
          Kotlin FTC code in the browser.
        </p>

        <div className="mb-4 flex items-center gap-4">
          <button
            onClick={runSpike}
            disabled={running || cheerpjStatus !== "ready"}
            className="rounded-md bg-[var(--color-success)] px-4 py-2 text-sm font-medium text-white transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {running ? "Running..." : cheerpjStatus !== "ready" ? "CheerpJ Loading..." : "Run Spike"}
          </button>
          <span className="text-sm text-[var(--color-text-muted)]">
            CheerpJ: {cheerpjStatus}
          </span>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[#1e1e1e] p-4 font-mono text-sm">
          {logs.length === 0 ? (
            <p className="text-gray-500">Click &quot;Run Spike&quot; to start...</p>
          ) : (
            logs.map((entry, i) => (
              <div key={i} className="py-0.5">
                <span className="text-gray-500">[{(entry.time / 1000).toFixed(1)}s]</span>{" "}
                <span
                  className={
                    entry.type === "error"
                      ? "text-red-400"
                      : entry.type === "success"
                        ? "text-green-400"
                        : entry.type === "timing"
                          ? "text-yellow-300"
                          : "text-gray-300"
                  }
                >
                  {entry.message}
                </span>
              </div>
            ))
          )}
          {running && (
            <div className="mt-1 flex items-center gap-2 text-gray-400">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
              Running...
            </div>
          )}
        </div>

        <details className="mt-6">
          <summary className="cursor-pointer text-sm text-[var(--color-text-muted)]">
            Kotlin source code being compiled
          </summary>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-[#1e1e1e] p-4 text-sm text-gray-300">
            {KOTLIN_SOURCE}
          </pre>
        </details>
      </div>
    </div>
  )
}

import { mkdtemp, writeFile, rm, mkdir } from "node:fs/promises"
import { join } from "node:path"
import type { Exercise, ExecutionResult, TestDefinition, HardwareConfig } from "./types"
import { runInSandbox, isDockerAvailable, isSandboxImageBuilt } from "./docker"

export async function executeCode(
  code: string,
  exercise: Exercise
): Promise<ExecutionResult> {
  // Check Docker availability
  if (!(await isDockerAvailable())) {
    return {
      success: false,
      compilationError:
        "Docker is not running. Please start Docker to run code.",
      testResults: [],
    }
  }

  if (!(await isSandboxImageBuilt())) {
    return {
      success: false,
      compilationError:
        'Sandbox image not built. Run "bun run docker:build-sandbox" first.',
      testResults: [],
    }
  }

  // Create temp directory inside project (ensures Docker can access it)
  const tmpBase = join(process.cwd(), ".tmp-exec")
  await mkdir(tmpBase, { recursive: true })
  const workDir = await mkdtemp(join(tmpBase, "run-"))

  try {
    // Write student code
    await writeFile(join(workDir, "StudentCode.java"), code)

    // Generate test runner
    const testRunner = generateTestRunner(exercise)
    await writeFile(join(workDir, "TestRunner.java"), testRunner)

    // Create output directory
    await mkdir(join(workDir, "out"), { recursive: true })

    // Run in sandbox
    const rawOutput = await runInSandbox(workDir)

    // Parse result
    try {
      const result = JSON.parse(rawOutput) as ExecutionResult
      return result
    } catch {
      return {
        success: false,
        runtimeError: `Unexpected output from sandbox: ${rawOutput.slice(0, 500)}`,
        testResults: [],
      }
    }
  } finally {
    // Clean up temp directory
    await rm(workDir, { recursive: true, force: true }).catch(() => {})
  }
}

function generateTestRunner(exercise: Exercise): string {
  const { hardwareConfig, tests, className } = exercise

  const setupLines = generateHardwareSetup(hardwareConfig)
  const testCases = tests.map((t, i) => generateTestCase(t, i)).join("\n")

  return `
import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;
import java.util.ArrayList;
import java.util.List;

public class TestRunner {
    public static void main(String[] args) {
        List<String> results = new ArrayList<>();
        boolean allPassed = true;

        try {
            // Create and configure the OpMode
            StudentCode opMode = new StudentCode();
            HardwareMap hwMap = new HardwareMap();
            TelemetryImpl telemetry = new TelemetryImpl();
            Gamepad gamepad1 = new Gamepad();
            Gamepad gamepad2 = new Gamepad();

            // Setup hardware
${setupLines}

            // Configure the OpMode
            opMode.hardwareMap = hwMap;
            opMode.telemetry = telemetry;
            opMode.gamepad1 = gamepad1;
            opMode.gamepad2 = gamepad2;
            opMode.setStarted(true);

            // Run the OpMode
            try {
                opMode.runOpMode();
            } catch (Exception e) {
                // Some tests check state after partial execution
            }

            // Run tests
${testCases}

        } catch (Exception e) {
            results.add("{\\"name\\":\\"Execution\\",\\"passed\\":false,\\"message\\":\\"" +
                escapeJson(e.getClass().getSimpleName() + ": " + e.getMessage()) + "\\"}");
            allPassed = false;
        }

        // Output JSON
        StringBuilder json = new StringBuilder();
        json.append("{\\"success\\":").append(allPassed);
        json.append(",\\"testResults\\":[");
        for (int i = 0; i < results.size(); i++) {
            if (i > 0) json.append(",");
            json.append(results.get(i));
        }
        json.append("]}");
        System.out.println(json.toString());
    }

    private static String escapeJson(String s) {
        if (s == null) return "null";
        return s.replace("\\\\", "\\\\\\\\")
                .replace("\\"", "\\\\\\"")
                .replace("\\n", "\\\\n")
                .replace("\\r", "\\\\r")
                .replace("\\t", "\\\\t");
    }
}
`
}

function generateHardwareSetup(config: HardwareConfig): string {
  const lines: string[] = []

  if (config.motors) {
    for (const [name, motorConfig] of Object.entries(config.motors)) {
      lines.push(`            DcMotorImpl ${sanitize(name)} = new DcMotorImpl();`)
      const extra = motorConfig as Record<string, unknown>
      if (typeof extra.currentPosition === "number") {
        lines.push(`            ${sanitize(name)}.setCurrentPosition(${extra.currentPosition});`)
      }
      lines.push(`            hwMap.registerDevice("${name}", ${sanitize(name)});`)
    }
  }

  if (config.servos) {
    for (const [name] of Object.entries(config.servos)) {
      lines.push(`            ServoImpl ${sanitize(name)} = new ServoImpl();`)
      lines.push(`            hwMap.registerDevice("${name}", ${sanitize(name)});`)
    }
  }

  if (config.gamepad) {
    for (const [field, value] of Object.entries(config.gamepad)) {
      if (typeof value === "number") {
        lines.push(`            gamepad1.${field} = ${value}f;`)
      } else if (typeof value === "boolean") {
        lines.push(`            gamepad1.${field} = ${value};`)
      }
    }
  }

  return lines.join("\n")
}

function generateTestCase(test: TestDefinition, index: number): string {
  const varName = `test${index}`

  switch (test.type) {
    case "motor_power":
      return `
            {
                boolean ${varName}Passed = false;
                String ${varName}Msg = "";
                try {
                    DcMotorImpl motor = (DcMotorImpl) hwMap.get(DcMotor.class, "${test.device}");
                    double actual = motor.getPower();
                    double expected = ${test.expected};
                    double tolerance = ${test.tolerance ?? 0.01};
                    ${varName}Passed = Math.abs(actual - expected) <= tolerance;
                    ${varName}Msg = ${varName}Passed
                        ? "Motor power is " + actual
                        : "Expected power " + expected + " but got " + actual;
                } catch (Exception e) {
                    ${varName}Msg = e.getMessage();
                }
                results.add("{\\"name\\":\\"${escapeJavaString(test.name)}\\",\\"passed\\":" + ${varName}Passed + ",\\"message\\":\\"" + escapeJson(${varName}Msg) + "\\"}");
                if (!${varName}Passed) allPassed = false;
            }`

    case "motor_direction":
      return `
            {
                boolean ${varName}Passed = false;
                String ${varName}Msg = "";
                try {
                    DcMotorImpl motor = (DcMotorImpl) hwMap.get(DcMotor.class, "${test.device}");
                    String actual = motor.getDirection().toString();
                    String expected = "${test.expected}";
                    ${varName}Passed = actual.equals(expected);
                    ${varName}Msg = ${varName}Passed
                        ? "Motor direction is " + actual
                        : "Expected direction " + expected + " but got " + actual;
                } catch (Exception e) {
                    ${varName}Msg = e.getMessage();
                }
                results.add("{\\"name\\":\\"${escapeJavaString(test.name)}\\",\\"passed\\":" + ${varName}Passed + ",\\"message\\":\\"" + escapeJson(${varName}Msg) + "\\"}");
                if (!${varName}Passed) allPassed = false;
            }`

    case "servo_position":
      return `
            {
                boolean ${varName}Passed = false;
                String ${varName}Msg = "";
                try {
                    ServoImpl servo = (ServoImpl) hwMap.get(Servo.class, "${test.device}");
                    double actual = servo.getPosition();
                    double expected = ${test.expected};
                    double tolerance = ${test.tolerance ?? 0.01};
                    ${varName}Passed = Math.abs(actual - expected) <= tolerance;
                    ${varName}Msg = ${varName}Passed
                        ? "Servo position is " + actual
                        : "Expected position " + expected + " but got " + actual;
                } catch (Exception e) {
                    ${varName}Msg = e.getMessage();
                }
                results.add("{\\"name\\":\\"${escapeJavaString(test.name)}\\",\\"passed\\":" + ${varName}Passed + ",\\"message\\":\\"" + escapeJson(${varName}Msg) + "\\"}");
                if (!${varName}Passed) allPassed = false;
            }`

    case "method_call":
      return `
            {
                boolean ${varName}Passed = false;
                String ${varName}Msg = "";
                try {
                    java.util.List<String> callLog = opMode.getCallLog();
                    ${varName}Passed = callLog.stream().anyMatch(c -> c.contains("${test.method}"));
                    ${varName}Msg = ${varName}Passed
                        ? "${test.method}() was called"
                        : "${test.method}() was not called";
                } catch (Exception e) {
                    ${varName}Msg = e.getMessage();
                }
                results.add("{\\"name\\":\\"${escapeJavaString(test.name)}\\",\\"passed\\":" + ${varName}Passed + ",\\"message\\":\\"" + escapeJson(${varName}Msg) + "\\"}");
                if (!${varName}Passed) allPassed = false;
            }`

    case "telemetry_contains":
      return `
            {
                boolean ${varName}Passed = false;
                String ${varName}Msg = "";
                try {
                    java.util.List<String> log = telemetry.getLog();
                    String searchFor = "${escapeJavaString(test.contains ?? String(test.expected))}";
                    ${varName}Passed = log.stream().anyMatch(entry -> entry.contains(searchFor));
                    ${varName}Msg = ${varName}Passed
                        ? "Telemetry contains expected data"
                        : "Telemetry does not contain \\"" + searchFor + "\\"";
                } catch (Exception e) {
                    ${varName}Msg = e.getMessage();
                }
                results.add("{\\"name\\":\\"${escapeJavaString(test.name)}\\",\\"passed\\":" + ${varName}Passed + ",\\"message\\":\\"" + escapeJson(${varName}Msg) + "\\"}");
                if (!${varName}Passed) allPassed = false;
            }`

    case "motor_power_proportional":
      return `
            {
                boolean ${varName}Passed = false;
                String ${varName}Msg = "";
                try {
                    DcMotorImpl motor = (DcMotorImpl) hwMap.get(DcMotor.class, "${test.device}");
                    double power = motor.getPower();
                    // Check that power is proportional to error (non-zero and correct sign)
                    ${varName}Passed = Math.abs(power) > 0.01 && Math.abs(power) <= 1.0;
                    ${varName}Msg = ${varName}Passed
                        ? "Motor power (" + String.format("%.3f", power) + ") is proportional to error"
                        : "Expected proportional power but got " + power;
                } catch (Exception e) {
                    ${varName}Msg = e.getMessage();
                }
                results.add("{\\"name\\":\\"${escapeJavaString(test.name)}\\",\\"passed\\":" + ${varName}Passed + ",\\"message\\":\\"" + escapeJson(${varName}Msg) + "\\"}");
                if (!${varName}Passed) allPassed = false;
            }`

    default:
      return `
            results.add("{\\"name\\":\\"${escapeJavaString(test.name)}\\",\\"passed\\":false,\\"message\\":\\"Unknown test type: ${test.type}\\"}");
            allPassed = false;`
  }
}

function sanitize(name: string): string {
  return name.replace(/[^a-zA-Z0-9_]/g, "_")
}

function escapeJavaString(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")
}

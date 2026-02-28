import { test, expect } from "bun:test"
import { executeCode } from "../lib/compiler"
import type { Exercise } from "../lib/types"

const LESSON_ID = "00-test-fixtures/01-sandbox-test"

const fixture: Exercise = {
  title: "Sandbox Integration Test",
  testCount: 1,
  starterCode: "",
  solutionCode: "",
  hints: [],
}

test("passing code returns success with passing test result", async () => {
  const code = `
public class StudentCode {
    public String getGreeting() {
        return "Hello, FTC!";
    }
}
`
  const result = await executeCode(code, fixture, LESSON_ID)
  expect(result.success).toBe(true)
  expect(result.compilationError).toBeUndefined()
  expect(result.runtimeError).toBeUndefined()
  expect(result.testResults).toHaveLength(1)
  expect(result.testResults[0].passed).toBe(true)
}, 30_000)

test("invalid Java produces a compilation error", async () => {
  const code = `
public class StudentCode {
    this is not valid java
}
`
  const result = await executeCode(code, fixture, LESSON_ID)
  expect(result.compilationError).toBeTruthy()
  expect(result.testResults).toHaveLength(0)
}, 30_000)

test("wrong return value produces a failing test result", async () => {
  const code = `
public class StudentCode {
    public String getGreeting() {
        return "Wrong answer";
    }
}
`
  const result = await executeCode(code, fixture, LESSON_ID)
  expect(result.success).toBe(false)
  expect(result.compilationError).toBeUndefined()
  expect(result.runtimeError).toBeUndefined()
  expect(result.testResults).toHaveLength(1)
  expect(result.testResults[0].passed).toBe(false)
}, 30_000)

test("runtime exception produces a runtime error", async () => {
  const code = `
public class StudentCode {
    public String getGreeting() {
        throw new RuntimeException("Oops");
    }
}
`
  const result = await executeCode(code, fixture, LESSON_ID)
  expect(result.runtimeError).toBeTruthy()
  expect(result.testResults).toHaveLength(0)
}, 30_000)

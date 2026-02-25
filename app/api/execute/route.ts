import { NextResponse } from "next/server"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { executeCode } from "@/lib/compiler"
import { auth } from "@/auth"
import { recordEvent } from "@/lib/analytics"
import type { Exercise, ExecutionResult } from "@/lib/types"

export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json(
      { success: false, compilationError: "Sign in to run code", testResults: [] },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { code, lessonId } = body as { code: string; lessonId: string }

    if (!code || !lessonId) {
      return NextResponse.json(
        { success: false, compilationError: "Missing code or lessonId", testResults: [] },
        { status: 400 }
      )
    }

    // Load exercise config
    const exercisePath = join(
      process.cwd(),
      "content/lessons",
      ...lessonId.split("/"),
      "exercise.json"
    )

    let exercise: Exercise
    try {
      const raw = await readFile(exercisePath, "utf-8")
      exercise = JSON.parse(raw) as Exercise
    } catch {
      return NextResponse.json(
        { success: false, compilationError: `Lesson "${lessonId}" not found`, testResults: [] },
        { status: 404 }
      )
    }

    const result: ExecutionResult = await executeCode(code, exercise)

    await recordEvent({ type: "code_run", lessonId, userId: session.user.id })
    if (result.testResults.length > 0 && result.testResults.every((t) => t.passed)) {
      await recordEvent({ type: "exercise_complete", lessonId, userId: session.user.id })
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error("Execute error:", err)
    return NextResponse.json(
      {
        success: false,
        runtimeError: "Internal server error",
        testResults: [],
      },
      { status: 500 }
    )
  }
}

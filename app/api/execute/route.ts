import { NextResponse } from "next/server"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { executeCode } from "@/lib/compiler"
import type { Exercise, ExecutionResult } from "@/lib/types"

export async function POST(request: Request) {
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

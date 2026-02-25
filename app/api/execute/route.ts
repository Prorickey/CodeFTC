import { NextResponse } from "next/server"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { executeCode } from "@/lib/compiler"
import { auth } from "@/auth"
import { recordEvent } from "@/lib/analytics"
import { prisma } from "@/lib/prisma"
import { getDailyRunLimit } from "@/lib/siteConfig"
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
    // Rate-limit check: count today's code_run events for this user
    const [dailyRunLimit, todayRunCount] = await Promise.all([
      getDailyRunLimit(),
      prisma.analyticsEvent.count({
        where: {
          type: "code_run",
          userId: session.user.id,
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
    ])

    if (todayRunCount >= dailyRunLimit) {
      return NextResponse.json(
        {
          success: false,
          compilationError: `Daily run limit reached (${dailyRunLimit} runs/day). Try again tomorrow.`,
          testResults: [],
        },
        { status: 429 }
      )
    }

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

    const result: ExecutionResult = await executeCode(code, exercise, lessonId)

    const recorded = await recordEvent({ type: "code_run", lessonId, userId: session.user.id })
    if (!recorded) console.error("[execute] Failed to record code_run event for user", session.user.id)
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

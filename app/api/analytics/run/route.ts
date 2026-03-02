import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { recordEvent } from "@/lib/analytics"

export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  try {
    const body: unknown = await request.json()
    const { lessonId, allPassed } = body as {
      lessonId: string
      allPassed: boolean
    }

    if (!lessonId) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    await recordEvent({
      type: "code_run",
      lessonId,
      userId: session.user.id,
    })

    if (allPassed) {
      await recordEvent({
        type: "exercise_complete",
        lessonId,
        userId: session.user.id,
      })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

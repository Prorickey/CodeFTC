import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { recordEvent } from "@/lib/analytics"
import type { EventType } from "@/prisma/generated/prisma/client"

const ALLOWED_TYPES: EventType[] = ["lesson_view", "hint_view", "solution_view"]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, lessonId, hintIndex } = body as {
      type: EventType
      lessonId: string
      hintIndex?: number
    }

    if (!ALLOWED_TYPES.includes(type) || !lessonId) {
      return new NextResponse(null, { status: 204 })
    }

    const session = await auth()
    await recordEvent({
      type,
      lessonId,
      userId: session?.user?.id ?? null,
      hintIndex,
    })
  } catch {
    // silent
  }

  return new NextResponse(null, { status: 204 })
}

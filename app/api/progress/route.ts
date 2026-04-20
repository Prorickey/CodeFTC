import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { isMultiStageProgressState } from "@/lib/types"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ code: null }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const lessonId = searchParams.get("lessonId")
  if (!lessonId) {
    return NextResponse.json({ code: null }, { status: 400 })
  }

  const progress = await prisma.userProgress.findUnique({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
    select: { code: true },
  })

  return NextResponse.json({ code: progress?.code ?? null })
}

export async function PUT(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json()) as { lessonId?: unknown; code?: unknown }
  const { lessonId, code } = body
  if (typeof lessonId !== "string" || !lessonId || typeof code !== "string") {
    return NextResponse.json({ error: "Missing lessonId or code" }, { status: 400 })
  }

  // If the payload looks like JSON, validate it against the multi-stage schema.
  // Reject malformed JSON payloads that claim to be v2 but aren't well-formed.
  if (code.startsWith("{")) {
    try {
      const parsed = JSON.parse(code) as unknown
      if (
        parsed &&
        typeof parsed === "object" &&
        (parsed as { __v?: unknown }).__v !== undefined &&
        !isMultiStageProgressState(parsed)
      ) {
        return NextResponse.json(
          { error: "Invalid multi-stage progress payload" },
          { status: 400 }
        )
      }
    } catch {
      // Not JSON — treat as legacy plain-string code (no-op here)
    }
  }

  await prisma.userProgress.upsert({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
    create: { userId: session.user.id, lessonId, code },
    update: { code },
  })

  return NextResponse.json({ ok: true })
}

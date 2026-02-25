import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

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

  const { lessonId, code } = await request.json() as { lessonId: string; code: string }
  if (!lessonId || typeof code !== "string") {
    return NextResponse.json({ error: "Missing lessonId or code" }, { status: 400 })
  }

  await prisma.userProgress.upsert({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
    create: { userId: session.user.id, lessonId, code },
    update: { code },
  })

  return NextResponse.json({ ok: true })
}

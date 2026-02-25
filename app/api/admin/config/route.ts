import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getDailyRunLimit, setDailyRunLimit, DEFAULT_DAILY_RUN_LIMIT } from "@/lib/siteConfig"

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id) return null
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  return user?.role === "ADMIN" ? session : null
}

export async function GET() {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const dailyRunLimit = await getDailyRunLimit()
  return NextResponse.json({ dailyRunLimit, defaultDailyRunLimit: DEFAULT_DAILY_RUN_LIMIT })
}

export async function PUT(request: Request) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const body = await request.json() as { dailyRunLimit?: unknown }
  const limit = Number(body.dailyRunLimit)
  if (!Number.isInteger(limit) || limit < 1) {
    return NextResponse.json({ error: "dailyRunLimit must be a positive integer" }, { status: 400 })
  }
  await setDailyRunLimit(limit)
  return NextResponse.json({ dailyRunLimit: limit })
}

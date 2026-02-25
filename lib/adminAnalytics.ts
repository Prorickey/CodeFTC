import { prisma } from "@/lib/prisma"

export interface AnalyticsData {
  stats: {
    totalUsers: number
    dau: number
    totalCodeRuns: number
    completionRate: number
  }
  userGrowth: { date: string; count: number }[]
  dau30: { date: string; count: number }[]
  codeRuns30: { date: string; count: number }[]
  topLessonsByViews: { lessonId: string; count: number }[]
  exerciseCompletionRate: { lessonId: string; completors: number }[]
  authProviderBreakdown: { provider: string; count: number }[]
  recentUsers: {
    name: string | null
    email: string | null
    image: string | null
    provider: string | null
    createdAt: Date
  }[]
}

function fillDays(
  rows: { date: string; count: number }[],
  days: number
): { date: string; count: number }[] {
  const map = new Map(rows.map((r) => [r.date, r.count]))
  const result: { date: string; count: number }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setUTCDate(d.getUTCDate() - i)
    const key = d.toISOString().slice(0, 10)
    result.push({ date: key, count: map.get(key) ?? 0 })
  }
  return result
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const now = new Date()
  const ago30 = new Date(now)
  ago30.setDate(ago30.getDate() - 29)
  ago30.setHours(0, 0, 0, 0)

  const todayStart = new Date(now)
  todayStart.setHours(0, 0, 0, 0)

  const [
    totalUsers,
    dauResult,
    totalCodeRuns,
    totalComplete,
    userGrowthRaw,
    dau30Raw,
    codeRuns30Raw,
    topLessons,
    exerciseCompletions,
    authProviders,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.analyticsEvent.findMany({
      where: { type: "code_run", createdAt: { gte: todayStart } },
      distinct: ["userId"],
      select: { userId: true },
    }),

    prisma.analyticsEvent.count({ where: { type: "code_run" } }),

    prisma.analyticsEvent.groupBy({
      by: ["lessonId"],
      where: { type: "exercise_complete" },
      _count: { lessonId: true },
    }),

    prisma.$queryRaw<{ date: Date; count: bigint }[]>`
      SELECT DATE("createdAt") as date, COUNT(*) as count
      FROM "User"
      WHERE "createdAt" >= ${ago30}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `,

    prisma.$queryRaw<{ date: Date; count: bigint }[]>`
      SELECT DATE("createdAt") as date, COUNT(DISTINCT "userId") as count
      FROM "AnalyticsEvent"
      WHERE type = 'code_run' AND "createdAt" >= ${ago30} AND "userId" IS NOT NULL
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `,

    prisma.$queryRaw<{ date: Date; count: bigint }[]>`
      SELECT DATE("createdAt") as date, COUNT(*) as count
      FROM "AnalyticsEvent"
      WHERE type = 'code_run' AND "createdAt" >= ${ago30}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `,

    prisma.analyticsEvent.groupBy({
      by: ["lessonId"],
      where: { type: "lesson_view" },
      _count: { lessonId: true },
      orderBy: { _count: { lessonId: "desc" } },
      take: 10,
    }),

    prisma.analyticsEvent.groupBy({
      by: ["lessonId"],
      where: { type: "exercise_complete" },
      _count: { lessonId: true },
    }),

    prisma.account.groupBy({
      by: ["provider"],
      _count: { provider: true },
    }),

    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        name: true,
        email: true,
        image: true,
        createdAt: true,
        accounts: { select: { provider: true }, take: 1 },
      },
    }),
  ])

  const totalLessonsWithCompletes = totalComplete.length
  const completionRate =
    totalUsers > 0 && totalLessonsWithCompletes > 0
      ? Math.round((totalLessonsWithCompletes / totalUsers) * 100)
      : 0

  const toRows = (raw: { date: string | Date; count: string | bigint }[]) =>
    raw.map((r) => ({
      date: r.date instanceof Date ? r.date.toISOString().slice(0, 10) : String(r.date).slice(0, 10),
      count: Number(r.count),
    }))

  return {
    stats: {
      totalUsers,
      dau: dauResult.length,
      totalCodeRuns,
      completionRate,
    },
    userGrowth: fillDays(toRows(userGrowthRaw), 30),
    dau30: fillDays(toRows(dau30Raw), 30),
    codeRuns30: fillDays(toRows(codeRuns30Raw), 30),
    topLessonsByViews: topLessons.map((r) => ({
      lessonId: r.lessonId,
      count: r._count.lessonId,
    })),
    exerciseCompletionRate: exerciseCompletions.map((r) => ({
      lessonId: r.lessonId,
      completors: r._count.lessonId,
    })),
    authProviderBreakdown: authProviders.map((r) => ({
      provider: r.provider,
      count: r._count.provider,
    })),
    recentUsers: recentUsers.map((u) => ({
      name: u.name,
      email: u.email,
      image: u.image,
      provider: u.accounts[0]?.provider ?? null,
      createdAt: u.createdAt,
    })),
  }
}

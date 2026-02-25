import { prisma } from "@/lib/prisma"

export const DEFAULT_DAILY_RUN_LIMIT = 1000

export async function getDailyRunLimit(): Promise<number> {
  const row = await prisma.siteConfig.findUnique({ where: { key: "dailyRunLimit" } })
  if (!row) return DEFAULT_DAILY_RUN_LIMIT
  const parsed = parseInt(row.value, 10)
  return isNaN(parsed) ? DEFAULT_DAILY_RUN_LIMIT : parsed
}

export async function setDailyRunLimit(limit: number): Promise<void> {
  await prisma.siteConfig.upsert({
    where: { key: "dailyRunLimit" },
    update: { value: String(limit) },
    create: { key: "dailyRunLimit", value: String(limit) },
  })
}

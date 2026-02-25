import { prisma } from "@/lib/prisma"
import type { EventType } from "@/prisma/generated/prisma/client"

export async function recordEvent(opts: {
  type: EventType
  lessonId: string
  userId?: string | null
  hintIndex?: number
}): Promise<void> {
  try {
    await prisma.analyticsEvent.create({
      data: {
        type: opts.type,
        lessonId: opts.lessonId,
        userId: opts.userId ?? null,
        hintIndex: opts.hintIndex ?? null,
      },
    })
  } catch (err) {
    console.error("[analytics] Failed to record event:", err)
  }
}

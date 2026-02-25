import { prisma } from "@/lib/prisma"

export async function syncAdminEmails(): Promise<void> {
  const raw = process.env.ADMIN_EMAILS ?? ""
  const emails = raw
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean)

  if (emails.length === 0) return

  try {
    await prisma.user.updateMany({
      where: { email: { in: emails } },
      data: { role: "ADMIN" },
    })
  } catch (err) {
    console.error("[adminSetup] Failed to sync admin emails:", err)
  }
}

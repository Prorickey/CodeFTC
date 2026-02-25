export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { syncAdminEmails } from "@/lib/adminSetup"
import { getAnalyticsData } from "@/lib/adminAnalytics"
import { getDailyRunLimit } from "@/lib/siteConfig"
import { AdminDashboard } from "./AdminDashboard"
import { RefreshButton } from "./RefreshButton"

export default async function AdminPage() {
  await syncAdminEmails()

  const session = await auth()
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (user?.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <p className="text-4xl font-bold text-[#ededed]">403</p>
          <p className="mt-2 text-[#888]">Access Denied</p>
          <Link href="/lessons/introduction" className="mt-4 inline-block text-sm text-blue-400 hover:underline">
            ← Back to lessons
          </Link>
        </div>
      </div>
    )
  }

  const [data, dailyRunLimit] = await Promise.all([getAnalyticsData(), getDailyRunLimit()])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      <header className="flex items-center justify-between border-b border-[#2a2a2a] px-8 py-4">
        <h1 className="text-lg font-semibold">Admin Dashboard · Code FTC</h1>
        <div className="flex items-center gap-3">
          <RefreshButton />
          <Link href="/lessons/introduction" className="text-sm text-blue-400 hover:underline">
            ← Back to lessons
          </Link>
        </div>
      </header>
      <main className="px-8 py-6">
        <AdminDashboard data={data} dailyRunLimit={dailyRunLimit} />
      </main>
    </div>
  )
}

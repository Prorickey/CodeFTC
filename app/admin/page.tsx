import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { syncAdminEmails } from "@/lib/adminSetup"
import { getAnalyticsData } from "@/lib/adminAnalytics"
import { AdminDashboard } from "./AdminDashboard"

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

  const data = await getAnalyticsData()

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      <header className="flex items-center justify-between border-b border-[#2a2a2a] px-8 py-4">
        <h1 className="text-lg font-semibold">Admin Dashboard · Code FTC</h1>
        <Link href="/lessons/introduction" className="text-sm text-blue-400 hover:underline">
          ← Back to lessons
        </Link>
      </header>
      <main className="px-8 py-6">
        <AdminDashboard data={data} />
      </main>
    </div>
  )
}

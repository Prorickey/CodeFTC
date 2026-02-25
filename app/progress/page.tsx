import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { getModules } from "@/lib/lessons"
import { Sidebar } from "@/components/layout/Sidebar"
import { ProgressPage } from "./ProgressPage"

export const metadata = { title: "My Progress | Code FTC" }

export default async function ProgressRoute() {
  const [session, modules] = await Promise.all([auth(), getModules()])

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/progress")
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar modules={modules} moduleSlug="" lessonSlug="" />
      <main className="flex-1 overflow-y-auto">
        <ProgressPage modules={modules} />
      </main>
    </div>
  )
}

import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { getModuleSections } from "@/lib/lessons"
import { Sidebar } from "@/components/layout/Sidebar"
import { ProgressPage } from "./ProgressPage"

export const metadata = { title: "My Progress | Code FTC" }

export default async function ProgressRoute() {
  const [session, sections] = await Promise.all([auth(), getModuleSections()])

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/progress")
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sections={sections} moduleSlug="" lessonSlug="" />
      <main className="flex-1 overflow-y-auto">
        <ProgressPage sections={sections} />
      </main>
    </div>
  )
}

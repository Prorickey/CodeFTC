import { notFound, redirect } from "next/navigation"
import { getLessonData, getModules, getModuleSections } from "@/lib/lessons"
import { auth } from "@/auth"
import { LessonPage } from "./LessonPage"

interface Props {
  params: Promise<{
    moduleSlug: string
    lessonSlug: string
  }>
}

export default async function LessonRoute({ params }: Props) {
  const { moduleSlug, lessonSlug } = await params
  const [modules, sections, session] = await Promise.all([
    getModules(),
    getModuleSections(),
    auth(),
  ])
  const mod = modules.find((m) => m.meta.slug === moduleSlug)
  if (mod?.meta.type === "multistage") {
    redirect(`/lessons/${moduleSlug}`)
  }

  const data = await getLessonData(moduleSlug, lessonSlug)

  if (!data) {
    notFound()
  }

  return (
    <LessonPage
      data={data}
      sections={sections}
      moduleSlug={moduleSlug}
      lessonSlug={lessonSlug}
      userId={session?.user?.id ?? null}
    />
  )
}

export async function generateMetadata({ params }: Props) {
  const { moduleSlug, lessonSlug } = await params
  const modules = await getModules()
  const mod = modules.find((m) => m.meta.slug === moduleSlug)
  if (!mod || mod.meta.type === "multistage") {
    return { title: "Lesson Not Found" }
  }
  const data = await getLessonData(moduleSlug, lessonSlug).catch(() => null)
  if (!data) return { title: "Lesson Not Found" }
  return {
    title: `${data.lesson.title} | Code FTC`,
    description: data.lesson.description,
  }
}

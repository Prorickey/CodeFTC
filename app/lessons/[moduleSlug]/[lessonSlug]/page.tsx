import { notFound, redirect } from "next/navigation"
import { getLessonData, getModules } from "@/lib/lessons"
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
  const [modules, session] = await Promise.all([getModules(), auth()])
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
      modules={modules}
      moduleSlug={moduleSlug}
      lessonSlug={lessonSlug}
      userId={session?.user?.id ?? null}
    />
  )
}

export async function generateMetadata({ params }: Props) {
  const { moduleSlug, lessonSlug } = await params
  const data = await getLessonData(moduleSlug, lessonSlug)
  if (!data) return { title: "Lesson Not Found" }
  return {
    title: `${data.lesson.title} | Code FTC`,
    description: data.lesson.description,
  }
}

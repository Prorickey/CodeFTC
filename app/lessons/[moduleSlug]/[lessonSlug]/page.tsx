import { notFound } from "next/navigation"
import { getLessonData, getModules } from "@/lib/lessons"
import { LessonPage } from "./LessonPage"

interface Props {
  params: Promise<{
    moduleSlug: string
    lessonSlug: string
  }>
}

export default async function LessonRoute({ params }: Props) {
  const { moduleSlug, lessonSlug } = await params
  const data = await getLessonData(moduleSlug, lessonSlug)

  if (!data) {
    notFound()
  }

  const modules = await getModules()

  return (
    <LessonPage
      data={data}
      modules={modules}
      moduleSlug={moduleSlug}
      lessonSlug={lessonSlug}
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

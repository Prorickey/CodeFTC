import { notFound, redirect } from "next/navigation"
import { getMultiStageModuleData, getModules } from "@/lib/lessons"
import { auth } from "@/auth"
import { MultiStageModulePage } from "./MultiStageModulePage"

interface Props {
  params: Promise<{ moduleSlug: string }>
}

export default async function ModuleRoute({ params }: Props) {
  const { moduleSlug } = await params
  const modules = await getModules()
  const mod = modules.find((m) => m.meta.slug === moduleSlug)

  if (!mod) notFound()

  if (mod.meta.type === "lessons") {
    const first = mod.lessons[0]
    if (!first) notFound()
    redirect(`/lessons/${moduleSlug}/${first.slug}`)
  }

  const [data, session] = await Promise.all([
    getMultiStageModuleData(moduleSlug),
    auth(),
  ])

  if (!data) notFound()

  return (
    <MultiStageModulePage
      data={data}
      modules={modules}
      moduleSlug={moduleSlug}
      userId={session?.user?.id ?? null}
    />
  )
}

export async function generateMetadata({ params }: Props) {
  const { moduleSlug } = await params
  const data = await getMultiStageModuleData(moduleSlug).catch(() => null)
  if (!data) return { title: "Module Not Found" }
  return {
    title: `${data.module.title} | Code FTC`,
    description: data.module.description,
  }
}

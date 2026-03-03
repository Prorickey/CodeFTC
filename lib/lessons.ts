import { readdir, readFile } from "node:fs/promises"
import { join } from "node:path"
import { unstable_cache } from "next/cache"
import matter from "gray-matter"
import type {
  ModuleMeta,
  LessonMeta,
  Exercise,
  ExerciseFile,
  LessonData,
  SidebarModule,
} from "./types"

const CONTENT_DIR = join(process.cwd(), "content/lessons")

export const getModules = unstable_cache(
  async (): Promise<SidebarModule[]> => {
    const entries = await readdir(CONTENT_DIR, { withFileTypes: true })
    const moduleDirs = entries
      .filter((e) => e.isDirectory() && !e.name.startsWith("_"))
      .sort((a, b) => a.name.localeCompare(b.name))

    const modules: SidebarModule[] = []

    for (const dir of moduleDirs) {
      const modulePath = join(CONTENT_DIR, dir.name)
      const meta = await loadModuleMeta(modulePath, dir.name)
      const lessons = await loadLessonMetas(modulePath, dir.name)
      modules.push({ meta, lessons })
    }

    return modules
  },
  ["modules"],
  { revalidate: false }
)

async function loadModuleMeta(
  modulePath: string,
  dirName: string
): Promise<ModuleMeta> {
  try {
    const raw = await readFile(join(modulePath, "_module.json"), "utf-8")
    const data = JSON.parse(raw) as { title: string; order: number; description?: string }
    return {
      title: data.title,
      slug: dirName,
      order: data.order,
      description: data.description,
    }
  } catch {
    // Fallback: derive from directory name
    const order = parseInt(dirName.split("-")[0] ?? "0", 10)
    const title = dirName
      .replace(/^\d+-/, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
    return { title, slug: dirName, order }
  }
}

async function loadLessonMetas(
  modulePath: string,
  moduleSlug: string
): Promise<LessonMeta[]> {
  const entries = await readdir(modulePath, { withFileTypes: true })
  const lessonDirs = entries
    .filter((e) => e.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name))

  const lessons: LessonMeta[] = []

  for (const dir of lessonDirs) {
    const lessonPath = join(modulePath, dir.name)
    try {
      const mdxRaw = await readFile(join(lessonPath, "content.mdx"), "utf-8")
      const { data } = matter(mdxRaw)
      const order = parseInt(dir.name.split("-")[0] ?? "0", 10)
      let testCount = 0
      try {
        const exRaw = await readFile(join(lessonPath, "exercise.json"), "utf-8")
        testCount = (JSON.parse(exRaw) as { testCount?: number }).testCount ?? 0
      } catch { /* no exercise.json */ }
      lessons.push({
        title: (data.title as string) || dir.name.replace(/^\d+-/, "").replace(/-/g, " "),
        slug: dir.name,
        moduleSlug,
        order,
        testCount,
        description: data.description as string | undefined,
      })
    } catch {
      // Skip directories without content.mdx
    }
  }

  return lessons
}

export async function getLessonData(
  moduleSlug: string,
  lessonSlug: string
): Promise<LessonData | null> {
  const modules = await getModules()

  // Find the current module and lesson
  const currentModule = modules.find((m) => m.meta.slug === moduleSlug)
  if (!currentModule) return null

  const currentLesson = currentModule.lessons.find(
    (l) => l.slug === lessonSlug
  )
  if (!currentLesson) return null

  // Load content
  const lessonPath = join(CONTENT_DIR, moduleSlug, lessonSlug)
  const mdxRaw = await readFile(join(lessonPath, "content.mdx"), "utf-8")
  const { content } = matter(mdxRaw)

  // Load exercise
  const exerciseRaw = await readFile(join(lessonPath, "exercise.json"), "utf-8")
  const exerciseFile = JSON.parse(exerciseRaw) as ExerciseFile
  const [starterCode, solutionCode, testCode] = await Promise.all([
    readFile(join(lessonPath, "Starter.java"), "utf-8"),
    readFile(join(lessonPath, "Solution.java"), "utf-8"),
    readFile(join(lessonPath, "Test.java"), "utf-8"),
  ])
  const exercise: Exercise = { ...exerciseFile, starterCode, solutionCode }

  // Build flat list of all lessons for prev/next
  const allLessons: { moduleSlug: string; lessonSlug: string }[] = []
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      allLessons.push({ moduleSlug: mod.meta.slug, lessonSlug: lesson.slug })
    }
  }

  const currentIndex = allLessons.findIndex(
    (l) => l.moduleSlug === moduleSlug && l.lessonSlug === lessonSlug
  )

  return {
    module: currentModule.meta,
    lesson: currentLesson,
    content,
    exercise,
    testCode,
    prev: currentIndex > 0 ? allLessons[currentIndex - 1]! : null,
    next:
      currentIndex < allLessons.length - 1
        ? allLessons[currentIndex + 1]!
        : null,
  }
}

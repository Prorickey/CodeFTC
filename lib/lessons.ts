import { readdir, readFile, stat } from "node:fs/promises"
import { join } from "node:path"
import { unstable_cache } from "next/cache"
import matter from "gray-matter"
import type {
  ModuleMeta,
  ModuleType,
  LessonMeta,
  StageMeta,
  Exercise,
  ExerciseFile,
  Hint,
  LessonData,
  MultiStageModuleData,
  SidebarModule,
  Stage,
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
      if (meta.type === "multistage") {
        const stages = await loadStageMetas(modulePath, dir.name)
        if (stages.length === 0) {
          throw new Error(
            `Module "${dir.name}" has type "multistage" but contains no stage folders.`
          )
        }
        modules.push({ meta, lessons: [], stages })
      } else {
        const lessons = await loadLessonMetas(modulePath, dir.name)
        await validateNoStageFolders(modulePath, dir.name)
        modules.push({ meta, lessons, stages: [] })
      }
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
    const data = JSON.parse(raw) as {
      title: string
      order: number
      description?: string
      type?: ModuleType
    }
    const type: ModuleType = data.type === "multistage" ? "multistage" : "lessons"
    return {
      title: data.title,
      slug: dirName,
      order: data.order,
      description: data.description,
      type,
    }
  } catch {
    // Fallback: derive from directory name
    const order = parseInt(dirName.split("-")[0] ?? "0", 10)
    const title = dirName
      .replace(/^\d+-/, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
    return { title, slug: dirName, order, type: "lessons" }
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

async function loadStageMetas(
  modulePath: string,
  moduleSlug: string
): Promise<StageMeta[]> {
  const entries = await readdir(modulePath, { withFileTypes: true })
  const stageDirs = entries
    .filter((e) => e.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name))

  const stages: StageMeta[] = []

  for (const dir of stageDirs) {
    const stagePath = join(modulePath, dir.name)
    let stageMeta: { title?: string; testCount?: number; description?: string } = {}
    try {
      const raw = await readFile(join(stagePath, "stage.json"), "utf-8")
      stageMeta = JSON.parse(raw) as typeof stageMeta
    } catch {
      // No stage.json — skip directory (not a stage)
      continue
    }
    const order = parseInt(dir.name.split("-")[0] ?? "0", 10)
    stages.push({
      slug: dir.name,
      moduleSlug,
      order,
      title:
        stageMeta.title ??
        dir.name.replace(/^\d+-/, "").replace(/-/g, " "),
      testCount: stageMeta.testCount ?? 0,
      description: stageMeta.description,
    })
  }

  return stages
}

async function validateNoStageFolders(modulePath: string, moduleSlug: string) {
  const entries = await readdir(modulePath, { withFileTypes: true })
  for (const e of entries) {
    if (!e.isDirectory()) continue
    if (await fileExists(join(modulePath, e.name, "stage.json"))) {
      throw new Error(
        `Module "${moduleSlug}" has type "lessons" but contains stage-shaped folder "${e.name}" (stage.json present). Set "type": "multistage" in _module.json.`
      )
    }
  }
}

export async function getLessonData(
  moduleSlug: string,
  lessonSlug: string
): Promise<LessonData | null> {
  const modules = await getModules()

  // Find the current module and lesson
  const currentModule = modules.find((m) => m.meta.slug === moduleSlug)
  if (!currentModule) return null
  if (currentModule.meta.type !== "lessons") return null

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

  // Build flat list of all lessons for prev/next (only across lesson-type modules)
  const allLessons: { moduleSlug: string; lessonSlug: string }[] = []
  for (const mod of modules) {
    if (mod.meta.type !== "lessons") continue
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

async function fileExists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

async function readIfExists(path: string): Promise<string | undefined> {
  try {
    return await readFile(path, "utf-8")
  } catch {
    return undefined
  }
}

export async function getMultiStageModuleData(
  moduleSlug: string
): Promise<MultiStageModuleData | null> {
  const modules = await getModules()
  const currentModule = modules.find((m) => m.meta.slug === moduleSlug)
  if (!currentModule) return null
  if (currentModule.meta.type !== "multistage") return null

  const modulePath = join(CONTENT_DIR, moduleSlug)

  const [starterCode, solutionCode] = await Promise.all([
    readFile(join(modulePath, "Starter.java"), "utf-8"),
    readFile(join(modulePath, "Solution.java"), "utf-8"),
  ])

  const introRaw = await readIfExists(join(modulePath, "intro.mdx"))
  const intro = introRaw ? matter(introRaw).content : undefined

  const stageEntries = await readdir(modulePath, { withFileTypes: true })
  const stageDirs = stageEntries
    .filter((e) => e.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name))

  const stages: Stage[] = []
  for (const dir of stageDirs) {
    const stagePath = join(modulePath, dir.name)
    if (!(await fileExists(join(stagePath, "stage.json")))) continue

    const [stageMetaRaw, mdxRaw, testCode] = await Promise.all([
      readFile(join(stagePath, "stage.json"), "utf-8"),
      readFile(join(stagePath, "content.mdx"), "utf-8").catch(() => {
        throw new Error(
          `Stage "${dir.name}" in module "${moduleSlug}" is missing content.mdx.`
        )
      }),
      readFile(join(stagePath, "Test.java"), "utf-8").catch(() => {
        throw new Error(
          `Stage "${dir.name}" in module "${moduleSlug}" is missing Test.java.`
        )
      }),
    ])

    const stageMeta = JSON.parse(stageMetaRaw) as {
      title?: string
      testCount?: number
      description?: string
      hints?: Hint[]
    }
    const { content } = matter(mdxRaw)

    const [perStageSolution, perStageStarter] = await Promise.all([
      readIfExists(join(stagePath, "Solution.java")),
      readIfExists(join(stagePath, "Starter.java")),
    ])

    stages.push({
      slug: dir.name,
      title:
        stageMeta.title ??
        dir.name.replace(/^\d+-/, "").replace(/-/g, " "),
      description: stageMeta.description,
      content,
      testCode,
      testCount: stageMeta.testCount ?? 0,
      hints: stageMeta.hints ?? [],
      solutionCode: perStageSolution,
      starterCode: perStageStarter,
    })
  }

  if (stages.length === 0) {
    throw new Error(
      `Multi-stage module "${moduleSlug}" has no stages.`
    )
  }

  // Resolve prev/next module by order
  const ordered = [...modules].sort((a, b) => a.meta.order - b.meta.order)
  const idx = ordered.findIndex((m) => m.meta.slug === moduleSlug)
  const prevModule = idx > 0 ? { slug: ordered[idx - 1]!.meta.slug } : null
  const nextModule =
    idx >= 0 && idx < ordered.length - 1
      ? { slug: ordered[idx + 1]!.meta.slug }
      : null

  return {
    module: currentModule.meta,
    intro,
    starterCode,
    solutionCode,
    stages,
    prevModule,
    nextModule,
  }
}

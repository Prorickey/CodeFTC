export type ModuleType = "lessons" | "multistage"

export interface ModuleMeta {
  title: string
  slug: string
  order: number
  description?: string
  type: ModuleType
}

export interface LessonMeta {
  title: string
  slug: string
  moduleSlug: string
  order: number
  testCount: number
  description?: string
}

export interface StageMeta {
  slug: string
  moduleSlug: string
  title: string
  order: number
  testCount: number
  description?: string
}

export interface Hint {
  title: string
  content: string
}

export interface Exercise {
  title: string
  testCount: number
  starterCode: string
  solutionCode: string
  hints: Hint[]
}

export interface ExerciseFile {
  title: string
  testCount: number
  hints: Hint[]
}

export interface Stage {
  slug: string
  title: string
  description?: string
  content: string
  testCode: string
  testCount: number
  hints: Hint[]
  solutionCode?: string
  starterCode?: string
}

export interface TestResult {
  name: string
  passed: boolean
  message: string
}

export interface ExecutionResult {
  success: boolean
  compilationError?: string
  runtimeError?: string
  testResults: TestResult[]
  output?: string
  timeout?: boolean
}

export interface LessonData {
  module: ModuleMeta
  lesson: LessonMeta
  content: string
  exercise: Exercise
  testCode: string
  prev: { moduleSlug: string; lessonSlug: string } | null
  next: { moduleSlug: string; lessonSlug: string } | null
}

export interface MultiStageModuleData {
  module: ModuleMeta
  intro?: string
  starterCode: string
  solutionCode: string
  stages: Stage[]
  prevModule: { slug: string } | null
  nextModule: { slug: string } | null
}

export interface SidebarModule {
  meta: ModuleMeta
  lessons: LessonMeta[]
  stages: StageMeta[]
}

export interface MultiStageProgressState {
  __v: 2
  currentStage: number
  perStageCode: Record<string, string>
  completedStages: number[]
}

export function isMultiStageProgressState(
  value: unknown
): value is MultiStageProgressState {
  if (!value || typeof value !== "object") return false
  const v = value as Record<string, unknown>
  if (v.__v !== 2) return false
  if (typeof v.currentStage !== "number" || !Number.isInteger(v.currentStage) || v.currentStage < 0) {
    return false
  }
  if (!Array.isArray(v.completedStages)) return false
  for (const s of v.completedStages) {
    if (typeof s !== "number" || !Number.isInteger(s) || s < 0) return false
  }
  if (!v.perStageCode || typeof v.perStageCode !== "object") return false
  for (const [k, val] of Object.entries(v.perStageCode as Record<string, unknown>)) {
    if (!/^\d+$/.test(k)) return false
    if (typeof val !== "string") return false
  }
  return true
}

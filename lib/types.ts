export interface ModuleMeta {
  title: string
  slug: string
  order: number
  description?: string
}

export interface LessonMeta {
  title: string
  slug: string
  moduleSlug: string
  order: number
  testCount: number
  description?: string
}

export interface Exercise {
  title: string
  testCount: number
  starterCode: string
  solutionCode: string
  hints: { title: string; content: string }[]
}

export interface ExerciseFile {
  title: string
  testCount: number
  hints: { title: string; content: string }[]
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
  prev: { moduleSlug: string; lessonSlug: string } | null
  next: { moduleSlug: string; lessonSlug: string } | null
}

export interface SidebarModule {
  meta: ModuleMeta
  lessons: LessonMeta[]
}

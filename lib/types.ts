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
  description?: string
}

export interface HardwareConfig {
  motors?: Record<string, { type: string }>
  servos?: Record<string, { type: string }>
  sensors?: Record<string, { type: string }>
  gamepad?: {
    left_stick_y?: number
    right_stick_y?: number
    left_stick_x?: number
    right_stick_x?: number
    a?: boolean
    b?: boolean
    x?: boolean
    y?: boolean
    dpad_up?: boolean
    dpad_down?: boolean
    dpad_left?: boolean
    dpad_right?: boolean
    left_bumper?: boolean
    right_bumper?: boolean
    left_trigger?: number
    right_trigger?: number
  }
}

export interface TestDefinition {
  type: string
  name: string
  device?: string
  method?: string
  expected?: number | string | boolean
  tolerance?: number
  assertion?: string
  property?: string
  field?: string
  contains?: string
}

export interface Exercise {
  title: string
  className: string
  starterCode: string
  solutionCode: string
  hardwareConfig: HardwareConfig
  tests: TestDefinition[]
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

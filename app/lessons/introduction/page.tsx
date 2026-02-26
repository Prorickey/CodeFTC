import { getModules } from "@/lib/lessons"
import { Sidebar } from "@/components/layout/Sidebar"
import { BookOpen, Code, Cpu, Zap } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Introduction | Code FTC",
  description: "Learn FTC robot programming with interactive Java exercises.",
}

export default async function IntroductionPage() {
  const modules = await getModules()

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar modules={modules} moduleSlug="" lessonSlug="" />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
          {/* Hero section */}
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            Welcome to <span className="text-[var(--color-accent)]">Code FTC</span>
          </h1>
          <p className="mb-10 text-lg text-[var(--color-text-muted)]">
            Interactive lessons that teach you FTC robot programming in Java —
            from your first OpMode to advanced control theory. Write code, run it,
            and see results instantly.
          </p>

          {/* Feature grid */}
          <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FeatureCard
              icon={<BookOpen className="h-5 w-5" />}
              title="Interactive Lessons"
              description="Read explanations on the left, write code on the right. Learn by doing."
            />
            <FeatureCard
              icon={<Code className="h-5 w-5" />}
              title="Real Java Code"
              description="Write actual FTC SDK code that compiles and runs against the real API."
            />
            <FeatureCard
              icon={<Cpu className="h-5 w-5" />}
              title="Instant Feedback"
              description="Automated tests verify your code and tell you exactly what to fix."
            />
            <FeatureCard
              icon={<Zap className="h-5 w-5" />}
              title="Control Theory"
              description="Go beyond basics — learn PID, feedforward, and motion profiling."
            />
          </div>

          {/* How it works section */}
          <h2 className="mb-4 text-2xl font-bold">How It Works</h2>
          <div className="mb-10 space-y-3 text-[var(--color-text-muted)]">
            <p>Each lesson has two panels side by side:</p>
            <ul className="list-inside list-disc space-y-2 pl-2">
              <li><strong className="text-[var(--color-text)]">Left panel</strong> — Lesson content explaining the concept with examples</li>
              <li><strong className="text-[var(--color-text)]">Right panel</strong> — A code editor with starter code and a Run button</li>
            </ul>
            <p>
              Write your solution in the editor, click <strong className="text-[var(--color-success)]">Run</strong>, and your
              Java code is compiled and tested on a real JDK. You&apos;ll see green checkmarks for passing
              tests and helpful error messages when something needs fixing.
            </p>
          </div>

          {/* Curriculum overview */}
          <h2 className="mb-4 text-2xl font-bold">Curriculum</h2>
          <div className="mb-10 space-y-3">
            {modules.map((mod) => (
              <div key={mod.meta.slug} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <h3 className="mb-1 font-semibold">{mod.meta.title}</h3>
                {mod.meta.description && (
                  <p className="mb-2 text-sm text-[var(--color-text-muted)]">{mod.meta.description}</p>
                )}
                <ul className="space-y-1">
                  {mod.lessons.map((lesson) => (
                    <li key={lesson.slug}>
                      <Link
                        href={`/lessons/${lesson.moduleSlug}/${lesson.slug}`}
                        className="text-sm text-[var(--color-accent)] hover:underline"
                      >
                        {lesson.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/lessons/01-getting-started/01-hello-opmode"
              className="inline-block rounded-lg bg-[var(--color-accent)] px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)]"
            >
              Start Your First Lesson
            </Link>
          </div>

          {/* Footer note */}
          <p className="mt-12 text-center text-sm text-[var(--color-text-muted)]">
            Built for the FTC community.
          </p>
        </div>
      </main>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-left">
      <div className="mb-2 text-[var(--color-accent)]">{icon}</div>
      <h3 className="mb-1 font-semibold text-sm">{title}</h3>
      <p className="text-sm text-[var(--color-text-muted)]">{description}</p>
    </div>
  )
}

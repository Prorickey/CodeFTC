import { CheerpJProvider } from "@/lib/cheerpj-context"

export default function LessonsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CheerpJProvider>{children}</CheerpJProvider>
}

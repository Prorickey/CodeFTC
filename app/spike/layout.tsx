import { CheerpJProvider } from "@/lib/cheerpj-context"

export default function SpikeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CheerpJProvider>{children}</CheerpJProvider>
}

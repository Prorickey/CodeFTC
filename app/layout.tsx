import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Code FTC",
  description:
    "Learn FTC robot programming with interactive Java exercises — from basics to advanced control theory.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}

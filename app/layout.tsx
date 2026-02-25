import type { Metadata } from "next"
import "./globals.css"
import { auth } from "@/auth"
import { AuthSessionProvider } from "@/components/providers/SessionProvider"

export const metadata: Metadata = {
  title: "Code FTC",
  description:
    "Learn FTC robot programming with interactive Java exercises — from basics to advanced control theory.",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">
        <AuthSessionProvider session={session}>{children}</AuthSessionProvider>
      </body>
    </html>
  )
}

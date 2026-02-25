import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth(function middleware(_req) {
  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
}

import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"

const CONTENT_ROOT = path.join(process.cwd(), "content", "lessons")
const ALLOWED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"])

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const segments = (await params).path

  // Prevent directory traversal
  const joined = segments.join("/")
  if (joined.includes("..")) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  const ext = path.extname(segments[segments.length - 1]).toLowerCase()
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return new NextResponse("Not Found", { status: 404 })
  }

  const filePath = path.join(CONTENT_ROOT, ...segments)

  try {
    const data = await readFile(filePath)
    const contentType = ext === ".svg" ? "image/svg+xml" : `image/${ext.slice(1)}`
    return new NextResponse(data, {
      headers: { "Content-Type": contentType, "Cache-Control": "public, max-age=31536000" },
    })
  } catch {
    return new NextResponse("Not Found", { status: 404 })
  }
}

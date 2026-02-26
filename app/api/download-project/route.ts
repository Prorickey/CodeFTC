import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"
import JSZip from "jszip"

const TEMPLATE_PATH = join(process.cwd(), "ftc-template", "FtcRobotController.zip")
const TEAMCODE_PATH =
  "FtcRobotController-master/TeamCode/src/main/java/org/firstinspires/ftc/teamcode/"

function extractClassName(code: string): string {
  const match = code.match(/public\s+class\s+(\w+)/)
  return match ? match[1] : "MyOpMode"
}

export async function POST(req: NextRequest) {
  const { code } = (await req.json()) as { code: string }

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 })
  }

  let templateBuffer: Buffer
  try {
    templateBuffer = await readFile(TEMPLATE_PATH)
  } catch {
    return NextResponse.json(
      { error: "FTC template not found. Run: bun run setup:ftc-template" },
      { status: 500 }
    )
  }

  const zip = await JSZip.loadAsync(templateBuffer)

  const className = extractClassName(code)
  zip.file(`${TEAMCODE_PATH}${className}.java`, code)

  const output = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  })

  return new NextResponse(output as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${className}-FtcRobotController.zip"`,
    },
  })
}

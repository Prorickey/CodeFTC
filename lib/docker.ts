import Docker from "dockerode"
import { existsSync } from "node:fs"
import { join } from "node:path"
import { homedir } from "node:os"

function getDockerSocket(): string {
  // Docker Desktop on Linux uses a user-specific socket
  const desktopSocket = join(homedir(), ".docker/desktop/docker.sock")
  if (existsSync(desktopSocket)) {
    return desktopSocket
  }
  // Fall back to default
  return "/var/run/docker.sock"
}

const docker = new Docker({ socketPath: getDockerSocket() })

const SANDBOX_IMAGE = "ftc-java-sandbox"
const MEMORY_LIMIT = 256 * 1024 * 1024 // 256MB
const CPU_QUOTA = 50000 // 50% of one CPU
const CPU_PERIOD = 100000
const PIDS_LIMIT = 32
const TIMEOUT_MS = 15000

export async function runInSandbox(workDir: string): Promise<string> {
  const container = await docker.createContainer({
    Image: SANDBOX_IMAGE,
    HostConfig: {
      Binds: [`${workDir}:/app/work`],
      NetworkMode: "none",
      Memory: MEMORY_LIMIT,
      CpuQuota: CPU_QUOTA,
      CpuPeriod: CPU_PERIOD,
      PidsLimit: PIDS_LIMIT,
      ReadonlyRootfs: false,
      AutoRemove: false,
    },
    User: "sandbox",
  })

  try {
    await container.start()

    const result = await Promise.race([
      waitForContainer(container),
      timeout(TIMEOUT_MS),
    ])

    if (result === "TIMEOUT") {
      try { await container.kill() } catch { /* already stopped */ }
      try { await container.remove({ force: true }) } catch { /* ignore */ }
      return JSON.stringify({
        success: false,
        runtimeError: "Execution timed out (15 second limit)",
        timeout: true,
        testResults: [],
      })
    }

    return result as string
  } catch (err) {
    try { await container.kill() } catch { /* already stopped */ }
    try { await container.remove({ force: true }) } catch { /* ignore */ }
    throw err
  }
}

async function waitForContainer(container: Docker.Container): Promise<string> {
  await container.wait()

  const logs = await container.logs({
    stdout: true,
    stderr: true,
    follow: false,
  })

  // Remove container now that we have the logs
  try { await container.remove() } catch { /* ignore */ }

  return stripDockerHeaders(logs.toString())
}

function timeout(ms: number): Promise<"TIMEOUT"> {
  return new Promise((resolve) => setTimeout(() => resolve("TIMEOUT"), ms))
}

// Docker logs may have 8-byte header frames; strip them
function stripDockerHeaders(output: string): string {
  // If the output looks like it starts with JSON, return as-is
  const trimmed = output.trim()
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return trimmed
  }

  // Try to extract JSON from potentially garbled Docker log output
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    return jsonMatch[0]
  }

  return trimmed
}

export async function isDockerAvailable(): Promise<boolean> {
  try {
    await docker.ping()
    return true
  } catch {
    return false
  }
}

export async function isSandboxImageBuilt(): Promise<boolean> {
  try {
    await docker.getImage(SANDBOX_IMAGE).inspect()
    return true
  } catch {
    return false
  }
}

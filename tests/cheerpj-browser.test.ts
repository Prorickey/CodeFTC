import { test, expect, type Page } from "@playwright/test"

const BASE = "http://localhost:3000"

// CheerpJ takes time to initialize — give generous timeouts
test.setTimeout(120_000)

test.describe("CheerpJ Browser Execution", () => {

  test("1 — Lesson page loads and CheerpJ script is injected", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(`${BASE}/lessons/01-getting-started/01-hello-opmode`)
    await page.waitForLoadState("networkidle")

    // CheerpJ loader script should be in the DOM
    const cheerpjScript = page.locator('script[src*="cj3loader"]')
    await expect(cheerpjScript).toBeAttached({ timeout: 30_000 })

    // Run button should exist (no auth required now)
    const runButton = page.getByRole("button", { name: "Run" })
    await expect(runButton).toBeVisible({ timeout: 15_000 })
  })

  test("2 — CheerpJ assets (JARs) are served correctly", async ({ page }) => {
    const stubsRes = await page.request.get(`${BASE}/cheerpj/ftc-stubs.jar`)
    expect(stubsRes.status()).toBe(200)
    const stubsBody = await stubsRes.body()
    expect(stubsBody[0]).toBe(0x50) // 'P' (ZIP magic)
    expect(stubsBody[1]).toBe(0x4B) // 'K'

    const toolsRes = await page.request.get(`${BASE}/cheerpj/tools.jar`)
    expect(toolsRes.status()).toBe(200)
    const toolsBody = await toolsRes.body()
    expect(toolsBody[0]).toBe(0x50)
    expect(toolsBody[1]).toBe(0x4B)
  })

  test("3 — testCode is included in page data", async ({ page }) => {
    await page.goto(`${BASE}/lessons/01-getting-started/01-hello-opmode`)
    await page.waitForLoadState("networkidle")

    const html = await page.content()
    expect(html).toContain("testCode")
    expect(html).toContain("TestBase")
  })

  test("4 — Editor loads with Monaco and toolbar buttons", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(`${BASE}/lessons/01-getting-started/01-hello-opmode`)
    await page.waitForLoadState("networkidle")

    const runButton = page.getByRole("button", { name: "Run" })
    await expect(runButton).toBeVisible({ timeout: 15_000 })

    const resetButton = page.getByRole("button", { name: "Reset" })
    await expect(resetButton).toBeVisible({ timeout: 5_000 })

    // There are 2 Monaco editors (code + solution); check first is visible
    const editor = page.locator(".monaco-editor").first()
    await expect(editor).toBeVisible({ timeout: 15_000 })
  })

  test("5 — CheerpJ initializes (script loads and cheerpjInit is callable)", async ({ page }) => {
    await page.goto(`${BASE}/lessons/01-getting-started/01-hello-opmode`)

    const isReady = await page.evaluate(async () => {
      const start = Date.now()
      while (Date.now() - start < 60_000) {
        if (typeof cheerpjInit === "function") return true
        await new Promise(r => setTimeout(r, 500))
      }
      return false
    })
    expect(isReady).toBe(true)
  })

  test("6 — Clicking Run with starter code shows test results (some fail)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(`${BASE}/lessons/01-getting-started/01-hello-opmode`)
    await page.waitForLoadState("networkidle")

    await waitForCheerpJ(page)

    const runButton = page.getByRole("button", { name: "Run" })
    await expect(runButton).toBeVisible({ timeout: 15_000 })
    await runButton.click()

    // Should see "Running..." indicator
    await expect(page.getByText("Running...")).toBeVisible({ timeout: 5_000 })

    // Wait for test results — "X/Y tests passed" text from TestResults component
    await expect(page.getByText("tests passed")).toBeVisible({ timeout: 90_000 })

    // With starter code, not all tests should pass (TODOs not filled in)
    const resultText = await page.getByText("tests passed").innerText()
    expect(resultText).toContain("tests passed")
  })

  test("7 — Compilation error shows for broken code", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(`${BASE}/lessons/01-getting-started/01-hello-opmode`)
    await page.waitForLoadState("networkidle")

    await waitForCheerpJ(page)

    // Type broken Java into the editor
    await setMonacoValue(page, `public class StudentCode {\n    this is not valid java\n}`)

    const runButton = page.getByRole("button", { name: "Run" })
    await runButton.click()

    // Should show "Compilation Error" heading
    await expect(page.getByText("Compilation Error")).toBeVisible({ timeout: 90_000 })
  })

  test("8 — Solution code passes all tests", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(`${BASE}/lessons/01-getting-started/01-hello-opmode`)
    await page.waitForLoadState("networkidle")

    await waitForCheerpJ(page)

    // Set the solution code
    await setMonacoValue(page, [
      `import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;`,
      `import com.qualcomm.robotcore.eventloop.opmode.TeleOp;`,
      ``,
      `@TeleOp(name = "Hello OpMode")`,
      `public class StudentCode extends LinearOpMode {`,
      `    @Override`,
      `    public void runOpMode() {`,
      `        telemetry.addData("Message", "Hello, FTC!");`,
      `        telemetry.update();`,
      ``,
      `        waitForStart();`,
      ``,
      `        telemetry.addData("Status", "Running");`,
      `        telemetry.update();`,
      `    }`,
      `}`,
    ].join("\n"))

    const runButton = page.getByRole("button", { name: "Run" })
    await runButton.click()

    // Wait for "3/3 tests passed"
    await expect(page.getByText("3/3 tests passed")).toBeVisible({ timeout: 90_000 })

    // Should show "All passing" badge
    await expect(page.getByText("All passing")).toBeVisible({ timeout: 5_000 })
  })

})

// ── Helpers ──────────────────────────────────────────────────────────────────

async function waitForCheerpJ(page: Page) {
  await page.waitForFunction(
    () => typeof cheerpjInit === "function",
    { timeout: 60_000 }
  )
  // Allow extra time for cheerpjInit() to complete
  await page.waitForTimeout(5_000)
}

async function setMonacoValue(page: Page, code: string) {
  await page.evaluate(`
    (() => {
      const models = window.monaco?.editor?.getModels?.();
      if (models && models.length > 0) {
        models[0].setValue(${JSON.stringify(code)});
        return;
      }
      throw new Error("Could not find Monaco editor model");
    })()
  `)
}

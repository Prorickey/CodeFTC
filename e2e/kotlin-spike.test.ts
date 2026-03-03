import { test, expect } from "@playwright/test"

const BASE = "http://localhost:3000"

test.setTimeout(120_000)

test.describe("Kotlin CheerpJ Spike", () => {

  test("Kotlin spike - compile and run with fresh browser context", async ({ page }) => {
    // Collect console output for debugging
    const consoleLogs: string[] = []
    page.on("console", (msg) => consoleLogs.push(`[${msg.type()}] ${msg.text()}`))
    page.on("pageerror", (err) => consoleLogs.push(`[PAGE ERROR] ${err.message}`))

    // Navigate directly to the spike page (no prior Java lesson to pollute /files/)
    await page.goto(`${BASE}/spike/kotlin`)
    await page.waitForLoadState("networkidle")

    // Take screenshot to see initial state
    await page.screenshot({ path: "test-results/spike-initial.png" })

    // Wait for CheerpJ to be ready
    await page.waitForFunction(
      () => document.body.innerText.includes("CheerpJ: ready"),
      { timeout: 60_000 }
    )

    await page.screenshot({ path: "test-results/spike-cheerpj-ready.png" })

    // Click Run Spike
    const runButton = page.getByRole("button", { name: "Run Spike" })
    await expect(runButton).toBeEnabled({ timeout: 10_000 })
    await runButton.click()

    // Wait for either SUMMARY or an error/completion signal
    // Check every 2 seconds for progress
    for (let i = 0; i < 45; i++) {
      await page.waitForTimeout(2000)
      const text = await page.locator(".font-mono").innerText()
      if (text.includes("--- SUMMARY ---") || text.includes("FAILED")) {
        break
      }
      // Log progress every 10 seconds
      if (i % 5 === 4) {
        console.log(`[${(i + 1) * 2}s] Still waiting... Current output:`)
        console.log(text.split("\n").slice(-3).join("\n"))
      }
    }

    // Get final output
    const pageText = await page.locator(".font-mono").innerText()
    console.log("=== SPIKE OUTPUT ===")
    console.log(pageText)
    console.log("=== END SPIKE OUTPUT ===")

    // Dump console logs
    console.log("=== BROWSER CONSOLE (last 50 lines) ===")
    consoleLogs.slice(-50).forEach((l) => console.log(l))
    console.log("=== END CONSOLE ===")

    await page.screenshot({ path: "test-results/spike-final.png" })

    // Assertions
    expect(pageText).toContain("Kotlin compilation succeeded!")
    expect(pageText).toContain("Test.java compilation succeeded!")
    expect(pageText).toContain("Test execution completed successfully!")
    expect(pageText).toContain('"success":true')
  })

})

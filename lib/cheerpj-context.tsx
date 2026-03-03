"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

type CheerpJStatus = "loading" | "ready" | "error"
type KotlinStatus = "idle" | "loading" | "ready" | "error"

interface CheerpJContextValue {
  status: CheerpJStatus
  kotlinStatus: KotlinStatus
  loadKotlin: () => void
}

const CheerpJContext = createContext<CheerpJContextValue | null>(null)

const CHEERPJ_CDN = "https://cjrtnc.leaningtech.com/3.0/cj3loader.js"

// Module-level promise so concurrent mounts share a single init and remounts
// (React Strict Mode double-invoke) don't call cheerpjInit() twice.
let initPromise: Promise<void> | null = null

function getInitPromise(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      await new Promise<void>((resolve, reject) => {
        if (typeof cheerpjInit === "function") {
          resolve()
          return
        }
        const script = document.createElement("script")
        script.src = CHEERPJ_CDN
        script.onload = () => resolve()
        script.onerror = () => reject(new Error("Failed to load CheerpJ"))
        document.head.appendChild(script)
      })
      // In CheerpJ 3.0, System.out goes to console.log by default — no display needed
      await cheerpjInit({ status: "none" })
    })()
  }
  return initPromise
}

// Preload Kotlin compiler JAR by fetching it into browser cache.
// CheerpJ lazy-loads JARs on first classpath reference, but pre-fetching
// avoids stalling the compile step on first Kotlin use.
let kotlinLoadPromise: Promise<void> | null = null

function getKotlinLoadPromise(): Promise<void> {
  if (!kotlinLoadPromise) {
    kotlinLoadPromise = (async () => {
      const urls = [
        "/cheerpj/kotlin-compiler-embeddable.jar",
        "/cheerpj/kotlin-stdlib.jar",
      ]
      await Promise.all(urls.map((url) => fetch(url)))
    })()
  }
  return kotlinLoadPromise
}

export function CheerpJProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<CheerpJStatus>("loading")
  const [kotlinStatus, setKotlinStatus] = useState<KotlinStatus>("idle")

  useEffect(() => {
    getInitPromise()
      .then(() => setStatus("ready"))
      .catch((err) => {
        console.error("[CheerpJ] Init failed:", err)
        setStatus("error")
      })
  }, [])

  const loadKotlin = useCallback(() => {
    if (kotlinStatus !== "idle") return
    setKotlinStatus("loading")
    getKotlinLoadPromise()
      .then(() => setKotlinStatus("ready"))
      .catch((err) => {
        console.error("[CheerpJ] Kotlin load failed:", err)
        setKotlinStatus("error")
      })
  }, [kotlinStatus])

  return (
    <CheerpJContext.Provider value={{ status, kotlinStatus, loadKotlin }}>
      {children}
    </CheerpJContext.Provider>
  )
}

export function useCheerpJ(): CheerpJContextValue {
  const ctx = useContext(CheerpJContext)
  if (!ctx) {
    throw new Error("useCheerpJ must be used within a <CheerpJProvider>")
  }
  return ctx
}

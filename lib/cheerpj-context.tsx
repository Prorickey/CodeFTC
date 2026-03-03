"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

type CheerpJStatus = "loading" | "ready" | "error"

interface CheerpJContextValue {
  status: CheerpJStatus
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

export function CheerpJProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<CheerpJStatus>("loading")

  useEffect(() => {
    getInitPromise()
      .then(() => setStatus("ready"))
      .catch((err) => {
        console.error("[CheerpJ] Init failed:", err)
        setStatus("error")
      })
  }, [])

  return (
    <CheerpJContext.Provider value={{ status }}>
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

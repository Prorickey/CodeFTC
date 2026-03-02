"use client"

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"

type CheerpJStatus = "loading" | "ready" | "error"

interface CheerpJContextValue {
  status: CheerpJStatus
}

const CheerpJContext = createContext<CheerpJContextValue | null>(null)

const CHEERPJ_CDN = "https://cjrtnc.leaningtech.com/3.0/cj3loader.js"

export function CheerpJProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<CheerpJStatus>("loading")
  const initRef = useRef(false)

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    async function init() {
      try {
        // Load CheerpJ script from CDN
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

        // Initialize CheerpJ runtime
        // In CheerpJ 3.0, System.out goes to console.log by default — no display needed
        await cheerpjInit({ status: "none" })

        setStatus("ready")
      } catch (err) {
        console.error("[CheerpJ] Init failed:", err)
        setStatus("error")
      }
    }

    init()
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

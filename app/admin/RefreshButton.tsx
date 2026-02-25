"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { RefreshCw } from "lucide-react"

export function RefreshButton() {
  const router = useRouter()
  const [spinning, setSpinning] = useState(false)

  function handleRefresh() {
    setSpinning(true)
    router.refresh()
    setTimeout(() => setSpinning(false), 800)
  }

  return (
    <button
      onClick={handleRefresh}
      title="Refresh data"
      className="flex items-center gap-1.5 rounded-md border border-[#2a2a2a] bg-[#141414] px-3 py-1.5 text-sm text-[#888] transition-colors hover:bg-[#1a1a1a] hover:text-[#ededed]"
    >
      <RefreshCw className={`h-3.5 w-3.5 ${spinning ? "animate-spin" : ""}`} />
      Refresh
    </button>
  )
}

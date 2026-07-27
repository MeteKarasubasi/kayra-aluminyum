"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

export function VisitTracker() {
  const pathname = usePathname()
  useEffect(() => {
    if (pathname.startsWith("/api") || pathname.startsWith("/admin")) return
    fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
    }).catch(() => {})
  }, [pathname])
  return null
}
"use client"

import { useEffect, useState } from "react"

type Settings = Record<string, string>

let cache: { data: Settings; ts: number } | null = null
const TTL = 60000

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (cache && Date.now() - cache.ts < TTL) {
      setSettings(cache.data)
      setLoading(false)
      return
    }
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        cache = { data, ts: Date.now() }
        setSettings(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { settings, loading }
}

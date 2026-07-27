import { db } from "@/lib/db"

export const SETTINGS_CACHE_TTL = 10 * 60 * 1000

type SettingsMap = Record<string, string>

let cache: { data: SettingsMap; ts: number } | null = null

export function getCachedSettings(): SettingsMap | null {
  if (cache && Date.now() - cache.ts < SETTINGS_CACHE_TTL) {
    return cache.data
  }
  return null
}

export async function getSettings(): Promise<SettingsMap> {
  const cached = getCachedSettings()
  if (cached) return cached
  const rows = await db.siteSetting.findMany({ orderBy: { key: "asc" } })
  const data: SettingsMap = {}
  for (const r of rows) {
    data[r.key] = r.value
  }
  cache = { data, ts: Date.now() }
  return data
}

export function invalidateSettingsCache(): void {
  cache = null
}

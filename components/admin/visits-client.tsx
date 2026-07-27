"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import {
  Eye,
  Calendar,
  TrendingUp,
  Globe,
  MapPin,
  Languages,
  Link,
  Clock,
  Loader2,
  RefreshCw,
} from "lucide-react"
import {
  AdminPageHeader,
  AdminCard,
  StatCard,
  EmptyState,
  AdminButton,
} from "@/components/admin/ui"

type Visit = {
  id: string
  path: string
  ip: string | null
  referrer: string | null
  country: string | null
  city: string | null
  language: string | null
  device: string | null
  browser: string | null
  isBot: boolean
  createdAt: string
}

type Stats = {
  total: number
  today: number
  last7Days: number
  topCountries: { country: string; count: number }[]
}

function formatRelative(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (isSameDay(date, now)) return "Bugün"
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (isSameDay(date, yesterday)) return "Dün"
  if (diffDays < 30) return `${diffDays} gün önce`

  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function formatFull(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function VisitsClient() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [visits, setVisits] = useState<Visit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([
      fetch("/api/admin/visits/stats").then((r) => r.json() as Promise<Stats>),
      fetch("/api/admin/visits").then((r) => r.json() as Promise<Visit[]>),
    ])
      .then(([s, v]) => {
        if (!active) return
        setStats(s)
        setVisits(Array.isArray(v) ? v : [])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  if (loading || !stats) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
        <span className="ml-3 text-sm">Yükleniyor...</span>
      </div>
    )
  }

  const statCards = [
    {
      icon: Eye,
      label: "Toplam Ziyaret",
      value: stats.total,
      highlight: false,
    },
    {
      icon: Calendar,
      label: "Bugün",
      value: stats.today,
      highlight: stats.today > 0,
    },
    {
      icon: TrendingUp,
      label: "Son 7 Gün",
      value: stats.last7Days,
      highlight: false,
    },
  ]

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="Ziyaretçiler"
        description="Sayfa ziyaret istatistikleri"
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <StatCard
              icon={c.icon}
              label={c.label}
              value={c.value}
              highlight={c.highlight}
            />
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 3 * 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          <AdminCard className="flex h-full flex-col">
            <div className="flex items-start justify-between">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                İlk 6 Ülke
              </p>
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Globe className="size-5" />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {stats.topCountries.length === 0 ? (
                <span className="text-sm text-muted-foreground">Veri yok</span>
              ) : (
                stats.topCountries.map((c) => (
                  <span
                    key={c.country}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary"
                  >
                    {c.country}: {c.count}
                  </span>
                ))
              )}
            </div>
          </AdminCard>
        </motion.div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Son 100 Ziyaret</h2>
        </div>

        {visits.length === 0 ? (
          <EmptyState
            title="Ziyaret bulunamadı"
            description="Henüz ziyaret kaydı yok."
          />
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-2xl border border-border sm:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 font-semibold text-muted-foreground">
                      IP Adresi
                    </th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-3.5" />
                        Ülke / Şehir
                      </span>
                    </th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Languages className="size-3.5" />
                        Dil
                      </span>
                    </th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Link className="size-3.5" />
                        Sayfa
                      </span>
                    </th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        Cihaz
                      </span>
                    </th>
                    <th className="px-4 py-3 font-semibold text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        Tarih
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {visits.map((v) => (
                    <tr key={v.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3 font-mono text-xs text-foreground">
                        {v.ip || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {v.country || v.city
                          ? [v.country, v.city].filter(Boolean).join(" / ")
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {v.language?.toUpperCase() || "—"}
                      </td>
                      <td className="max-w-[220px] px-4 py-3">
                        <span
                          className="block truncate font-mono text-xs text-muted-foreground"
                          title={v.path}
                        >
                          {v.path}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {v.isBot ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                            Bot
                          </span>
                        ) : (
                          <span>
                            {v.browser || "—"}
                            {v.device ? ` · ${v.device}` : ""}
                          </span>
                        )}
                      </td>
                      <td
                        className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground"
                        title={formatFull(v.createdAt)}
                      >
                        {formatRelative(v.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 sm:hidden">
              {visits.map((v, i) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <AdminCard className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-foreground">
                        {v.ip || "—"}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        {formatRelative(v.createdAt)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        {v.country || v.city
                          ? [v.country, v.city].filter(Boolean).join(" / ")
                          : "—"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Languages className="size-3" />
                        {v.language?.toUpperCase() || "—"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {v.isBot ? (
                        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold">
                          Bot
                        </span>
                      ) : (
                        <span>
                          {v.browser || "—"}
                          {v.device ? ` · ${v.device}` : ""}
                        </span>
                      )}
                    </div>
                    <p className="flex items-center gap-1 truncate font-mono text-xs text-muted-foreground">
                      <Link className="size-3 shrink-0" />
                      {v.path}
                    </p>
                  </AdminCard>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}

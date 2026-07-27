"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  FolderKanban,
  Package,
  Mail,
  Eye,
  TrendingUp,
  Loader2,
} from "lucide-react"
import {
  AdminPageHeader,
  StatCard,
  AdminCard,
  AdminButton,
} from "@/components/admin/ui"

type Stats = {
  projects: number
  products: number
  references: number
  messages: number
  unreadMessages: number
  visits: number
  todayVisits: number
  totalParts: number
}

type Message = {
  id: string
  name: string
  email: string
  phone: string
  message: string
  isRead: boolean
  createdAt: string
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

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function DashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json() as Promise<Stats>),
      fetch("/api/admin/messages").then((r) => r.json() as Promise<Message[]>),
    ])
      .then(([s, m]) => {
        if (!active) return
        setStats(s)
        setMessages(Array.isArray(m) ? m.slice(0, 5) : [])
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

  const cards: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    value: number
    sub?: string
    highlight: boolean
  }[] = [
    {
      icon: FolderKanban,
      label: "Cam Sistemleri",
      value: stats.projects,
      highlight: false,
    },
    {
      icon: Package,
      label: "Toplam Parça",
      value: stats.totalParts,
      highlight: false,
    },
    {
      icon: Mail,
      label: "İletişim Talepleri",
      value: stats.messages,
      sub:
        stats.unreadMessages > 0
          ? `${stats.unreadMessages} okunmamış`
          : "Hepsi okundu",
      highlight: stats.unreadMessages > 0,
    },
    {
      icon: Eye,
      label: "Ziyaretçi (Toplam)",
      value: stats.visits,
      highlight: false,
    },
    {
      icon: TrendingUp,
      label: "Ziyaretçi (Bugün)",
      value: stats.todayVisits,
      highlight: false,
    },
  ]

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <AdminPageHeader title="Panel" description="Genel bakış" />

      <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c, i) => (
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
              sub={c.sub}
              highlight={c.highlight}
            />
          </motion.div>
        ))}
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Son Mesajlar</h2>
          <Link
            href="/admin/mesajlar"
            className="text-sm font-medium text-primary hover:underline"
          >
            Tümü
          </Link>
        </div>

        <AdminCard className="divide-y divide-border">
          {messages.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              Henüz mesaj yok.
            </div>
          )}
          {messages.map((m) => (
            <Link
              key={m.id}
              href="/admin/mesajlar"
              className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-muted/40"
            >
              <span
                className={`mt-1.5 size-2 shrink-0 rounded-full ${
                  m.isRead ? "bg-transparent" : "bg-primary"
                }`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate font-semibold">{m.name}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatRelative(m.createdAt)}
                  </span>
                </div>
                <p className="truncate text-sm text-muted-foreground">{m.email}</p>
                <p className="mt-1 line-clamp-1 text-sm text-foreground/80">
                  {m.message}
                </p>
              </div>
            </Link>
          ))}
        </AdminCard>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-xl font-semibold">Hızlı İşlemler</h2>
        <div className="flex flex-wrap gap-3">
          <AdminButton href="/admin/projeler">Yeni Proje</AdminButton>
          <AdminButton href="/admin/urunler" variant="outline">
            Yeni Ürün
          </AdminButton>
          <AdminButton href="/admin/mesajlar" variant="outline">
            Mesajlar
          </AdminButton>
        </div>
      </section>
    </main>
  )
}
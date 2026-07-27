"use client"

import { useCallback, useEffect, useState } from "react"
import { motion } from "motion/react"
import {
  Mail,
  MailOpen,
  Trash2,
  Phone,
  Globe,
  MapPin,
  Eye,
  EyeOff,
} from "lucide-react"
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
  AdminModal,
  Badge,
  EmptyState,
} from "@/components/admin/ui"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  name: string
  email: string
  phone?: string | null
  message: string
  system?: string | null
  ip?: string | null
  country?: string | null
  city?: string | null
  language?: string | null
  isRead: boolean
  isSpam: boolean
  createdAt: string
}

type Filter = "all" | "unread"

const SYSTEM_LABELS: Record<string, string> = {
  "Kış Bahçesi Sistemleri": "Kış Bahçesi",
}

function systemLabel(raw: string | null | undefined): string {
  if (!raw) return ""
  return (SYSTEM_LABELS[raw] || raw).slice(0, 20)
}

function relativeDate(iso: string) {
  const d = new Date(iso)
  const diff = Date.now() - d.getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return "Az önce"
  if (min < 60) return `${min} dk önce`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h} sa önce`
  const days = Math.floor(h / 24)
  if (days < 7) return `${days} gün önce`
  return d.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function MessagesManager() {
  const [filter, setFilter] = useState<Filter>("all")
  const [messages, setMessages] = useState<Message[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchList = useCallback(async (f: Filter) => {
    setLoading(true)
    const url =
      f === "unread" ? "/api/admin/messages?unread=true" : "/api/admin/messages"
    try {
      const res = await fetch(url, { cache: "no-store" })
      const data: Message[] = await res.json()
      setMessages(Array.isArray(data) ? data : [])
    } catch {
      setMessages([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchUnread = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats", { cache: "no-store" })
      const data = await res.json()
      setUnreadCount(data?.unreadMessages ?? 0)
    } catch {
      setUnreadCount(0)
    }
  }, [])

  useEffect(() => {
    fetchList(filter)
  }, [filter, fetchList])

  useEffect(() => {
    fetchUnread()
  }, [fetchUnread])

  async function handleMessageClick(m: Message) {
    if (!m.isRead) {
      try {
        await fetch(`/api/admin/messages/${m.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isRead: true }),
        })
        setMessages((prev) =>
          prev.map((x) => (x.id === m.id ? { ...x, isRead: true } : x)),
        )
        setUnreadCount((c) => Math.max(0, c - 1))
      } catch {
        return
      }
    }
    setExpandedId((prev) => (prev === m.id ? null : m.id))
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Bu mesajı silmek istediğinize emin misiniz?")) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" })
      if (res.ok) {
        await fetchList(filter)
        await fetchUnread()
      }
    } catch {
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Mesajlar"
        description="İletişim formundan gelen mesajlar"
      />

      <div className="flex flex-wrap items-center gap-2">
        <FilterTab
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label="Tümü"
          count={messages.length}
        />
        <FilterTab
          active={filter === "unread"}
          onClick={() => setFilter("unread")}
          label="Okunmamış"
          count={unreadCount}
        />
      </div>

      {loading ? (
        <AdminCard>
          <p className="py-8 text-center text-sm text-muted-foreground">
            Yükleniyor...
          </p>
        </AdminCard>
      ) : messages.length === 0 ? (
        <EmptyState
          icon={<Mail className="size-5" />}
          title="Mesaj bulunamadı"
          description={
            filter === "unread"
              ? "Okunmamış mesaj yok."
              : "Henüz hiç mesaj gelmedi."
          }
        />
      ) : (
        <AdminCard className="divide-y divide-border p-0">
          <ul className="divide-y divide-border">
            {messages.map((m, i) => {
              const expanded = expandedId === m.id
              return (
                <motion.li
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: i * 0.03,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group relative cursor-pointer px-5 py-4 transition hover:bg-muted/30 sm:px-6"
                  onClick={() => handleMessageClick(m)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/40">
                      {m.isRead ? (
                        <MailOpen className="size-4 text-muted-foreground" />
                      ) : (
                        <Mail className="size-4 text-primary" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-semibold text-foreground">
                          {m.name}
                        </span>
                        {!m.isRead && (
                          <span
                            aria-label="Okunmamış"
                            className="inline-block size-2 rounded-full bg-primary"
                          />
                        )}
                        <span className="ml-auto text-xs text-muted-foreground">
                          {relativeDate(m.createdAt)}
                        </span>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                        <a
                          href={`mailto:${m.email}`}
                          className="truncate hover:text-primary"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {m.email}
                        </a>
                        {m.phone && (
                          <>
                            <span className="opacity-40">·</span>
                            <a
                              href={`tel:${m.phone}`}
                              className="hover:text-primary"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {m.phone}
                            </a>
                          </>
                        )}
                      </div>

                      {m.system && (
                        <div className="mt-1">
                          <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {systemLabel(m.system)}
                          </span>
                        </div>
                      )}

                      {(m.ip || m.country) && (
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground/60">
                          {m.ip && <span>IP: {m.ip}</span>}
                          {m.country && (
                            <span>
                              {m.country}
                              {m.city ? ` - ${m.city}` : ""}
                            </span>
                          )}
                        </div>
                      )}

                      <p
                        className={cn(
                          "mt-2 text-sm text-foreground/80",
                          expanded ? "" : "line-clamp-2",
                        )}
                      >
                        {m.message}
                      </p>

                      {expanded &&
                        (m.system || m.ip || m.country || m.city || m.language) && (
                          <div className="mt-3 space-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
                            {m.system && (
                              <p>
                                <span className="font-medium">Sistem:</span>{" "}
                                {m.system}
                              </p>
                            )}
                            {m.ip && (
                              <p>
                                <span className="font-medium">IP:</span> {m.ip}
                              </p>
                            )}
                            {m.country && (
                              <p>
                                <span className="font-medium">Ülke:</span>{" "}
                                {m.country}
                              </p>
                            )}
                            {m.city && (
                              <p>
                                <span className="font-medium">Şehir:</span>{" "}
                                {m.city}
                              </p>
                            )}
                            {m.language && (
                              <p>
                                <span className="font-medium">Dil:</span>{" "}
                                {m.language}
                              </p>
                            )}
                          </div>
                        )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <AdminButton
                        variant="ghost"
                        size="icon"
                        aria-label="Mesajı sil"
                        disabled={deletingId === m.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(m.id)
                        }}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </AdminButton>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          m.isRead
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary/15 text-primary",
                        )}
                      >
                        {m.isRead ? "Okundu" : "Yeni"}
                      </span>
                    </div>
                  </div>
                </motion.li>
              )
            })}
          </ul>
        </AdminCard>
      )}
    </div>
  )
}

function FilterTab({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  label: string
  count: number
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
        active
          ? "border-primary/40 bg-primary/15 text-primary"
          : "border-border bg-transparent text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
      <Badge variant={active ? "active" : "inactive"}>{count}</Badge>
    </button>
  )
}

"use client"

import { useCallback, useEffect, useState } from "react"
import {
  ArrowLeft,
  Loader2,
  Mail,
  MailOpen,
  Trash2,
} from "lucide-react"
import {
  AdminButton,
  AdminCard,
  AdminModal,
  AdminPageHeader,
  Badge,
  EmptyState,
} from "@/components/admin/ui"

type Message = {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  system: string | null
  ip: string | null
  country: string | null
  city: string | null
  language: string | null
  isRead: boolean
  createdAt: string
}

function DetailView({
  msg,
  onBack,
  onDelete,
}: {
  msg: Message
  onBack: () => void
  onDelete: (id: string) => void
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex size-10 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label="Geri"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            {msg.name}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {new Date(msg.createdAt).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="ml-auto">
          <AdminButton variant="danger" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="size-4" />
            Sil
          </AdminButton>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AdminCard>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">
            Ad Soyad
          </p>
          <p className="mt-1 text-foreground">{msg.name}</p>
        </AdminCard>

        <AdminCard>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">
            E-posta
          </p>
          <a
            href={`mailto:${msg.email}`}
            className="mt-1 block text-primary hover:underline"
          >
            {msg.email}
          </a>
        </AdminCard>

        {msg.phone && (
          <AdminCard>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">
              Telefon
            </p>
            <a
              href={`tel:${msg.phone}`}
              className="mt-1 block text-primary hover:underline"
            >
              {msg.phone}
            </a>
          </AdminCard>
        )}

        {msg.system && (
          <AdminCard>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">
              Sistem
            </p>
            <p className="mt-1 text-foreground">{msg.system}</p>
          </AdminCard>
        )}

        {msg.country && (
          <AdminCard>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">
              Konum
            </p>
            <p className="mt-1 text-foreground">
              {[msg.city, msg.country].filter(Boolean).join(", ")}
            </p>
          </AdminCard>
        )}

        <AdminCard>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">
            IP
          </p>
          <p className="mt-1 font-mono text-sm text-foreground">
            {msg.ip ?? "—"}
          </p>
        </AdminCard>

        {msg.language && (
          <AdminCard>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">
              Dil
            </p>
            <p className="mt-1 text-foreground">{msg.language}</p>
          </AdminCard>
        )}

        <AdminCard>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">
            Durum
          </p>
          <div className="mt-1">
            <Badge variant={msg.isRead ? "active" : "danger"}>
              {msg.isRead ? "Okundu" : "Okunmamış"}
            </Badge>
          </div>
        </AdminCard>
      </div>

      <AdminCard className="mt-6">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground">
          Mesaj
        </p>
        <p className="mt-3 whitespace-pre-wrap text-foreground leading-relaxed">
          {msg.message}
        </p>
      </AdminCard>

      <AdminModal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Silme Onayı"
      >
        <p className="text-sm text-muted-foreground">
          Bu mesajı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <AdminButton
            variant="outline"
            onClick={() => setConfirmDelete(false)}
          >
            Vazgeç
          </AdminButton>
          <AdminButton
            variant="danger"
            onClick={() => {
              onDelete(msg.id)
              setConfirmDelete(false)
            }}
          >
            <Trash2 className="size-4" />
            Sil
          </AdminButton>
        </div>
      </AdminModal>
    </div>
  )
}

export function MessagesClient() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [detailId, setDetailId] = useState<string | null>(null)

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/messages")
      if (res.ok) setMessages((await res.json()) as Message[])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const detailMessage = detailId
    ? messages.find((m) => m.id === detailId) ?? null
    : null

  async function markAsRead(msg: Message) {
    if (msg.isRead) return
    await fetch(`/api/admin/messages/${msg.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: true }),
    })
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m)),
    )
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" })
    setMessages((prev) => prev.filter((m) => m.id !== id))
    setDetailId(null)
  }

  const unread = messages.filter((m) => !m.isRead).length

  if (detailMessage) {
    return (
      <DetailView
        msg={detailMessage}
        onBack={() => setDetailId(null)}
        onDelete={handleDelete}
      />
    )
  }

  return (
    <div>
      <AdminPageHeader
        title="İletişim Talepleri"
        description={
          unread > 0
            ? `${messages.length} mesaj, ${unread} okunmamış`
            : `${messages.length} mesaj`
        }
      />

      {loading ? (
        <AdminCard>
          <p className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Yükleniyor...
          </p>
        </AdminCard>
      ) : messages.length === 0 ? (
        <EmptyState
          icon={<Mail className="size-5" />}
          title="Henüz mesaj yok"
          description="Yeni iletişim talepleri burada görünecek."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <AdminCard
              key={msg.id}
              className="cursor-pointer transition hover:border-primary/30"
              onClick={() => {
                setDetailId(msg.id)
                markAsRead(msg)
              }}
            >
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  {msg.isRead ? (
                    <MailOpen className="size-4" />
                  ) : (
                    <Mail className="size-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display font-semibold text-foreground">
                      {msg.name}
                    </span>
                    {!msg.isRead && <Badge variant="danger">Yeni</Badge>}
                    <span className="ml-auto text-xs text-muted-foreground">
                      {new Date(msg.createdAt).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <a
                    href={`mailto:${msg.email}`}
                    className="mt-0.5 block truncate text-sm text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {msg.email}
                  </a>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                    {msg.message}
                  </p>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  )
}

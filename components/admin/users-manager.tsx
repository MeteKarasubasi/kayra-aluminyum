"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  Mail,
  Check,
  Loader2,
  Pencil,
  User as UserIcon,
  UserPlus,
  X,
} from "lucide-react"
import {
  AdminCard,
  AdminButton,
  AdminInput,
  AdminLabel,
  AdminModal,
} from "@/components/admin/ui"
import { cn } from "@/lib/utils"

type AdminUser = {
  id: string
  name: string
  email: string
  role?: string
  createdAt: string
}

export function UsersManager() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [selfId, setSelfId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<
    | { mode: "create" }
    | { mode: "edit"; user: AdminUser }
    | null
  >(null)

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" })
      const data: AdminUser[] = await res.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch {
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
    fetch("/api/admin/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setSelfId(d?.id ?? null))
      .catch(() => {})
  }, [fetchUsers])

  return (
    <>
      <AdminCard>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">
              Kullanıcılar
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Panele erişimi olan kullanıcıları ekleyin, düzenleyin veya kaldırın.
            </p>
          </div>
          <AdminButton
            onClick={() => setModal({ mode: "create" })}
            className="shrink-0"
          >
            <UserPlus className="size-4" />
            Yeni Kullanıcı
          </AdminButton>
        </div>

        <ul className="mt-5 divide-y divide-border">
          {loading ? (
            <li className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
              Yükleniyor...
            </li>
          ) : users.length === 0 ? (
            <li className="py-8 text-center text-sm text-muted-foreground">
              Kayıtlı kullanıcı yok.
            </li>
          ) : (
            users.map((u, i) => (
              <motion.li
                key={u.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                className="flex items-center gap-3 py-3"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <UserIcon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-semibold text-foreground">
                      {u.name}
                    </p>
                    {u.id === selfId && (
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                        SİZ
                      </span>
                    )}
                    {u.role && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {u.role}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    {u.email}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <AdminButton
                    variant="ghost"
                    size="icon"
                    aria-label="Düzenle"
                    onClick={() => setModal({ mode: "edit", user: u })}
                  >
                    <Pencil className="size-4" />
                  </AdminButton>
                </div>
              </motion.li>
            ))
          )}
        </ul>
      </AdminCard>

      <AnimatePresence>
        {modal && (
          <UserModal
            key={modal.mode === "edit" ? `edit-${modal.user.id}` : "create"}
            mode={modal.mode}
            user={modal.mode === "edit" ? modal.user : undefined}
            onClose={() => setModal(null)}
            onSaved={() => {
              setModal(null)
              fetchUsers()
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function UserModal({
  mode,
  user,
  onClose,
  onSaved,
}: {
  mode: "create" | "edit"
  user?: AdminUser
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = mode === "edit"
  const [name, setName] = useState(user?.name ?? "")
  const [email, setEmail] = useState(user?.email ?? "")
  const [password, setPassword] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload: Record<string, string> = { name, email }
      if (password) payload.password = password

      const url = isEdit ? `/api/admin/users/${user!.id}` : "/api/admin/users"
      const method = isEdit ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error ?? "İşlem başarısız.")
        return
      }
      onSaved()
    } catch {
      setError("Sunucuyla bağlantı kurulamadı.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!isEdit || !user) return
    if (!window.confirm(`${user.name} kullanıcısını silmek istediğinize emin misiniz?`))
      return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error ?? "Silme başarısız.")
        return
      }
      onSaved()
    } catch {
      setError("Sunucuyla bağlantı kurulamadı.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminModal open onClose={onClose} title={isEdit ? "Kullanıcı Düzenle" : "Yeni Kullanıcı"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <AdminLabel htmlFor="user-name" className="mb-2 block">İsim</AdminLabel>
          <AdminInput
            id="user-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ad Soyad"
          />
        </div>
        <div>
          <AdminLabel htmlFor="user-email" className="mb-2 block">E-posta</AdminLabel>
          <AdminInput
            id="user-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
          />
        </div>
        <div>
          <AdminLabel htmlFor="user-password" className="mb-2 block">
            Şifre {isEdit && <span className="font-normal text-muted-foreground">(değiştirmek istemiyorsanız boş bırakın)</span>}
          </AdminLabel>
          <AdminInput
            id="user-password"
            type="password"
            required={!isEdit}
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isEdit ? "••••••" : "En az 6 karakter"}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
            <Mail className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className={cn("flex gap-2", isEdit && "justify-between")}>
          {isEdit && (
            <AdminButton
              type="button"
              variant="danger"
              onClick={handleDelete}
              disabled={saving}
            >
              <X className="size-4" />
              Kullanıcıyı Sil
            </AdminButton>
          )}
          <AdminButton
            type="submit"
            disabled={saving}
            className={isEdit ? "" : "w-full"}
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Check className="size-4" />
                {isEdit ? "Kaydet" : "Oluştur"}
              </>
            )}
          </AdminButton>
        </div>
      </form>
    </AdminModal>
  )
}

"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"
import { Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react"
import {
  AdminButton,
  AdminCard,
  AdminCheckbox,
  AdminInput,
  AdminLabel,
  AdminModal,
  AdminPageHeader,
  Badge,
  EmptyState,
} from "@/components/admin/ui"
import { ImageUpload } from "@/components/admin/image-upload"

type Reference = {
  id: string
  name: string
  logo: string
  website?: string | null
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
}

type Draft = {
  name: string
  logo: string
  website: string
  order: number
  isActive: boolean
}

const emptyDraft: Draft = {
  name: "",
  logo: "",
  website: "",
  order: 0,
  isActive: true,
}

export function ReferencesManager() {
  const [references, setReferences] = useState<Reference[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Reference | null>(null)
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [submitting, setSubmitting] = useState(false)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const fetchRefs = useCallback(async () => {
    setLoading(true)
    const res = await fetch("/api/admin/references")
    if (res.ok) setReferences((await res.json()) as Reference[])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchRefs()
  }, [fetchRefs])

  function openCreate() {
    setEditing(null)
    setDraft(emptyDraft)
    setOpen(true)
  }

  function openEdit(r: Reference) {
    setEditing(r)
    setDraft({
      name: r.name,
      logo: r.logo,
      website: r.website ?? "",
      order: r.order,
      isActive: r.isActive,
    })
    setOpen(true)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    if (!draft.logo) {
      alert("Logo yükleme zorunludur.")
      setSubmitting(false)
      return
    }
    const payload = {
      name: draft.name,
      logo: draft.logo,
      website: draft.website.trim() ? draft.website.trim() : null,
      order: Number(draft.order) || 0,
      isActive: draft.isActive,
    }

    try {
      const url = editing
        ? `/api/admin/references/${editing.id}`
        : "/api/admin/references"
      const method = editing ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setOpen(false)
        await fetchRefs()
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function toggleActive(r: Reference) {
    await fetch(`/api/admin/references/${r.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !r.isActive }),
    })
    await fetchRefs()
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/references/${id}`, { method: "DELETE" })
    setConfirmId(null)
    await fetchRefs()
  }

  return (
    <div>
      <AdminPageHeader
        title="Referanslar"
        description="Firma referanslarını yönetin"
        action={
          <AdminButton onClick={openCreate}>
            <Plus className="size-4" />
            Yeni Referans
          </AdminButton>
        }
      />

      <div className="mt-6">
        {loading ? (
          <AdminCard>
            <p className="py-8 text-center text-sm text-muted-foreground">
              Yükleniyor...
            </p>
          </AdminCard>
        ) : references.length === 0 ? (
          <EmptyState
            icon={<Star className="size-5" />}
            title="Henüz referans yok"
            description="İlk referansınızı eklemek için “Yeni Referans” butonunu kullanın."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {references.map((r) => (
              <AdminCard key={r.id} className="flex items-center gap-4 p-4">
                <div className="size-14 shrink-0 overflow-hidden rounded-xl border border-border bg-muted p-1">
                  {r.logo ? (
                    <img
                      src={r.logo}
                      alt={r.name}
                      className="size-full object-contain"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display font-semibold text-foreground">
                      {r.name}
                    </p>
                    <Badge variant={r.isActive ? "active" : "inactive"}>
                      {r.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                  </div>
                  {r.website ? (
                    <a
                      href={r.website}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate text-xs text-primary hover:underline"
                    >
                      {r.website}
                    </a>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Web sitesi yok
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <AdminButton
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(r)}
                  >
                    {r.isActive ? "Pasifleştir" : "Aktifleştir"}
                  </AdminButton>
                  <AdminButton
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(r)}
                    aria-label="Düzenle"
                  >
                    <Pencil className="size-4" />
                  </AdminButton>
                  <AdminButton
                    variant="danger"
                    size="icon"
                    onClick={() => setConfirmId(r.id)}
                    aria-label="Sil"
                  >
                    <Trash2 className="size-4" />
                  </AdminButton>
                </div>
              </AdminCard>
            ))}
          </div>
        )}
      </div>

      <AdminModal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Referansı Düzenle" : "Yeni Referans"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <AdminLabel htmlFor="name">Ad *</AdminLabel>
            <AdminInput
              id="name"
              required
              value={draft.name}
              onChange={(e) =>
                setDraft((d) => ({ ...d, name: e.target.value }))
              }
            />
          </div>

          <ImageUpload
            label="Logo *"
            value={draft.logo}
            onChange={(url) => setDraft((d) => ({ ...d, logo: url }))}
            aspect="aspect-square"
          />

          <div className="flex flex-col gap-2">
            <AdminLabel htmlFor="website">Web sitesi</AdminLabel>
            <AdminInput
              id="website"
              type="url"
              placeholder="https://"
              value={draft.website}
              onChange={(e) =>
                setDraft((d) => ({ ...d, website: e.target.value }))
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <AdminLabel htmlFor="order">Sıra</AdminLabel>
            <AdminInput
              id="order"
              type="number"
              value={draft.order}
              onChange={(e) =>
                setDraft((d) => ({ ...d, order: Number(e.target.value) }))
              }
            />
          </div>

          <label className="inline-flex cursor-pointer items-center gap-2.5 select-none">
            <AdminCheckbox
              checked={draft.isActive}
              onChange={(e) =>
                setDraft((d) => ({ ...d, isActive: e.target.checked }))
              }
            />
            <span className="text-sm text-foreground">Aktif</span>
          </label>

          <div className="mt-2 flex justify-end gap-2">
            <AdminButton
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              İptal
            </AdminButton>
            <AdminButton type="submit" disabled={submitting}>
              {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              {editing ? "Kaydet" : "Oluştur"}
            </AdminButton>
          </div>
        </form>
      </AdminModal>

      <AdminModal
        open={confirmId !== null}
        onClose={() => setConfirmId(null)}
        title="Silme Onayı"
      >
        <p className="text-sm text-muted-foreground">
          Bu referansı silmek istediğinize emin misiniz? Bu işlem geri
          alınamaz.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <AdminButton variant="outline" onClick={() => setConfirmId(null)}>
            Vazgeç
          </AdminButton>
          <AdminButton
            variant="danger"
            onClick={() => confirmId && handleDelete(confirmId)}
          >
            <Trash2 className="size-4" />
            Sil
          </AdminButton>
        </div>
      </AdminModal>
    </div>
  )
}
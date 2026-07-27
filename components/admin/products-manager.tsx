"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"
import { Loader2, Package, Pencil, Plus, Trash2 } from "lucide-react"
import {
  AdminButton,
  AdminCard,
  AdminCheckbox,
  AdminInput,
  AdminLabel,
  AdminModal,
  AdminPageHeader,
  AdminTextarea,
  Badge,
  EmptyState,
} from "@/components/admin/ui"
import { ImageUpload } from "@/components/admin/image-upload"

type Product = {
  id: string
  titleTr: string
  titleEn: string
  slug: string
  descTr?: string | null
  descEn?: string | null
  image: string
  code: string
  features: string[]
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
}

type Draft = {
  titleTr: string
  titleEn: string
  slug: string
  descTr: string
  descEn: string
  image: string
  code: string
  features: string
  order: number
  isActive: boolean
}

const emptyDraft: Draft = {
  titleTr: "",
  titleEn: "",
  slug: "",
  descTr: "",
  descEn: "",
  image: "",
  code: "",
  features: "",
  order: 0,
  isActive: true,
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [submitting, setSubmitting] = useState(false)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const res = await fetch("/api/admin/products")
    if (res.ok) setProducts((await res.json()) as Product[])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  function openCreate() {
    setEditing(null)
    setDraft(emptyDraft)
    setOpen(true)
  }

  function openEdit(p: Product) {
    setEditing(p)
    setDraft({
      titleTr: p.titleTr,
      titleEn: p.titleEn,
      slug: p.slug,
      descTr: p.descTr ?? "",
      descEn: p.descEn ?? "",
      image: p.image,
      code: p.code,
      features: p.features.join(", "),
      order: p.order,
      isActive: p.isActive,
    })
    setOpen(true)
  }

  function onTitleTrChange(value: string) {
    setDraft((d) => ({
      ...d,
      titleTr: value,
      slug:
        d.slug === "" || slugify(d.slug) === slugify(d.titleTr)
          ? slugify(value)
          : d.slug,
    }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    if (!draft.image) {
      alert("Görsel yükleme zorunludur.")
      setSubmitting(false)
      return
    }
    const payload = {
      titleTr: draft.titleTr,
      titleEn: draft.titleEn,
      slug: draft.slug,
      descTr: draft.descTr,
      descEn: draft.descEn,
      image: draft.image,
      code: draft.code,
      features: draft.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      order: Number(draft.order) || 0,
      isActive: draft.isActive,
    }

    try {
      const url = editing
        ? `/api/admin/products/${editing.id}`
        : "/api/admin/products"
      const method = editing ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setOpen(false)
        await fetchProducts()
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function toggleActive(p: Product) {
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !p.isActive }),
    })
    await fetchProducts()
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
    setConfirmId(null)
    await fetchProducts()
  }

  return (
    <div>
      <AdminPageHeader
        title="Ürünler"
        description="Kataloğunuzdaki ürünleri yönetin"
        action={
          <AdminButton onClick={openCreate}>
            <Plus className="size-4" />
            Yeni Ürün
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
        ) : products.length === 0 ? (
          <EmptyState
            icon={<Package className="size-5" />}
            title="Henüz ürün yok"
            description="İlk ürününüzü eklemek için “Yeni Ürün” butonunu kullanın."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {products.map((p) => (
              <AdminCard key={p.id} className="flex items-center gap-4 p-4">
                <div className="size-14 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.titleTr}
                      className="size-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display font-semibold text-foreground">
                      {p.titleTr}
                    </p>
                    <Badge variant={p.isActive ? "active" : "inactive"}>
                      {p.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.titleEn} · /{p.slug} · {p.code}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <AdminButton
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(p)}
                  >
                    {p.isActive ? "Pasifleştir" : "Aktifleştir"}
                  </AdminButton>
                  <AdminButton
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(p)}
                    aria-label="Düzenle"
                  >
                    <Pencil className="size-4" />
                  </AdminButton>
                  <AdminButton
                    variant="danger"
                    size="icon"
                    onClick={() => setConfirmId(p.id)}
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
        title={editing ? "Ürünü Düzenle" : "Yeni Ürün"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <AdminLabel htmlFor="titleTr">Başlık (TR) *</AdminLabel>
              <AdminInput
                id="titleTr"
                required
                value={draft.titleTr}
                onChange={(e) => onTitleTrChange(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <AdminLabel htmlFor="titleEn">Başlık (EN) *</AdminLabel>
              <AdminInput
                id="titleEn"
                required
                value={draft.titleEn}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, titleEn: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <AdminLabel htmlFor="slug">Slug *</AdminLabel>
              <AdminInput
                id="slug"
                required
                value={draft.slug}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, slug: slugify(e.target.value) }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <AdminLabel htmlFor="code">Kod *</AdminLabel>
              <AdminInput
                id="code"
                required
                value={draft.code}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, code: e.target.value }))
                }
              />
            </div>
          </div>

          <ImageUpload
          label="Görsel *"
          value={draft.image}
          onChange={(url) => setDraft((d) => ({ ...d, image: url }))}
        />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <AdminLabel htmlFor="descTr">Açıklama (TR)</AdminLabel>
              <AdminTextarea
                id="descTr"
                rows={3}
                value={draft.descTr}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, descTr: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <AdminLabel htmlFor="descEn">Açıklama (EN)</AdminLabel>
              <AdminTextarea
                id="descEn"
                rows={3}
                value={draft.descEn}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, descEn: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <AdminLabel htmlFor="features">
              Özellikler (virgülle ayır)
            </AdminLabel>
            <AdminInput
              id="features"
              value={draft.features}
              onChange={(e) =>
                setDraft((d) => ({ ...d, features: e.target.value }))
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
          Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
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
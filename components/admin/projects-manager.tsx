"use client"

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Check, FolderKanban, Pencil, Plus, Trash2, X } from "lucide-react"
import {
  AdminButton,
  AdminCard,
  AdminCheckbox,
  AdminInput,
  AdminLabel,
  AdminPageHeader,
  AdminSelect,
  AdminTextarea,
  Badge,
  EmptyState,
} from "@/components/admin/ui"
import { ImageUpload, GalleryUpload } from "@/components/admin/image-upload"
import { cn } from "@/lib/utils"

type Category = "residential" | "commercial" | "corporate"

type Project = {
  id: string
  title: string
  slug: string
  description?: string | null
  location: string
  category: string
  image: string
  gallery?: string[]
  products?: string[]
  area?: string | null
  year?: string | null
  client?: string | null
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
}

type FormState = {
  title: string
  slug: string
  location: string
  category: Category
  image: string
  description: string
  gallery: string[]
  products: string
  area: string
  year: string
  client: string
  order: string
  isActive: boolean
}

const emptyForm: FormState = {
  title: "",
  slug: "",
  location: "",
  category: "residential",
  image: "",
  description: "",
  gallery: [],
  products: "",
  area: "",
  year: "",
  client: "",
  order: "0",
  isActive: true,
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")

const categoryLabels: Record<Category, string> = {
  residential: "Konut",
  commercial: "Ticari",
  corporate: "Kurumsal",
}

function toCategory(value: string): Category {
  if (value === "commercial" || value === "corporate" || value === "residential") {
    return value
  }
  return "residential"
}

function listToText(arr?: string[] | null): string {
  return Array.isArray(arr) ? arr.join(", ") : ""
}

function textToList(text: string): string[] {
  return text
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
}

function projectToForm(p: Project): FormState {
  return {
    title: p.title ?? "",
    slug: p.slug ?? "",
    location: p.location ?? "",
    category: toCategory(p.category),
    image: p.image ?? "",
    description: p.description ?? "",
    gallery: Array.isArray(p.gallery) ? p.gallery : [],
    products: listToText(p.products),
    area: p.area ?? "",
    year: p.year ?? "",
    client: p.client ?? "",
    order: String(p.order ?? 0),
    isActive: p.isActive,
  }
}

type Toast = { type: "success" | "error"; message: string } | null

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [toast, setToast] = useState<Toast>(null)

  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message })
    window.setTimeout(() => setToast(null), 3200)
  }, [])

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/projects", { cache: "no-store" })
      if (!res.ok) throw new Error("fetch-failed")
      const data = (await res.json()) as Project[]
      setProjects(data)
    } catch {
      showToast("error", "Projeler yüklenemedi.")
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    void fetchProjects()
  }, [fetchProjects])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (p: Project) => {
    setEditing(p)
    setForm(projectToForm(p))
    setModalOpen(true)
  }

  const closeModal = () => {
    if (saving) return
    setModalOpen(false)
    setEditing(null)
  }

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (saving) return

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      location: form.location.trim(),
      category: form.category,
      image: form.image.trim(),
      description: form.description.trim() || undefined,
      gallery: form.gallery,
      products: textToList(form.products),
      area: form.area.trim() || undefined,
      year: form.year.trim() || undefined,
      client: form.client.trim() || undefined,
      order: Number(form.order) || 0,
      isActive: form.isActive,
    }

    if (!payload.title || !payload.location || !payload.image) {
      showToast("error", "Başlık, konum ve görsel zorunludur.")
      return
    }

    setSaving(true)
    if (!payload.image) {
      showToast("error", "Görsel yükleme zorunludur.")
      setSaving(false)
      return
    }
    if (!payload.title) {
      showToast("error", "Başlık zorunludur.")
      setSaving(false)
      return
    }
    try {
      const url = editing
        ? `/api/admin/projects/${editing.id}`
        : "/api/admin/projects"
      const method = editing ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(data?.error ?? "request-failed")
      }
      showToast("success", editing ? "Proje güncellendi." : "Proje oluşturuldu.")
      setModalOpen(false)
      setEditing(null)
      await fetchProjects()
    } catch {
      showToast("error", "Kaydetme başarısız oldu.")
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = (id: string) => setConfirmId(id)

  const cancelDelete = () => setConfirmId(null)

  const handleDelete = async () => {
    const id = confirmId
    if (!id || deletingId) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("delete-failed")
      showToast("success", "Proje silindi.")
      setConfirmId(null)
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch {
      showToast("error", "Silme işlemi başarısız oldu.")
    } finally {
      setDeletingId(null)
    }
  }

  const toggleActive = async (p: Project) => {
    const next = !p.isActive
    setProjects((prev) =>
      prev.map((item) => (item.id === p.id ? { ...item, isActive: next } : item)),
    )
    try {
      const res = await fetch(`/api/admin/projects/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: next }),
      })
      if (!res.ok) throw new Error("toggle-failed")
    } catch {
      setProjects((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, isActive: !next } : item)),
      )
      showToast("error", "Durum güncellenemedi.")
    }
  }

  const sorted = useMemo(
    () => [...projects].sort((a, b) => a.order - b.order),
    [projects],
  )

  const deleteTarget = useMemo(
    () => projects.find((p) => p.id === confirmId) ?? null,
    [projects, confirmId],
  )

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:py-12">
      <AdminPageHeader
        title="Projeler"
        description="Proje koleksiyonunu yönetin: oluşturun, düzenleyin ve yayından kaldırın."
        action={
          <AdminButton variant="primary" onClick={openCreate}>
            <Plus />
            Yeni Proje
          </AdminButton>
        }
      />

      {loading ? (
        <AdminCard className="flex items-center justify-center py-20 text-sm text-muted-foreground">
          <FolderKanban className="size-5 animate-pulse" />
          <span className="ml-2">Yükleniyor...</span>
        </AdminCard>
      ) : sorted.length === 0 ? (
        <EmptyState
          title="Henüz proje yok"
          description="İlk projeyi eklemek için ‘Yeni Proje’ butonunu kullanın."
        />
      ) : (
        <div className="hidden overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur md:block">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Görsel</th>
                <th className="px-4 py-3 font-semibold">Başlık</th>
                <th className="px-4 py-3 font-semibold">Konum</th>
                <th className="px-4 py-3 font-semibold">Kategori</th>
                <th className="px-4 py-3 font-semibold">Yıl</th>
                <th className="px-4 py-3 font-semibold">Durum</th>
                <th className="px-4 py-3 text-right font-semibold">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-border last:border-0 transition hover:bg-muted/20"
                >
                  <td className="px-4 py-3">
                    {p.image ? (
                      <div className="relative size-12 overflow-hidden rounded-lg border border-border bg-muted">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="size-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex size-12 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                        <FolderKanban className="size-4" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{p.title}</p>
                    <p className="text-xs text-muted-foreground">/{p.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.location}</td>
                  <td className="px-4 py-3">
                    <Badge variant="active">
                      {categoryLabels[toCategory(p.category)]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.year || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleActive(p)}
                      className="inline-flex items-center"
                      aria-pressed={p.isActive}
                    >
                      {p.isActive ? (
                        <Badge variant="active">Aktif</Badge>
                      ) : (
                        <Badge variant="inactive">Pasif</Badge>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <AdminButton
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(p)}
                      >
                        <Pencil />
                        Düzenle
                      </AdminButton>
                      <AdminButton
                        variant="danger"
                        size="sm"
                        onClick={() => confirmDelete(p.id)}
                      >
                        <Trash2 />
                        Sil
                      </AdminButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && sorted.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:hidden">
          {sorted.map((p) => (
            <AdminCard key={p.id} className="flex flex-col gap-4 p-5">
              <div className="flex items-start gap-4">
                {p.image ? (
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="size-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                    <FolderKanban className="size-5" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{p.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.location}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="active">
                      {categoryLabels[toCategory(p.category)]}
                    </Badge>
                    {p.year && (
                      <span className="text-xs text-muted-foreground">
                        {p.year}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleActive(p)}
                  aria-pressed={p.isActive}
                >
                  {p.isActive ? (
                    <Badge variant="active">Aktif</Badge>
                  ) : (
                    <Badge variant="inactive">Pasif</Badge>
                  )}
                </button>
                <div className="flex gap-2">
                  <AdminButton
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(p)}
                  >
                    <Pencil />
                  </AdminButton>
                  <AdminButton
                    variant="danger"
                    size="sm"
                    onClick={() => confirmDelete(p.id)}
                  >
                    <Trash2 />
                  </AdminButton>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 backdrop-blur sm:items-center sm:p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-border bg-card p-6 shadow-2xl sm:rounded-2xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
                  {editing ? "Projeyi Düzenle" : "Yeni Proje"}
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  aria-label="Kapat"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <AdminLabel htmlFor="title">Başlık *</AdminLabel>
                    <AdminInput
                      id="title"
                      required
                      value={form.title}
                      onChange={(e) => update("title", e.target.value)}
                      placeholder="Proje başlığı"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <AdminLabel htmlFor="slug">
                      Slug (boşsa otomatik)
                    </AdminLabel>
                    <AdminInput
                      id="slug"
                      value={form.slug}
                      onChange={(e) => update("slug", e.target.value)}
                      placeholder="otomatik-olusturulur"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <AdminLabel htmlFor="location">Konum *</AdminLabel>
                    <AdminInput
                      id="location"
                      required
                      value={form.location}
                      onChange={(e) => update("location", e.target.value)}
                      placeholder="İl / Ülke"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <AdminLabel htmlFor="category">Kategori</AdminLabel>
                    <AdminSelect
                      id="category"
                      value={form.category}
                      onChange={(e) =>
                        update("category", toCategory(e.target.value))
                      }
                    >
                      <option value="residential">Konut</option>
                      <option value="commercial">Ticari</option>
                      <option value="corporate">Kurumsal</option>
                    </AdminSelect>
                  </div>
                </div>

                <ImageUpload
                  label="Görsel *"
                  value={form.image}
                  onChange={(url) => update("image", url)}
                />

                <div className="flex flex-col gap-2">
                  <AdminLabel htmlFor="description">Açıklama</AdminLabel>
                  <AdminTextarea
                    id="description"
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="Proje hakkında kısa açıklama"
                  />
                </div>

                <GalleryUpload
                  label="Galeri"
                  value={form.gallery}
                  onChange={(urls) => update("gallery", urls)}
                />

                <div className="flex flex-col gap-2">
                  <AdminLabel htmlFor="products">
                    Ürünler (virgülle ayrılmış)
                  </AdminLabel>
                  <AdminInput
                    id="products"
                    value={form.products}
                    onChange={(e) => update("products", e.target.value)}
                    placeholder="Pencere, Kapı, Siperlik"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-2">
                    <AdminLabel htmlFor="year">Yıl</AdminLabel>
                    <AdminInput
                      id="year"
                      value={form.year}
                      onChange={(e) => update("year", e.target.value)}
                      placeholder="2025"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <AdminLabel htmlFor="area">Alan</AdminLabel>
                    <AdminInput
                      id="area"
                      value={form.area}
                      onChange={(e) => update("area", e.target.value)}
                      placeholder="1.200 m²"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <AdminLabel htmlFor="client">Müşteri</AdminLabel>
                    <AdminInput
                      id="client"
                      value={form.client}
                      onChange={(e) => update("client", e.target.value)}
                      placeholder="Müşteri adı"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <AdminLabel htmlFor="order">Sıra</AdminLabel>
                    <AdminInput
                      id="order"
                      type="number"
                      value={form.order}
                      onChange={(e) => update("order", e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-end gap-3 pb-1">
                    <AdminCheckbox
                      id="isActive"
                      checked={form.isActive}
                      onChange={(e) => update("isActive", e.target.checked)}
                    />
                    <AdminLabel htmlFor="isActive" className="text-foreground">
                      Yayında
                    </AdminLabel>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-end gap-3">
                  <AdminButton
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    İptal
                  </AdminButton>
                  <AdminButton type="submit" variant="primary" disabled={saving}>
                    <Check />
                    {saving ? "Kaydediliyor..." : "Kaydet"}
                  </AdminButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmId && deleteTarget && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={cancelDelete}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-background/70 p-4 backdrop-blur"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center shadow-2xl"
            >
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                <Trash2 className="size-5" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                Projeyi Sil
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {deleteTarget.title}
                </span>{" "}
                projesini silmek istediğinize emin misiniz?
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <AdminButton
                  variant="outline"
                  onClick={cancelDelete}
                  disabled={!!deletingId}
                >
                  Vazgeç
                </AdminButton>
                <AdminButton
                  variant="danger"
                  onClick={handleDelete}
                  disabled={!!deletingId}
                >
                  {deletingId ? "Siliniyor..." : "Sil"}
                </AdminButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed bottom-6 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-xl backdrop-blur",
              toast.type === "success"
                ? "border-primary/30 bg-primary/15 text-primary"
                : "border-destructive/30 bg-destructive/15 text-destructive",
            )}
          >
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded-full",
                toast.type === "success"
                  ? "bg-primary/20"
                  : "bg-destructive/20",
              )}
            >
              {toast.type === "success" ? (
                <Check className="size-3.5" />
              ) : (
                <X className="size-3.5" />
              )}
            </span>
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
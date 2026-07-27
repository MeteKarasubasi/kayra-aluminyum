"use client"

import { useEffect, useState, type FormEvent } from "react"
import { motion } from "motion/react"
import { AlertCircle, Check, Loader2, Save } from "lucide-react"
import {
  AdminCard,
  AdminButton,
  AdminInput,
  AdminLabel,
  AdminTextarea,
} from "@/components/admin/ui"
import { ImageUpload } from "@/components/admin/image-upload"

type Setting = { id: string; key: string; value: string }

const SECTIONS: {
  title: string
  fields: { key: string; label: string; type?: string; multiline?: boolean }[]
}[] = [
  {
    title: "Marka & Logo",
    fields: [
      { key: "logo_url", label: "Logo Görseli (isteğe bağlı)", type: "url" },
      { key: "logo_text", label: "Logo Metni (üst satır)" },
      { key: "logo_subtext", label: "Logo Alt Metni" },
    ],
  },
  {
    title: "İletişim Bilgileri",
    fields: [
      { key: "email", label: "E-posta", type: "email" },
      { key: "phone", label: "Telefon", type: "tel" },
      { key: "phone2", label: "2. Telefon", type: "tel" },
      { key: "whatsapp", label: "WhatsApp", type: "tel" },
      { key: "address_tr", label: "Adres (TR)", multiline: true },
      { key: "address_en", label: "Adres (EN)", multiline: true },
      { key: "google_maps_link", label: "Google Harita Bağlantısı", type: "url" },
    ],
  },
  {
    title: "Sosyal Medya",
    fields: [
      { key: "instagram", label: "Instagram", type: "url" },
      { key: "facebook", label: "Facebook", type: "url" },
      { key: "youtube", label: "YouTube", type: "url" },
      { key: "linkedin", label: "LinkedIn", type: "url" },
    ],
  },
  {
    title: "Çalışma Saatleri",
    fields: [
      { key: "hours_tr", label: "Çalışma Saatleri (TR)" },
      { key: "hours_en", label: "Çalışma Saatleri (EN)" },
    ],
  },
  {
    title: "Genel & SEO",
    fields: [
      { key: "site_title", label: "Site Başlığı" },
      { key: "slogan", label: "Slogan" },
      { key: "seo_description", label: "SEO Açıklaması", multiline: true },
    ],
  },
]

const IMAGE_FIELDS = new Set(["logo_url"])

export function SettingsManager() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<
    { type: "success" | "error"; message: string } | null
  >(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const res = await fetch("/api/admin/settings", { cache: "no-store" })
        const data: Setting[] = await res.json()
        if (cancelled) return
        const map: Record<string, string> = {}
        for (const s of Array.isArray(data) ? data : []) {
          map[s.key] = s.value
        }
        setValues(map)
      } catch {
        if (!cancelled)
          setFeedback({ type: "error", message: "Ayarlar yüklenemedi." })
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setFeedback(null)
    try {
      const allFields = SECTIONS.flatMap((s) => s.fields)
      const settings = allFields.map((k) => ({
        key: k.key,
        value: values[k.key] ?? "",
      }))
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setFeedback({
          type: "error",
          message: data?.error ?? "Kaydetme başarısız.",
        })
        return
      }
      const data: Setting[] = await res.json()
      const map: Record<string, string> = {}
      for (const s of Array.isArray(data) ? data : []) map[s.key] = s.value
      setValues(map)
      setFeedback({ type: "success", message: "Ayarlar kaydedildi." })
    } catch {
      setFeedback({
        type: "error",
        message: "Sunucuyla bağlantı kurulamadı.",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <AdminCard>
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
              Yükleniyor...
            </div>
          ) : (
            <form onSubmit={handleSave} className="flex flex-col gap-5">
              {SECTIONS.map((section) => {
                return (
                  <div key={section.title}>
                    <h3 className="font-display text-lg font-bold text-foreground mt-6 mb-3">
                      {section.title}
                    </h3>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      {section.fields.map((k) => {
                        if (IMAGE_FIELDS.has(k.key)) {
                          return (
                            <div key={k.key} className="sm:col-span-2">
                              <AdminLabel className="mb-2 block">
                                {k.label}
                              </AdminLabel>
                              <ImageUpload
                                value={values[k.key] ?? ""}
                                onChange={(url) =>
                                  setValues((prev) => ({
                                    ...prev,
                                    [k.key]: url,
                                  }))
                                }
                                aspect="aspect-[4/2] w-40"
                              />
                              <p className="mt-1 text-xs text-muted-foreground/70">
                                Boş bırakırsanız varsayılan SVG logo kullanılır.
                              </p>
                            </div>
                          )
                        }
                        return (
                          <div
                            key={k.key}
                            className={k.multiline ? "sm:col-span-2" : ""}
                          >
                            <AdminLabel htmlFor={k.key} className="mb-2 block">
                              {k.label}
                            </AdminLabel>
                            {k.multiline ? (
                              <AdminTextarea
                                id={k.key}
                                rows={3}
                                value={values[k.key] ?? ""}
                                onChange={(e) =>
                                  setValues((prev) => ({
                                    ...prev,
                                    [k.key]: e.target.value,
                                  }))
                                }
                              />
                            ) : (
                              <AdminInput
                                id={k.key}
                                type={k.type ?? "text"}
                                value={values[k.key] ?? ""}
                                onChange={(e) =>
                                  setValues((prev) => ({
                                    ...prev,
                                    [k.key]: e.target.value,
                                  }))
                                }
                              />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={
                    feedback.type === "success"
                      ? "flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2.5 text-sm text-primary"
                      : "flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
                  }
                >
                  {feedback.type === "success" ? (
                    <Check className="size-4 shrink-0" />
                  ) : (
                    <AlertCircle className="size-4 shrink-0" />
                  )}
                  <span>{feedback.message}</span>
                </motion.div>
              )}

              <div className="flex justify-end">
                <AdminButton type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <Save className="size-4" />
                      Kaydet
                    </>
                  )}
                </AdminButton>
              </div>
            </form>
          )}
        </AdminCard>
      </motion.div>
    </div>
  )
}
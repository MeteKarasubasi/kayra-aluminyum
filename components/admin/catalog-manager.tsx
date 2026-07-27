"use client"

import { useEffect, useState, type FormEvent } from "react"
import { motion } from "motion/react"
import {
  AlertCircle,
  Check,
  ExternalLink,
  FileText,
  Loader2,
  Save,
} from "lucide-react"
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
} from "@/components/admin/ui"
import { FileUpload } from "@/components/admin/file-upload"
import { PdfFlipbook } from "@/components/catalog/pdf-flipbook"

type Setting = { id: string; key: string; value: string }

export function CatalogManager() {
  const [pdfUrl, setPdfUrl] = useState("")
  const [initialUrl, setInitialUrl] = useState("")
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
        const row = Array.isArray(data)
          ? data.find((s) => s.key === "catalog_pdf_url")
          : undefined
        setPdfUrl(row?.value ?? "")
        setInitialUrl(row?.value ?? "")
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
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: [{ key: "catalog_pdf_url", value: pdfUrl }],
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setFeedback({
          type: "error",
          message: data?.error ?? "Kaydetme başarısız.",
        })
        return
      }
      setInitialUrl(pdfUrl)
      setFeedback({ type: "success", message: "Katalog PDF kaydedildi." })
    } catch {
      setFeedback({
        type: "error",
        message: "Sunucuyla bağlantı kurulamadı.",
      })
    } finally {
      setSaving(false)
    }
  }

  const dirty = pdfUrl !== initialUrl

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Katalog"
        description="/katalog sayfasında gösterilen PDF kataloğunu yönetin"
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl"
      >
        <AdminCard>
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
              Yükleniyor...
            </div>
          ) : (
            <form onSubmit={handleSave} className="flex flex-col gap-5">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  Katalog PDF Dosyası
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Yüklediğiniz PDF, katalog sayfasında kaydırmalı kartların
                  altındaki özel görüntüleyicide gösterilir. Boş bırakırsanız
                  bu bölüm sitede görünmez.
                </p>
              </div>

              <FileUpload
                value={pdfUrl}
                onChange={setPdfUrl}
                accept="application/pdf"
                hint="PDF · maks 100MB"
              />

              {pdfUrl && (
                <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="size-4 shrink-0 text-primary" />
                      <span className="truncate font-mono text-xs">
                        {pdfUrl}
                      </span>
                    </div>
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      Önizle
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                  <PdfFlipbook pdfUrl={pdfUrl} maxHeight={440} />
                </div>
              )}

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
                <AdminButton type="submit" disabled={saving || !dirty}>
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

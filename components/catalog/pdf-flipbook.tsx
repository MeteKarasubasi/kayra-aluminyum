"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

// Lazy-load pdfjs only on the client to avoid bundling its worker unawareness
// into the server bundle and to keep the initial JS small.
async function loadPdfJs() {
  const mod = await import("pdfjs-dist")
  mod.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"
  return mod
}

type RenderedPage = {
  pageNumber: number
  dataUrl: string
  width: number
  height: number
}

export function PdfFlipbook({
  pdfUrl,
  className,
  maxHeight = 560,
}: {
  pdfUrl: string
  className?: string
  maxHeight?: number
}) {
  const [pdf, setPdf] = useState<{ numPages: number } | null>(null)
  const [pages, setPages] = useState<Map<number, RenderedPage>>(new Map())
  const [current, setCurrent] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [flipping, setFlipping] = useState<null | "next" | "prev">(null)
  const mountRef = useRef<HTMLDivElement>(null)
  const viewportWidth = useRef(640)
  // Keep the loaded PDF document in a ref so we don't re-fetch it per page.
  const docRef = useRef<any>(null)

  // Render target width based on the actual container size.
  useEffect(() => {
    const el = mountRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width
        if (w > 320) viewportWidth.current = Math.floor(w)
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Load PDF document once.
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setPages(new Map())
    setCurrent(1)
    setPdf(null)
    docRef.current = null
    ;(async () => {
      try {
        const pdfjs = await loadPdfJs()
        const res = await fetch(pdfUrl)
        if (!res.ok) throw new Error("PDF alınamadı")
        const data = new Uint8Array(await res.arrayBuffer())
        const doc = await pdfjs.getDocument({ data }).promise
        if (cancelled) {
          await doc.destroy?.()
          return
        }
        docRef.current = doc as unknown as typeof docRef.current
        setPdf({ numPages: doc.numPages })
      } catch (e) {
        if (!cancelled)
          setError(
            e instanceof Error ? e.message : "PDF yüklenirken bir hata oluştu",
          )
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
      void docRef.current?.destroy?.()
      docRef.current = null
    }
  }, [pdfUrl])

  // Render a single page at the current viewport size and cache it.
  const renderPage = useCallback(async (pageNumber: number) => {
    const doc = docRef.current
    if (!doc) return
    try {
      const page = await doc.getPage(pageNumber)
      const target = viewportWidth.current
      const baseViewport = page.getViewport({ scale: 1 })
      const scale = Math.min(2, target / baseViewport.width)
      const viewport = page.getViewport({ scale })
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      canvas.width = Math.floor(viewport.width)
      canvas.height = Math.floor(viewport.height)
      await page.render({ canvas, canvasContext: ctx, viewport }).promise
      const dataUrl = canvas.toDataURL("image/jpeg", 0.82)
      setPages((prev) => {
        const next = new Map(prev)
        next.set(pageNumber, {
          pageNumber,
          dataUrl,
          width: viewport.width,
          height: viewport.height,
        })
        return next
      })
    } catch {
      // ignore render errors for individual pages
    }
  }, [])

  // Render the current page + neighbors lazily.
  useEffect(() => {
    if (!pdf) return
    const toRender = [current, current + 1, current - 1].filter(
      (n) => n >= 1 && n <= pdf.numPages && !pages.has(n),
    )
    toRender.forEach((n) => renderPage(n))
  }, [current, pdf, pages, renderPage])

  const goTo = useCallback(
    (n: number) => {
      if (!pdf) return
      if (n < 1 || n > pdf.numPages) return
      setFlipping(n > current ? "next" : n < current ? "prev" : null)
      window.setTimeout(() => {
        setCurrent(n)
        setFlipping(null)
      }, 240)
    },
    [pdf, current],
  )

  const active = pages.get(current)

  return (
    <div
      ref={mountRef}
      className={cn(
        "relative flex w-full flex-col gap-4 rounded-2xl border border-border bg-muted/20 p-4",
        className,
      )}
    >
      {loading && (
        <div className="flex h-[360px] items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          PDF sayfaları hazırlanıyor...
        </div>
      )}

      {error && (
        <div className="flex h-[360px] items-center justify-center px-6 text-center text-sm text-destructive">
          {error}
        </div>
      )}

      {!loading && !error && pdf && (
        <>
          {/* page stage */}
          <div
            className="relative mx-auto w-full max-w-xl"
            style={{ minHeight: 200 }}
          >
            <AnimatePresence mode="wait" custom={flipping}>
              <motion.div
                key={current}
                initial={{
                  rotateY: flipping === "next" ? 18 : flipping === "prev" ? -18 : 0,
                  opacity: 0,
                  x: flipping === "next" ? 60 : flipping === "prev" ? -60 : 0,
                }}
                animate={{ rotateY: 0, opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: flipping === "prev" ? 60 : -60 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  perspective: 1200,
                  transformStyle: "preserve-3d",
                }}
                className="relative overflow-hidden rounded-lg border border-border bg-white shadow-2xl"
              >
                {active ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={active.dataUrl}
                    alt={`Sayfa ${current}`}
                    className="block h-auto w-full"
                    style={{ maxHeight, objectFit: "contain" }}
                  />
                ) : (
                  <div className="flex h-[420px] items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-5 animate-spin" />
                    Sayfa render ediliyor...
                  </div>
                )}
                {/* paper edge glow */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-black/5"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* navigation + thumbnails */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => goTo(current - 1)}
                disabled={current <= 1}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 transition hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
                aria-label="Önceki sayfa"
              >
                <ChevronLeft className="size-5" />
              </button>
              <span className="text-sm font-semibold text-muted-foreground tabular-nums">
                {current} / {pdf.numPages}
              </span>
              <button
                type="button"
                onClick={() => goTo(current + 1)}
                disabled={current >= pdf.numPages}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 transition hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
                aria-label="Sonraki sayfa"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            {/* thumbnail strip — virtualized, only render visible region */}
            <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {Array.from({ length: pdf.numPages }, (_, i) => i + 1).map((n) => {
                const page = pages.get(n)
                const isActive = n === current
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => goTo(n)}
                    className={cn(
                      "relative size-14 shrink-0 overflow-hidden rounded-md border bg-white transition",
                      isActive
                        ? "border-primary ring-2 ring-primary/40"
                        : "border-border hover:border-primary/50",
                    )}
                    aria-label={`Sayfa ${n}`}
                  >
                    {page ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={page.dataUrl}
                        alt={`Sayfa ${n}`}
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center text-[10px] font-semibold text-muted-foreground">
                        {n}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
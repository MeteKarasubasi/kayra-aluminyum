"use client"

import { motion } from "motion/react"
import { Download, ExternalLink, FileText } from "lucide-react"
import { useLang } from "@/lib/i18n"
import { useSettings } from "@/lib/use-settings"
import { SectionHeading, Reveal } from "@/components/reveal"
import { PdfFlipbook } from "@/components/catalog/pdf-flipbook"

/**
 * Innovative PDF showcase rendered below the swipe deck on /katalog.
 * The PDF is uploaded from the admin panel (Site Ayarları → Katalog).
 * Renders nothing until a PDF URL is set.
 */
export function CatalogPdfSection() {
  const { t } = useLang()
  const { settings, loading } = useSettings()
  const pdfUrl = settings.catalog_pdf_url?.trim()

  if (loading || !pdfUrl) return null

  return (
    <section className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[380px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.148 62) 0%, transparent 70%)",
        }}
      />

      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          tag={t("catalog.tag")}
          title={t("catalog.pdf.title")}
          desc={t("catalog.pdf.desc")}
        />
        <Reveal index={2}>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
            >
              {t("catalog.pdf.open")}
              <ExternalLink className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a
              href={pdfUrl}
              download
              className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
            >
              {t("catalog.pdf.download")}
              <Download className="size-4 transition-transform group-hover:translate-y-0.5" />
            </a>
          </div>
        </Reveal>
      </div>

      {/* stacked-paper document preview */}
      <Reveal index={3}>
        <div className="relative mx-auto mt-12 max-w-4xl">
          {/* back paper layers */}
          <div
            aria-hidden
            className="absolute inset-x-4 -bottom-3 h-full rotate-[1.2deg] rounded-3xl border border-border/70 bg-card/50"
          />
          <div
            aria-hidden
            className="absolute inset-x-8 -bottom-6 h-full -rotate-[1.6deg] rounded-3xl border border-border/40 bg-card/30"
          />

          {/* main window */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative overflow-hidden rounded-3xl border border-border bg-card/80 shadow-2xl backdrop-blur"
          >
            {/* window chrome */}
            <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-5 py-3.5">
              <div className="flex gap-1.5">
                <span className="size-3 rounded-full bg-destructive/70" />
                <span className="size-3 rounded-full bg-primary/70" />
                <span className="size-3 rounded-full bg-emerald-500/70" />
              </div>
              <div className="flex min-w-0 flex-1 items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
                <FileText className="size-3.5 shrink-0 text-primary" />
                <span className="truncate font-mono">KATALOG</span>
              </div>
              <span className="hidden rounded-full border border-border px-2.5 py-0.5 text-[10px] font-semibold tracking-widest text-muted-foreground sm:block">
                PDF
              </span>
            </div>

            {/* page-by-page flipbook viewer */}
            <PdfFlipbook pdfUrl={pdfUrl} />
          </motion.div>
        </div>
      </Reveal>
    </section>
  )
}

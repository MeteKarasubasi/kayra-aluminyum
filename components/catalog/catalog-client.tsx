"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { MousePointerClick } from "lucide-react"
import { CatalogDeck } from "./catalog-deck"
import { CatalogPdfSection } from "./catalog-pdf-section"
import { Spinner } from "@/components/spinner"
import { SectionHeading } from "@/components/reveal"
import { products } from "@/lib/data"
import { useLang } from "@/lib/i18n"

export function CatalogClient() {
  const { t } = useLang()
  const [ready, setReady] = useState(false)

  // Preload deck imagery so the first swipe is buttery-smooth.
  useEffect(() => {
    let cancelled = false
    let loaded = 0
    const total = products.length
    const done = () => {
      loaded += 1
      if (loaded >= total && !cancelled) {
        // small min-delay so the branded spinner reads intentionally
        setTimeout(() => !cancelled && setReady(true), 450)
      }
    }
    products.forEach((p) => {
      const img = new window.Image()
      img.onload = done
      img.onerror = done
      img.src = p.image
    })
    // safety fallback
    const fallback = setTimeout(() => !cancelled && setReady(true), 2500)
    return () => {
      cancelled = true
      clearTimeout(fallback)
    }
  }, [])

  return (
    <>
      <section className="relative min-h-screen overflow-hidden pt-28 pb-20">
        {/* ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-40 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.78 0.148 62) 0%, transparent 70%)" }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading tag={t("catalog.tag")} title={t("catalog.title")} desc={t("catalog.desc")} center />
        </div>

        <div className="relative mt-14">
          <AnimatePresence mode="wait">
            {!ready ? (
              <motion.div
                key="loader"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex min-h-[520px] flex-col items-center justify-center gap-6"
              >
                <Spinner size={56} />
                <motion.span
                  className="font-display text-sm tracking-[0.3em] text-muted-foreground"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY }}
                >
                  KATALOG YÜKLENİYOR
                </motion.span>
              </motion.div>
            ) : (
              <motion.div
                key="deck"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <CatalogDeck />
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 flex items-center justify-center gap-2 text-xs tracking-wide text-muted-foreground"
                >
                  <MousePointerClick className="h-4 w-4 text-primary" />
                  {t("catalog.hint")}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Admin-panel PDF showcase below the swipe deck */}
      {ready && <CatalogPdfSection />}
    </>
  )
}

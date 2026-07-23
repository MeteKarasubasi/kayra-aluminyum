"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { useLang } from "@/lib/i18n"

const stats = [
  { value: "850+", key: "hero.stat1" as const },
  { value: "22", key: "hero.stat2" as const },
  { value: "140+", key: "hero.stat3" as const },
]

export function Hero() {
  const { t } = useLang()

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Background image */}
      <motion.div
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 -z-20 will-transform"
      >
        <img
          src="/hero-facade.png"
          alt="Modern alüminyum ve cam cepheli lüks villa"
          className="h-full w-full object-cover"
        />
      </motion.div>
      {/* Overlays */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/85 to-background/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-transparent to-background/60" />

      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 pt-28 pb-16 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-8">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-1.5 text-xs font-semibold tracking-[0.25em] text-primary backdrop-blur"
          >
            {t("hero.tag")}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-3xl text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            {t("hero.title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {t("hero.desc")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/urunler"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
            >
              {t("hero.cta1")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/katalog"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:border-primary"
            >
              {t("hero.cta2")}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="grid grid-cols-3 gap-4 self-end lg:col-span-4 lg:grid-cols-1 lg:gap-0"
        >
          {stats.map((s, i) => (
            <div
              key={s.key}
              className="border-border py-4 lg:border-t lg:first:border-t-0 lg:py-5"
            >
              <div className="font-display text-3xl font-bold text-primary sm:text-4xl">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{t(s.key)}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        aria-hidden
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-border p-1">
          <span className="h-2 w-1 rounded-full bg-primary" />
        </div>
      </motion.div>
    </section>
  )
}

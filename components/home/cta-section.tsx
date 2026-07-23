"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight } from "lucide-react"
import { useLang } from "@/lib/i18n"
import { LogoMark } from "@/components/logo"

export function CtaSection() {
  const { t } = useLang()

  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-16 text-center sm:px-12"
      >
        <div className="grain pointer-events-none absolute inset-0 opacity-40" />
        <LogoMark className="mx-auto mb-6 h-12 w-12 opacity-90" />
        <h2 className="mx-auto max-w-2xl text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {t("cta.title")}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-pretty text-muted-foreground">{t("cta.desc")}</p>
        <Link
          href="/iletisim"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
        >
          {t("cta.button")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </section>
  )
}

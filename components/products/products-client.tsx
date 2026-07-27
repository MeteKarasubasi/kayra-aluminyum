"use client"

import { motion } from "motion/react"
import { ArrowUpRight, Check } from "lucide-react"
import Link from "next/link"
import { products as staticProducts, type Product } from "@/lib/data"
import { useLang } from "@/lib/i18n"
import { Reveal } from "@/components/reveal"

export function ProductsClient({ products = staticProducts }: { products?: Product[] }) {
  const { t } = useLang()

  return (
    <main className="pt-28">
      {/* Header */}
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <Reveal>
            <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              <span className="h-px w-8 bg-primary" />
              {t("nav.products")}
            </p>
          </Reveal>
          <Reveal index={1}>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              {t("products.heading")}
            </h1>
          </Reveal>
          <Reveal index={2}>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t("products.sub")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Product rows */}
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <div className="flex flex-col gap-24">
          {products.map((p, i) => {
            const reversed = i % 2 === 1
            return (
              <section
                key={p.slug}
                id={p.slug}
                className="scroll-mt-28 grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                <Reveal className={reversed ? "lg:order-2" : ""}>
                  <div className="group relative overflow-hidden rounded-3xl border border-border shadow-2xl shadow-black/30">
                    <motion.img
                      src={p.image || "/placeholder.svg"}
                      alt={t(p.titleKey)}
                      className="aspect-[4/3] w-full object-cover"
                      initial={{ scale: 1.08 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <span className="absolute left-5 top-5 rounded-full bg-background/70 px-3 py-1 font-display text-xs font-semibold tracking-wider text-primary backdrop-blur">
                      {p.code}
                    </span>
                  </div>
                </Reveal>

                <div className={reversed ? "lg:order-1" : ""}>
                  <Reveal index={1}>
                    <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                      {t(p.titleKey)}
                    </h2>
                  </Reveal>
                  <Reveal index={2}>
                    <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                      {t(p.descKey)}
                    </p>
                  </Reveal>
                  <Reveal index={3}>
                    <ul className="mt-6 flex flex-col gap-3">
                      {[t("feature.1"), t("feature.2"), t("feature.3")].map((f) => (
                        <li key={f} className="flex items-center gap-3 text-foreground">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                  <Reveal index={4}>
                    <Link
                      href="/iletisim"
                      className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
                    >
                      {t("cta.quote")}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </Reveal>
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </main>
  )
}

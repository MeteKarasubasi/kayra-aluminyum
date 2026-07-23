"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Plus } from "lucide-react"
import { useLang } from "@/lib/i18n"
import type { Product } from "@/lib/data"

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { t } = useLang()

  return (
    <motion.div
      id={product.slug}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.08 }}
      className="scroll-mt-24"
    >
      <Link
        href={`/urunler#${product.slug}`}
        className="group relative block overflow-hidden rounded-2xl border border-border bg-card"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={product.image || "/placeholder.svg"}
            alt={t(product.titleKey)}
            className="h-full w-full object-cover transition-transform duration-700 ease-out will-transform group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-background/70 px-3 py-1 font-display text-xs font-semibold tracking-wider text-primary backdrop-blur">
            {product.code}
          </span>
          <span className="absolute bottom-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 group-hover:rotate-90">
            <Plus className="h-5 w-5" />
          </span>
        </div>
        <div className="p-5">
          <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
            {t(product.titleKey)}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(product.descKey)}</p>
        </div>
      </Link>
    </motion.div>
  )
}

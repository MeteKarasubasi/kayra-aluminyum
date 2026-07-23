"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence, type PanInfo } from "motion/react"
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"
import { products } from "@/lib/data"
import { useLang } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const SWIPE_THRESHOLD = 90

export function CatalogDeck() {
  const { t } = useLang()
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState(0)
  const count = products.length

  const go = useCallback(
    (delta: number) => {
      setDir(delta)
      setActive((prev) => (prev + delta + count) % count)
    },
    [count],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1)
      if (e.key === "ArrowLeft") go(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [go])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -500) go(1)
    else if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 500) go(-1)
  }

  // relative position of a card to the active one, wrapped to [-half, half]
  const relative = (i: number) => {
    let d = i - active
    const half = Math.floor(count / 2)
    if (d > half) d -= count
    if (d < -half) d += count
    return d
  }

  const activeProduct = products[active]

  return (
    <div className="flex flex-col items-center">
      {/* Stage */}
      <div
        className="relative flex h-[440px] w-full items-center justify-center sm:h-[520px]"
        style={{ perspective: 1400 }}
      >
        {products.map((p, i) => {
          const pos = relative(i)
          const abs = Math.abs(pos)
          const isActive = pos === 0
          // hide cards far away
          const hidden = abs > 2
          return (
            <motion.div
              key={p.slug}
              className="absolute h-full w-[280px] will-change-transform sm:w-[340px]"
              style={{ transformStyle: "preserve-3d" }}
              animate={{
                x: pos * 150,
                scale: isActive ? 1 : 0.86 - (abs - 1) * 0.06,
                rotateY: pos * -18,
                opacity: hidden ? 0 : 1,
                zIndex: 50 - abs,
                filter: isActive ? "brightness(1)" : "brightness(0.55)",
              }}
              transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.7 }}
              drag={isActive ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.5}
              onDragEnd={isActive ? onDragEnd : undefined}
              onClick={() => !isActive && !hidden && go(pos > 0 ? 1 : -1)}
              whileTap={isActive ? { cursor: "grabbing" } : undefined}
            >
              <DeckCard product={p} interactive={isActive} />
            </motion.div>
          )
        })}
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center gap-6">
        <button
          type="button"
          onClick={() => go(-1)}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/60 text-foreground backdrop-blur transition-all hover:border-primary hover:text-primary active:scale-90"
          aria-label="Önceki"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Page counter */}
        <div className="flex min-w-[120px] items-center justify-center gap-2 text-sm font-semibold tracking-widest text-muted-foreground">
          <span className="font-display text-2xl text-primary tabular-nums">
            {String(active + 1).padStart(2, "0")}
          </span>
          <span className="text-muted-foreground/50">/</span>
          <span className="tabular-nums">{String(count).padStart(2, "0")}</span>
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/60 text-foreground backdrop-blur transition-all hover:border-primary hover:text-primary active:scale-90"
          aria-label="Sonraki"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {/* Dots */}
      <div className="mt-6 flex items-center gap-2">
        {products.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => {
              setDir(i > active ? 1 : -1)
              setActive(i)
            }}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === active ? "w-8 bg-primary" : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground",
            )}
            aria-label={`${t("catalog.page")} ${i + 1}`}
          />
        ))}
      </div>

      {/* Active title / CTA (animated) */}
      <div className="mt-10 h-24 text-center">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={activeProduct.slug}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              {t(activeProduct.titleKey)}
            </h3>
            <Link
              href={`/urunler#${activeProduct.slug}`}
              className="group mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
            >
              {t("catalog.explore")}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function DeckCard({ product, interactive }: { product: (typeof products)[number]; interactive: boolean }) {
  const { t } = useLang()
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-black/40",
        interactive ? "cursor-grab" : "cursor-pointer",
      )}
    >
      <img
        src={product.image || "/placeholder.svg"}
        alt={t(product.titleKey)}
        className="pointer-events-none h-full w-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      <span className="absolute left-5 top-5 rounded-full bg-background/70 px-3 py-1 font-display text-xs font-semibold tracking-wider text-primary backdrop-blur">
        {product.code}
      </span>
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h4 className="font-display text-xl font-bold leading-tight tracking-tight text-foreground">
          {t(product.titleKey)}
        </h4>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {t(product.descKey)}
        </p>
      </div>
    </div>
  )
}

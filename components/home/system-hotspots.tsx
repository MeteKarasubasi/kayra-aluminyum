"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import { ArrowRight, MousePointer2 } from "lucide-react"
import { useLang } from "@/lib/i18n"
import type { Product } from "@/lib/data"
import { cn } from "@/lib/utils"

/**
 * Interactive hotspot map shown above the "Sistem Çözümlerimiz" heading.
 * Glowing points sit on top of the villa render; hovering (desktop) or
 * tapping (mobile) opens a bubble with the product image, description
 * and a link to the product page.
 */

type Hotspot = {
  slug: string
  /** percentage from left */
  x: number
  /** percentage from top */
  y: number
}

const HOTSPOTS: Hotspot[] = [
  { slug: "kis-bahcesi", x: 33, y: 58 },
  { slug: "aluminyum-dograma", x: 29, y: 32 },
  { slug: "bioklimatik-pergola", x: 54, y: 11 },
  { slug: "cam-balkon", x: 63, y: 36 },
  { slug: "giydirme-cephe", x: 91, y: 42 },
  { slug: "korkuluk", x: 52, y: 80 },
]

export function SystemHotspots({ products }: { products: Product[] }) {
  const { t } = useLang()
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close the bubble when clicking outside (mobile tap UX)
  useEffect(() => {
    if (!activeSlug) return
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveSlug(null)
      }
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [activeSlug])

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      {/* Outer wrapper stays overflow-visible so open bubbles may extend
          beyond the photo frame. Only the image itself is clipped. */}
      <div ref={containerRef} className="relative">
        {/* clipped image layer (rounded corners + vignette + hint chip) */}
        <div className="relative overflow-hidden rounded-3xl border border-border shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/system-solutions.jpeg"
            alt={t("products.title")}
            className="block h-auto w-full select-none"
            draggable={false}
          />

          {/* subtle vignette so hotspots pop */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 45%, transparent 60%, rgb(0 0 0 / 0.25) 100%)",
            }}
          />

          {/* hint chip */}
          <div className="pointer-events-none absolute bottom-3 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-black/45 px-4 py-1.5 text-[11px] font-medium tracking-wide text-white/90 backdrop-blur-md sm:flex">
            <MousePointer2 className="size-3.5 text-primary" />
            <span className="hidden md:inline">{t("hotspots.hint")}</span>
            <span className="md:hidden">{t("hotspots.tap")}</span>
          </div>
        </div>

        {/* hotspot layer — NOT clipped, bubbles can overflow the frame.
            The active point's wrapper jumps to z-30 so its bubble always
            paints above every other point. */}
        <div className="absolute inset-0">
          {HOTSPOTS.map((h, i) => {
            const product = products.find((p) => p.slug === h.slug)
            if (!product) return null
            const isActive = activeSlug === h.slug
            return (
              <div
                key={h.slug}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2",
                  isActive ? "z-30" : "z-10",
                )}
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
              >
                <HotspotPoint
                  spot={h}
                  product={product}
                  index={i}
                  active={isActive}
                  onToggle={() =>
                    setActiveSlug((cur) => (cur === h.slug ? null : h.slug))
                  }
                  onHover={(v) =>
                    setActiveSlug((cur) =>
                      v ? h.slug : cur === h.slug ? null : cur,
                    )
                  }
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function HotspotPoint({
  spot,
  product,
  index,
  active,
  onToggle,
  onHover,
}: {
  spot: Hotspot
  product: Product
  index: number
  active: boolean
  onToggle: () => void
  onHover: (v: boolean) => void
}) {
  const { t } = useLang()

  // Hover-intent: delay closing briefly so the pointer can cross the gap
  // between the dot and the bubble without the bubble unmounting first.
  const closeTimer = useRef<number | undefined>(undefined)
  useEffect(
    () => () => {
      window.clearTimeout(closeTimer.current)
    },
    [],
  )
  const open = () => {
    window.clearTimeout(closeTimer.current)
    onHover(true)
  }
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => onHover(false), 140)
  }

  // Bubble placement: open upwards by default, downwards if the point is
  // near the top; horizontally centered, clamped near the edges.
  // The pt-4/pb-4 padding is an invisible hover bridge so the pointer can
  // travel from the dot to the bubble without closing it.
  const openDown = spot.y < 30
  const clampLeft = spot.x < 22
  const clampRight = spot.x > 78

  const bubblePos = cn(
    "absolute z-20 w-52 sm:w-72",
    openDown ? "top-full pt-4" : "bottom-full pb-4",
    clampLeft
      ? "left-0"
      : clampRight
        ? "right-0"
        : "left-1/2 -translate-x-1/2",
  )

  const caretPos = cn(
    "absolute size-3 rotate-45 border-border bg-card",
    openDown
      ? "-top-1.5 border-l border-t"
      : "-bottom-1.5 border-b border-r",
    clampLeft
      ? "left-4"
      : clampRight
        ? "right-4"
        : "left-1/2 -translate-x-1/2",
  )

  return (
    <>
      {/* the glowing point */}
      <button
        type="button"
        aria-label={t(product.titleKey)}
        aria-expanded={active}
        onClick={onToggle}
        onMouseEnter={open}
        onMouseLeave={scheduleClose}
        className="group relative outline-none"
      >
        {/* soft halo */}
        <motion.span
          aria-hidden
          className="absolute left-1/2 top-1/2 -z-10 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40 blur-md"
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.25, 1] }}
          transition={{
            duration: 2.4,
            repeat: Number.POSITIVE_INFINITY,
            delay: index * 0.35,
            ease: "easeInOut",
          }}
        />
        {/* expanding ping ring */}
        <motion.span
          aria-hidden
          className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/80"
          animate={{ scale: [1, 2.6], opacity: [0.9, 0] }}
          transition={{
            duration: 1.8,
            repeat: Number.POSITIVE_INFINITY,
            delay: index * 0.35,
            ease: "easeOut",
          }}
        />
        {/* core dot */}
        <span
          className={cn(
            "block size-4 rounded-full bg-primary ring-4 ring-primary/30 transition-all duration-300",
            "shadow-[0_0_18px_4px_oklch(0.78_0.148_62/0.9)]",
            "group-hover:scale-125 group-hover:ring-primary/50 group-focus-visible:scale-125",
            active && "scale-125 ring-primary/60",
          )}
        />
      </button>

      {/* bubble */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="bubble"
            initial={{ opacity: 0, scale: 0.85, y: openDown ? -8 : 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: openDown ? -6 : 6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: openDown ? "top center" : "bottom center" }}
            className={bubblePos}
            onMouseEnter={open}
            onMouseLeave={scheduleClose}
          >
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card/95 shadow-2xl backdrop-blur-xl">
              <span aria-hidden className={caretPos} />
              <div className="relative h-32 w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={t(product.titleKey)}
                  className="size-full object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent"
                />
                <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-widest text-primary backdrop-blur">
                  {product.code}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-sm font-bold text-foreground">
                  {t(product.titleKey)}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {t(product.descKey)}
                </p>
                <Link
                  href={`/urunler#${product.slug}`}
                  className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
                >
                  {t("products.detail")}
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

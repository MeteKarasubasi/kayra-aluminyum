"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SectionHeading } from "@/components/reveal"
import { references as staticReferences, type Reference } from "@/lib/data"
import { useLang } from "@/lib/i18n"

function Row({ items, reverse = false }: { items: Reference[]; reverse?: boolean }) {
  const doubled = [...items, ...items]
  return (
    <div className="group relative flex overflow-hidden">
      <div
        className="flex shrink-0 items-center gap-4 pr-4 will-transform"
        style={{
          animation: `marquee 32s linear infinite${reverse ? " reverse" : ""}`,
        }}
      >
        {doubled.map((ref, i) => (
          <div
            key={`${ref.id}-${i}`}
            className="flex h-20 min-w-[180px] items-center justify-center rounded-xl border border-border bg-white px-6 transition-all duration-300 hover:border-primary/30"
          >
            {ref.logo ? (
              <img
                src={ref.logo}
                alt={ref.name}
                className="h-8 w-8 object-contain opacity-50 grayscale transition-all duration-300 group-hover:opacity-70"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            ) : (
              <span className="font-display text-lg font-bold tracking-wide text-muted-foreground transition-colors hover:text-primary">
                {ref.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ReferencesSection({ references = staticReferences }: { references?: Reference[] }) {
  const { t } = useLang()
  const mid = Math.ceil(references.length / 2)

  return (
    <section id="referanslar" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading tag={t("refs.tag")} title={t("refs.title")} desc={t("refs.desc")} />
        <Link
          href="/referanslar"
          className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
        >
          {t("projects.all")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-14 flex flex-col gap-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <Row items={references.slice(0, mid)} />
        <Row items={references.slice(mid)} reverse />
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  )
}

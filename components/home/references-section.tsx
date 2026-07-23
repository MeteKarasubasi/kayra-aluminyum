"use client"

import { SectionHeading } from "@/components/reveal"
import { references } from "@/lib/data"
import { useLang } from "@/lib/i18n"

function Row({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items]
  return (
    <div className="group relative flex overflow-hidden">
      <div
        className="flex shrink-0 items-center gap-4 pr-4 will-transform"
        style={{
          animation: `marquee 32s linear infinite${reverse ? " reverse" : ""}`,
        }}
      >
        {doubled.map((name, i) => (
          <div
            key={`${name}-${i}`}
            className="flex h-20 min-w-[180px] items-center justify-center rounded-xl border border-border bg-card/50 px-8"
          >
            <span className="font-display text-lg font-bold tracking-wide text-muted-foreground transition-colors hover:text-primary">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ReferencesSection() {
  const { t } = useLang()
  const mid = Math.ceil(references.length / 2)

  return (
    <section id="referanslar" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading tag={t("refs.tag")} title={t("refs.title")} desc={t("refs.desc")} center />

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

"use client"

import { motion } from "motion/react"
import { useLang } from "@/lib/i18n"
import { Reveal } from "@/components/reveal"
import { references as staticReferences, type Reference } from "@/lib/data"

function ReferenceCard({ ref: reference, index }: { ref: Reference; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: (index % 6) * 0.06 }}
    >
      <a
        href={reference.website || "#"}
        target={reference.website ? "_blank" : undefined}
        rel={reference.website ? "noopener noreferrer" : undefined}
        className="group relative flex aspect-[3/2] flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-white p-6 transition-all duration-500 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        </div>

        {reference.logo ? (
          <div className="relative flex h-16 w-full items-center justify-center">
            <img
              src={reference.logo}
              alt={`${reference.name} logosu`}
              className="max-h-14 max-w-[140px] object-contain opacity-50 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110"
              loading="lazy"
            />
          </div>
        ) : (
          <span className="relative text-center font-display text-sm font-semibold tracking-wide text-muted-foreground transition-colors duration-300 group-hover:text-primary">
            {reference.name}
          </span>
        )}
      </a>
    </motion.div>
  )
}

export function ReferencesPageClient({ references = staticReferences }: { references?: Reference[] }) {
  const { t } = useLang()

  return (
    <main className="pt-28">
      {/* Header */}
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <Reveal>
            <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              <span className="h-px w-8 bg-primary" />
              {t("refs.tag")}
            </p>
          </Reveal>
          <Reveal index={1}>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              {t("refs.page.heading")}
            </h1>
          </Reveal>
          <Reveal index={2}>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t("refs.page.sub")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* References Grid */}
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {references.map((ref, i) => (
            <ReferenceCard key={ref.id} ref={ref} index={i} />
          ))}
        </div>

        {/* Stats */}
        <Reveal>
          <div className="mt-20 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: `${references.length}+`, label: "Kurumsal Referans" },
              { value: "850+", label: "Tamamlanan Proje" },
              { value: "22", label: "Yıllık Tecrübe" },
              { value: "%100", label: "Müşteri Memnuniyeti" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-card/40 p-6 text-center backdrop-blur"
              >
                <div className="font-display text-3xl font-bold text-primary">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </main>
  )
}

"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence, LayoutGroup } from "motion/react"
import { projects as staticProjects, type Project, type ProjectCategory } from "@/lib/data"
import { useLang } from "@/lib/i18n"
import { Reveal } from "@/components/reveal"
import { ProjectCard } from "@/components/project-card"
import { cn } from "@/lib/utils"

type Filter = "all" | ProjectCategory

const filters: { key: Filter; labelKey: Parameters<ReturnType<typeof useLang>["t"]>[0] }[] = [
  { key: "all", labelKey: "projects.filter.all" },
  { key: "residential", labelKey: "projects.filter.residential" },
  { key: "commercial", labelKey: "projects.filter.commercial" },
  { key: "corporate", labelKey: "projects.filter.corporate" },
]

export function ProjectsClient({ projects = staticProjects }: { projects?: Project[] }) {
  const { t } = useLang()
  const [active, setActive] = useState<Filter>("all")

  const visible = useMemo(
    () => (active === "all" ? projects : projects.filter((p) => p.category === active)),
    [active, projects],
  )

  return (
    <main className="pt-28">
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <Reveal>
            <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              <span className="h-px w-8 bg-primary" />
              {t("projects.tag")}
            </p>
          </Reveal>
          <Reveal index={1}>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              {t("projects.heading")}
            </h1>
          </Reveal>
          <Reveal index={2}>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t("projects.sub")}
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        {/* Filters */}
        <div className="mb-10 flex flex-wrap gap-2">
          <LayoutGroup id="filters">
            {filters.map((f) => {
              const isActive = active === f.key
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setActive(f.key)}
                  className={cn(
                    "relative rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                    isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{t(f.labelKey)}</span>
                </button>
              )
            })}
          </LayoutGroup>
        </div>

        {/* Grid */}
        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectCard project={p} categoryLabel={t(`projects.filter.${p.category}`)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  )
}

"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SectionHeading, Reveal } from "@/components/reveal"
import { ProjectCard } from "@/components/project-card"
import { projects } from "@/lib/data"
import { useLang } from "@/lib/i18n"

export function ProjectsSection() {
  const { t } = useLang()
  const featured = projects.slice(0, 4)

  return (
    <section id="projeler" className="border-y border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading tag={t("projects.tag")} title={t("projects.title")} desc={t("projects.desc")} />
          <Reveal index={2}>
            <Link
              href="/projeler"
              className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
            >
              {t("projects.all")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

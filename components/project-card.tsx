"use client"

import { motion } from "motion/react"
import { Search, MapPin } from "lucide-react"
import type { Project } from "@/lib/data"

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.06 }}
      className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-card"
    >
      <img
        src={project.image || "/placeholder.svg"}
        alt={project.title}
        className="h-full w-full object-cover transition-transform duration-700 ease-out will-transform group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />

      <span className="absolute right-4 top-4 inline-flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <Search className="h-4 w-4" />
      </span>

      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-display text-xl font-bold tracking-tight text-foreground">{project.title}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          {project.location}
        </p>
      </div>
    </motion.article>
  )
}

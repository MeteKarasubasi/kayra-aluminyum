"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowLeft, MapPin, Calendar, Maximize2, Building2, Users } from "lucide-react"
import { useLang } from "@/lib/i18n"
import { projects, products } from "@/lib/data"
import { Reveal } from "@/components/reveal"
import { ProjectCard } from "@/components/project-card"

export function ProjectDetailClient({ projectId }: { projectId: string }) {
  const { t } = useLang()
  const project = projects.find((p) => p.id === projectId)

  if (!project) {
    return (
      <main className="flex min-h-screen items-center justify-center pt-28">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold">{t("project.notfound")}</h1>
          <Link
            href="/projeler"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("project.back")}
          </Link>
        </div>
      </main>
    )
  }

  const relatedProducts = products.filter((p) => project.products?.includes(p.slug))
  const otherProjects = projects.filter((p) => p.id !== project.id).slice(0, 3)

  const infoItems = [
    { icon: MapPin, label: t("project.location"), value: project.location },
    { icon: Maximize2, label: t("project.area"), value: project.area },
    { icon: Calendar, label: t("project.year"), value: project.year },
    { icon: Building2, label: t("project.category"), value: t(`projects.filter.${project.category}`) },
    { icon: Users, label: t("project.client"), value: project.client },
  ].filter((item) => item.value)

  return (
    <main className="pt-28">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden sm:h-[60vh]">
        <motion.img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-5 pb-10 sm:pb-14">
          <Reveal>
            <Link
              href="/projeler"
              className="group mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-2 text-sm font-medium text-foreground backdrop-blur transition-colors hover:border-primary hover:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              {t("project.back")}
            </Link>
          </Reveal>
          <Reveal index={1}>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>
          </Reveal>
          <Reveal index={2}>
            <p className="mt-3 flex items-center gap-2 text-lg text-muted-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              {project.location}
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            {project.description && (
              <Reveal>
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight">
                    {t("project.description")}
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                </div>
              </Reveal>
            )}

            {/* Gallery */}
            {project.gallery && project.gallery.length > 0 && (
              <Reveal index={3}>
                <div className="mt-12">
                  <h2 className="mb-6 font-display text-2xl font-bold tracking-tight">
                    {t("project.gallery")}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {project.gallery.map((img, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="group overflow-hidden rounded-2xl border border-border"
                      >
                        <img
                          src={img}
                          alt={`${project.title} - ${i + 1}`}
                          className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {/* Used Products/Systems */}
            {relatedProducts.length > 0 && (
              <Reveal index={4}>
                <div className="mt-12">
                  <h2 className="mb-6 font-display text-2xl font-bold tracking-tight">
                    {t("project.products")}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {relatedProducts.map((product) => (
                      <Link
                        key={product.slug}
                        href={`/urunler#${product.slug}`}
                        className="group flex items-center gap-4 rounded-2xl border border-border bg-card/40 p-4 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:bg-card/70"
                      >
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                          <img
                            src={product.image}
                            alt={t(product.titleKey)}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div>
                          <h3 className="font-display text-sm font-bold text-foreground">
                            {t(product.titleKey)}
                          </h3>
                          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                            {t(product.descKey)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </div>

          {/* Sidebar - Project Info */}
          <div>
            <Reveal>
              <div className="sticky top-24 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur">
                <h2 className="font-display text-lg font-bold tracking-tight">
                  {t("project.info")}
                </h2>
                <div className="mt-5 space-y-4">
                  {infoItems.map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <item.icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-foreground">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/iletisim"
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
                >
                  {t("cta.quote")}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Other Projects */}
        <Reveal>
          <div className="mt-24">
            <h2 className="mb-8 font-display text-2xl font-bold tracking-tight">
              {t("project.others")}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  )
}

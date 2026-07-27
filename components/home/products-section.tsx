"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SectionHeading, Reveal } from "@/components/reveal"
import { ProductCard } from "@/components/product-card"
import { SystemHotspots } from "@/components/home/system-hotspots"
import { products as staticProducts, type Product } from "@/lib/data"
import { useLang } from "@/lib/i18n"

export function ProductsSection({ products = staticProducts }: { products?: Product[] }) {
  const { t } = useLang()

  return (
    <section id="urunler" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      {/* Interactive hotspot render above the heading */}
      <Reveal>
        <SystemHotspots products={products} />
      </Reveal>

      <div className="mt-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading tag={t("products.tag")} title={t("products.title")} desc={t("products.desc")} />
        <Reveal index={2}>
          <Link
            href="/urunler"
            className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
          >
            {t("products.all")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => (
          <ProductCard key={p.slug} product={p} index={i} />
        ))}
      </div>
    </section>
  )
}

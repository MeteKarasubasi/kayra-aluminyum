import { Hero } from "@/components/home/hero"
import { ProductsSection } from "@/components/home/products-section"
import { ProjectsSection } from "@/components/home/projects-section"
import { ReferencesSection } from "@/components/home/references-section"
import { CtaSection } from "@/components/home/cta-section"

export default function Page() {
  return (
    <>
      <Hero />
      <ProductsSection />
      <ProjectsSection />
      <ReferencesSection />
      <CtaSection />
    </>
  )
}

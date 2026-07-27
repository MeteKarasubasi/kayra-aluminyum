import { Hero } from "@/components/home/hero"
import { ProductsSection } from "@/components/home/products-section"
import { ProjectsSection } from "@/components/home/projects-section"
import { ReferencesSection } from "@/components/home/references-section"
import { CtaSection } from "@/components/home/cta-section"
import { getDbProducts, getDbProjects, getDbReferences } from "@/lib/data.server"

export default async function Page() {
  const [products, projects, references] = await Promise.all([
    getDbProducts(),
    getDbProjects(),
    getDbReferences(),
  ])
  return (
    <>
      <Hero />
      <ProductsSection products={products} />
      <ProjectsSection projects={projects} />
      <ReferencesSection references={references} />
      <CtaSection />
    </>
  )
}
import { db } from "./db"
import { products as staticProducts, projects as staticProjects, references as staticReferences, type Product, type Project, type Reference } from "./data"

export async function getDbProducts(): Promise<Product[]> {
  try {
    const rows = await db.product.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    })
    if (rows.length === 0) return staticProducts
    return rows.map((r) => ({
      slug: r.slug,
      titleKey: `prod.${slugToKey(r.slug)}.title` as any,
      descKey: `prod.${slugToKey(r.slug)}.desc` as any,
      image: r.image,
      code: r.code,
    }))
  } catch {
    return staticProducts
  }
}

export async function getDbProjects(): Promise<Project[]> {
  try {
    const rows = await db.project.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    })
    if (rows.length === 0) return staticProjects
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      location: r.location,
      category: r.category as Project["category"],
      image: r.image,
      description: r.description ?? undefined,
      gallery: r.gallery,
      products: r.products,
      area: r.area ?? undefined,
      year: r.year ?? undefined,
      client: r.client ?? undefined,
    }))
  } catch {
    return staticProjects
  }
}

export async function getDbProjectById(id: string): Promise<Project | null> {
  try {
    const r = await db.project.findFirst({
      where: { OR: [{ id }, { slug: id }], isActive: true },
    })
    if (!r) {
      const fallback = staticProjects.find((p) => p.id === id || p.title.toLowerCase().replace(/\s+/g, "-") === id.toLowerCase())
      return fallback ?? null
    }
    return {
      id: r.id,
      title: r.title,
      location: r.location,
      category: r.category as Project["category"],
      image: r.image,
      description: r.description ?? undefined,
      gallery: r.gallery,
      products: r.products,
      area: r.area ?? undefined,
      year: r.year ?? undefined,
      client: r.client ?? undefined,
    }
  } catch {
    const fallback = staticProjects.find((p) => p.id === id)
    return fallback ?? null
  }
}

export async function getDbReferences(): Promise<Reference[]> {
  try {
    const rows = await db.reference.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    })
    if (rows.length === 0) return staticReferences
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      logo: r.logo,
      website: r.website ?? undefined,
    }))
  } catch {
    return staticReferences
  }
}

function slugToKey(slug: string): string {
  const map: Record<string, string> = {
    "kis-bahcesi": "wintergarden",
    "bioklimatik-pergola": "pergola",
    "korkuluk": "railing",
    "cam-balkon": "balcony",
    "giydirme-cephe": "curtainwall",
    "aluminyum-dograma": "joinery",
  }
  return map[slug] ?? slug
}
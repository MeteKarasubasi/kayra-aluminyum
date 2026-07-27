import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { withAuth, logAdminAction } from "@/lib/api-guard"

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")

export async function GET(request: Request) {
  return withAuth(request, async () => {
    const projects = await db.project.findMany({ orderBy: { order: "asc" } })
    return NextResponse.json(projects)
  })
}

export async function POST(request: Request) {
  return withAuth(request, async (admin) => {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    const data = (body ?? {}) as {
      title?: string
      location?: string
      category?: string
      image?: string
      slug?: string
      description?: string
      gallery?: string[]
      products?: string[]
      area?: string
      year?: string
      client?: string
      isActive?: boolean
      order?: number
    }

    if (!data.title || !data.location || !data.category || !data.image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const project = await db.project.create({
      data: {
        title: data.title,
        slug: data.slug || slugify(data.title),
        description: data.description,
        location: data.location,
        category: data.category,
        image: data.image,
        gallery: data.gallery ?? [],
        products: data.products ?? [],
        area: data.area,
        year: data.year,
        client: data.client,
        isActive: data.isActive ?? true,
        order: data.order ?? 0,
      },
    })

    await logAdminAction(admin.adminId, "project.create", project.id, project.title)

    return NextResponse.json(project, { status: 201 })
  })
}
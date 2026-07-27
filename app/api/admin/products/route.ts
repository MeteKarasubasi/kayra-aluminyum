import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { withAuth, logAdminAction } from "@/lib/api-guard"

export async function GET(request: Request) {
  return withAuth(request, async () => {
    const products = await db.product.findMany({ orderBy: { order: "asc" } })
    return NextResponse.json(products)
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
      titleTr?: string
      titleEn?: string
      slug?: string
      image?: string
      code?: string
      descTr?: string
      descEn?: string
      features?: string[]
      isActive?: boolean
      order?: number
    }

    if (!data.titleTr || !data.titleEn || !data.slug || !data.image || !data.code) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const product = await db.product.create({
      data: {
        titleTr: data.titleTr,
        titleEn: data.titleEn,
        slug: data.slug,
        image: data.image,
        code: data.code,
        descTr: data.descTr,
        descEn: data.descEn,
        features: data.features ?? [],
        isActive: data.isActive ?? true,
        order: data.order ?? 0,
      },
    })

    await logAdminAction(admin.adminId, "product.create", product.id, product.titleTr)

    return NextResponse.json(product, { status: 201 })
  })
}
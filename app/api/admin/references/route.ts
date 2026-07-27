import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { withAuth, logAdminAction } from "@/lib/api-guard"

export async function GET(request: Request) {
  return withAuth(request, async () => {
    const references = await db.reference.findMany({ orderBy: { order: "asc" } })
    return NextResponse.json(references)
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
      name?: string
      logo?: string
      website?: string
      isActive?: boolean
      order?: number
    }

    if (!data.name || !data.logo) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const reference = await db.reference.create({
      data: {
        name: data.name,
        logo: data.logo,
        website: data.website,
        isActive: data.isActive ?? true,
        order: data.order ?? 0,
      },
    })

    await logAdminAction(admin.adminId, "reference.create", reference.id, reference.name)

    return NextResponse.json(reference, { status: 201 })
  })
}
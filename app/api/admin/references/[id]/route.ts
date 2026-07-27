import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { withAuth, logAdminAction } from "@/lib/api-guard"

export async function GET(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async () => {
    const { id } = await ctx.params
    const reference = await db.reference.findUnique({ where: { id } })
    if (!reference) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json(reference)
  })
}

export async function PUT(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (admin) => {
    const { id } = await ctx.params
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    const data = (body ?? {}) as Record<string, unknown>

    const reference = await db.reference.update({
      where: { id },
      data: data as Record<string, never>,
    })

    await logAdminAction(admin.adminId, "reference.update", id)

    return NextResponse.json(reference)
  })
}

export async function DELETE(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (admin) => {
    const { id } = await ctx.params
    await db.reference.delete({ where: { id } })
    await logAdminAction(admin.adminId, "reference.delete", id)
    return NextResponse.json({ ok: true })
  })
}
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { withAuth, logAdminAction } from "@/lib/api-guard"

export async function GET(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async () => {
    const { id } = await ctx.params
    const message = await db.contactMessage.findUnique({ where: { id } })
    if (!message) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json(message)
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

    const data = (body ?? {}) as { isRead?: boolean }

    const message = await db.contactMessage.update({
      where: { id },
      data: { isRead: data.isRead },
    })

    await logAdminAction(admin.adminId, "message.update", id)

    return NextResponse.json(message)
  })
}

export async function DELETE(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (admin) => {
    const { id } = await ctx.params
    await db.contactMessage.delete({ where: { id } })
    await logAdminAction(admin.adminId, "message.delete", id)
    return NextResponse.json({ ok: true })
  })
}
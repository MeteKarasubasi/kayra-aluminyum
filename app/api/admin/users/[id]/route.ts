import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { withAuth, logAdminAction } from "@/lib/api-guard"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

    const data = (body ?? {}) as {
      name?: string
      email?: string
      password?: string
    }

    const target = await db.admin.findUnique({ where: { id } })
    if (!target) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 })
    }

    const updates: {
      name?: string
      email?: string
      passwordHash?: string
    } = {}

    if (typeof data.name === "string") {
      const name = data.name.trim()
      if (!name) {
        return NextResponse.json({ error: "İsim boş olamaz." }, { status: 400 })
      }
      updates.name = name
    }

    if (typeof data.email === "string") {
      const email = data.email.trim().toLowerCase()
      if (!EMAIL_REGEX.test(email)) {
        return NextResponse.json(
          { error: "Geçerli bir e-posta girin." },
          { status: 400 },
        )
      }
      const clash = await db.admin.findUnique({ where: { email } })
      if (clash && clash.id !== id) {
        return NextResponse.json(
          { error: "Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor." },
          { status: 409 },
        )
      }
      updates.email = email
    }

    if (typeof data.password === "string" && data.password.length > 0) {
      if (data.password.length < 6) {
        return NextResponse.json(
          { error: "Şifre en az 6 karakter olmalıdır." },
          { status: 400 },
        )
      }
      updates.passwordHash = await bcrypt.hash(data.password, 12)
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Güncellenecek alan yok." }, { status: 400 })
    }

    const updated = await db.admin.update({
      where: { id },
      data: updates,
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    })

    await logAdminAction(admin.adminId, "user.update", id, updated.email)

    return NextResponse.json(updated)
  })
}

export async function DELETE(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (admin) => {
    const { id } = await ctx.params

    if (id === admin.adminId) {
      return NextResponse.json(
        { error: "Kendinizi silemezsiniz." },
        { status: 400 },
      )
    }

    const target = await db.admin.findUnique({ where: { id } })
    if (!target) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 })
    }

    // Guard: prevent locking the panel by removing the last admin.
    const adminCount = await db.admin.count()
    if (adminCount <= 1) {
      return NextResponse.json(
        { error: "Son kullanıcı silinemez — en az bir admin kalmalı." },
        { status: 400 },
      )
    }

    await db.admin.delete({ where: { id } })
    await logAdminAction(admin.adminId, "user.delete", id, target.email)

    return NextResponse.json({ ok: true })
  })
}

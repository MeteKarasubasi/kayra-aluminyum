import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { withAuth, logAdminAction } from "@/lib/api-guard"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function GET(request: Request) {
  return withAuth(request, async () => {
    const users = await db.admin.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })
    return NextResponse.json(users)
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
      email?: string
      password?: string
      role?: string
    }

    const name = typeof data.name === "string" ? data.name.trim() : ""
    const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : ""
    const password = typeof data.password === "string" ? data.password : ""

    if (!name) {
      return NextResponse.json({ error: "İsim zorunludur." }, { status: 400 })
    }
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Geçerli bir e-posta girin." }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalıdır." },
        { status: 400 },
      )
    }

    const existing = await db.admin.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kullanılıyor." },
        { status: 409 },
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await db.admin.create({
      data: {
        name,
        email,
        passwordHash,
        role: data.role === "admin" ? "admin" : "admin",
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    })

    await logAdminAction(admin.adminId, "user.create", user.id, user.email)

    return NextResponse.json(user, { status: 201 })
  })
}

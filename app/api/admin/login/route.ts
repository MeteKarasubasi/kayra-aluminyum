import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyPassword, createToken, setSessionCookie } from "@/lib/auth"

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { email, password } = (body ?? {}) as { email?: string; password?: string }

  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const admin = await db.admin.findUnique({ where: { email } })
  if (!admin) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const valid = await verifyPassword(password, admin.passwordHash)
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const token = await createToken({ adminId: admin.id, email: admin.email, name: admin.name })
  await setSessionCookie(token)

  return NextResponse.json({ ok: true, admin: { id: admin.id, email: admin.email, name: admin.name } })
}
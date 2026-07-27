import { NextResponse } from "next/server"
import { verifyToken } from "./auth"
import { cookies } from "next/headers"
import { db } from "./db"

type AdminPayload = { adminId: string; email: string; name: string }

export async function withAuth(
  request: Request,
  handler: (admin: AdminPayload) => Promise<Response>
): Promise<Response> {
  const cookieStore = await cookies()
  const token = cookieStore.get("kayrab-admin-token")?.value

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = await verifyToken(token)
  if (!payload) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
  }

  return handler(payload)
}

export async function logAdminAction(
  adminId: string,
  action: string,
  target?: string,
  details?: string
) {
  try {
    await db.adminLog.create({
      data: { adminId, action, target, details },
    })
  } catch (error) {
    console.error("Failed to log admin action:", error)
  }
}

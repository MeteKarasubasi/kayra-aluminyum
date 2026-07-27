import { NextResponse } from "next/server"
import { withAuth } from "@/lib/api-guard"
import { clearSessionCookie } from "@/lib/auth"

export async function POST(request: Request) {
  return withAuth(request, async () => {
    await clearSessionCookie()
    return NextResponse.json({ ok: true })
  })
}
import { NextResponse } from "next/server"
import { withAuth } from "@/lib/api-guard"

export async function GET(request: Request) {
  return withAuth(request, async (admin) => {
    return NextResponse.json({ id: admin.adminId, email: admin.email, name: admin.name })
  })
}
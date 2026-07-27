import { NextResponse } from "next/server"
import { withAuth, logAdminAction } from "@/lib/api-guard"
import { invalidateSettingsCache } from "@/lib/settings-cache"

export async function POST(request: Request) {
  return withAuth(request, async (admin) => {
    invalidateSettingsCache()
    await logAdminAction(admin.adminId, "cache.clear")
    return NextResponse.json({ ok: true })
  })
}

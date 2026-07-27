import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { withAuth, logAdminAction } from "@/lib/api-guard"
import { invalidateSettingsCache } from "@/lib/settings-cache"

export async function GET(request: Request) {
  return withAuth(request, async () => {
    const settings = await db.siteSetting.findMany({ orderBy: { key: "asc" } })
    return NextResponse.json(settings)
  })
}

export async function PUT(request: Request) {
  return withAuth(request, async (admin) => {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    const data = (body ?? {}) as { settings?: { key: string; value: string }[] }

    if (!Array.isArray(data.settings)) {
      return NextResponse.json({ error: "Missing settings array" }, { status: 400 })
    }

    await Promise.all(
      data.settings.map((s) =>
        db.siteSetting.upsert({
          where: { key: s.key },
          update: { value: s.value },
          create: { key: s.key, value: s.value },
        })
      )
    )

    invalidateSettingsCache()

    await logAdminAction(admin.adminId, "settings.update")

    const settings = await db.siteSetting.findMany({ orderBy: { key: "asc" } })
    return NextResponse.json(settings)
  })
}

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { withAuth, logAdminAction } from "@/lib/api-guard"

const MAX_SIZE = 100 * 1024 * 1024

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/avif",
  "application/pdf",
]

export async function POST(request: Request) {
  return withAuth(request, async (admin) => {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 })
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "Dosya boş" }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `Dosya çok büyük (maksimum 100MB). Mevcut: ${(file.size / 1024 / 1024).toFixed(1)}MB` },
        { status: 413 },
      )
    }

    const mimeType = file.type || "application/octet-stream"
    if (!ALLOWED_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { error: `Desteklenmeyen dosya türü: ${mimeType}` },
        { status: 415 },
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const asset = await db.asset.create({
      data: {
        filename: file.name || "upload",
        mimeType,
        size: file.size,
        data: buffer,
      },
    })

    await logAdminAction(admin.adminId, "asset.upload", asset.id, asset.filename)

    return NextResponse.json({
      id: asset.id,
      url: `/api/assets/${asset.id}`,
      filename: asset.filename,
      size: asset.size,
    })
  })
}
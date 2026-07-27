import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const asset = await db.asset.findUnique({ where: { id } })

  if (!asset) {
    return NextResponse.json({ error: "NotFound" }, { status: 404 })
  }

  const headers = new Headers()
  headers.set("Content-Type", asset.mimeType)
  headers.set("Content-Length", String(asset.size))
  // Content-Disposition must be a ByteString — non-ASCII filenames
  // (e.g. Turkish chars) crash the response. Use an ASCII fallback
  // plus the RFC 5987 UTF-8 encoded form.
  const asciiName = asset.filename.replace(/[^\x20-\x7e]/g, "_").replace(/"/g, "_")
  headers.set(
    "Content-Disposition",
    `inline; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(asset.filename)}`,
  )
  headers.set("Cache-Control", "public, max-age=31536000, immutable")

  return new NextResponse(asset.data as unknown as BodyInit, { headers })
}
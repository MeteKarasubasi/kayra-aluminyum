import { NextResponse } from "next/server"
import { db } from "@/lib/db"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const LOCAL_IPS = ["10.", "192.168.", "127.", "172.16.", "::1"]

function isLocalIP(ip: string): boolean {
  return LOCAL_IPS.some((prefix) => ip.startsWith(prefix))
}

async function geolocate(ip: string): Promise<{ country: string | null; city: string | null }> {
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=country,city`, {
      signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) return { country: null, city: null }
    const data = await res.json()
    return {
      country: typeof data.country === "string" ? data.country : null,
      city: typeof data.city === "string" ? data.city : null,
    }
  } catch {
    return { country: null, city: null }
  }
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
  const { name, email, message, phone, system, honey } = body as Record<string, unknown>

  if (typeof honey === "string" && honey.trim().length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  if (typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 })
  }
  if (typeof email !== "string" || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
  }
  if (typeof message !== "string" || message.trim().length < 10) {
    return NextResponse.json(
      { error: "Message must be at least 10 characters" },
      { status: 400 }
    )
  }
  if (phone !== undefined && phone !== null && typeof phone !== "string") {
    return NextResponse.json({ error: "Phone must be a string" }, { status: 400 })
  }
  if (system !== undefined && system !== null && typeof system !== "string") {
    return NextResponse.json({ error: "System must be a string" }, { status: 400 })
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"

  const language =
    (request.headers.get("accept-language") || "").slice(0, 2) || null

  let country: string | null = null
  let city: string | null = null

  if (ip !== "unknown" && !isLocalIP(ip)) {
    const geo = await geolocate(ip)
    country = geo.country
    city = geo.city
  }

  try {
    await db.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        phone: typeof phone === "string" && phone.trim() ? phone.trim() : null,
        system: typeof system === "string" && system.trim() ? system.trim() : null,
        ip,
        country,
        city,
        language,
        isRead: false,
        isSpam: false,
      },
    })
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error("Failed to create contact message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
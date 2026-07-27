import { NextResponse } from "next/server"
import { db } from "@/lib/db"

const LOCAL_IPS = ["10.", "192.168.", "127.", "172.16.", "172.17.", "172.18.", "172.19.", "172.20.", "172.21.", "172.22.", "172.23.", "172.24.", "172.25.", "172.26.", "172.27.", "172.28.", "172.29.", "172.30.", "172.31.", "::1", "fc", "fd"]

const BOT_REGEX = /(googlebot|bingbot|yandexbot|slurp|duckduckbot|baiduspider|sogou|exabot|facebot|facebookexternalhit|ia_archiver|twitterbot|linkedinbot| whatsapp|telegrambot|applebot|mj12bot|ahrefsbot|semrushbot|dotbot|pingdom|uptimerobot|site24x7|newrelicpinger|preview|crawler|spider|scan|bot)/i

const STATIC_EXT_REGEX = /\.(png|jpe?g|gif|webp|avif|svg|ico|css|js|mjs|map|woff2?|ttf|otf|eot|mp4|webm|mp3|wav|pdf|zip|rar|txt|xml|json|manifest)$/i

function isLocalIP(ip: string): boolean {
  if (!ip) return true
  return LOCAL_IPS.some((prefix) => ip.startsWith(prefix))
}

function parseDevice(ua: string): string {
  if (/ipad|tablet|playbook|silk/i.test(ua)) return "tablet"
  if (/mobile|android|iphone|ipod|windows phone/i.test(ua)) return "mobile"
  return "desktop"
}

function parseBrowser(ua: string): string {
  if (/edg\//i.test(ua)) return "Edge"
  if (/opr\/|opera/i.test(ua)) return "Opera"
  if (/chrome|crios/i.test(ua)) return "Chrome"
  if (/firefox|fxios/i.test(ua)) return "Firefox"
  if (/safari/i.test(ua)) return "Safari"
  return "Other"
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
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      body = {}
    }

    const path =
      body && typeof body === "object" && typeof (body as Record<string, unknown>).path === "string"
        ? ((body as Record<string, string>).path as string)
        : ""

    const trimmed = path.trim()
    if (!trimmed) {
      return NextResponse.json({ ok: true })
    }

    if (trimmed.startsWith("/admin") || trimmed.startsWith("/api")) {
      return NextResponse.json({ ok: true })
    }

    if (STATIC_EXT_REGEX.test(trimmed)) {
      return NextResponse.json({ ok: true })
    }

    const headers = request.headers
    const userAgent = headers.get("user-agent") || null
    const referrer = headers.get("referer") || null
    const forwarded = headers.get("x-forwarded-for") || ""
    const ip = forwarded.split(",")[0]?.trim() || ""
    const language = (headers.get("accept-language") || "").slice(0, 5) || null

    const isBot = userAgent ? BOT_REGEX.test(userAgent) : false
    const device = userAgent ? parseDevice(userAgent) : null
    const browser = userAgent ? parseBrowser(userAgent) : null

    let country: string | null = null
    let city: string | null = null

    if (ip && !isLocalIP(ip)) {
      const geo = await geolocate(ip)
      country = geo.country
      city = geo.city
    }

    await db.pageVisit.create({
      data: {
        path: trimmed,
        ip: ip || null,
        userAgent,
        referrer,
        country,
        city,
        language,
        device,
        browser,
        isBot,
      },
    })
  } catch (error) {
    console.error("Failed to record page visit:", error)
  }

  return NextResponse.json({ ok: true })
}

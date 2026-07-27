import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { withAuth } from "@/lib/api-guard"

export async function GET(request: Request) {
  return withAuth(request, async () => {
    const visits = await db.pageVisit.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        path: true,
        ip: true,
        referrer: true,
        country: true,
        city: true,
        language: true,
        device: true,
        browser: true,
        isBot: true,
        createdAt: true,
      },
    })

    return NextResponse.json(visits)
  })
}

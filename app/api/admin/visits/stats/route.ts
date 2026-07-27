import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { withAuth } from "@/lib/api-guard"

export async function GET(request: Request) {
  return withAuth(request, async () => {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [total, today, last7Days, topCountries] = await Promise.all([
      db.pageVisit.count({ where: { isBot: false } }),
      db.pageVisit.count({ where: { isBot: false, createdAt: { gte: todayStart } } }),
      db.pageVisit.count({ where: { isBot: false, createdAt: { gte: sevenDaysAgo } } }),
      db.pageVisit.groupBy({
        by: ["country"],
        where: { isBot: false, country: { not: null } },
        _count: { country: true },
        orderBy: { _count: { country: "desc" } },
        take: 6,
      }),
    ])

    return NextResponse.json({
      total,
      today,
      last7Days,
      topCountries: topCountries.map((c) => ({
        country: c.country,
        count: c._count.country,
      })),
    })
  })
}

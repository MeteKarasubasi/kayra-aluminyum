import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { withAuth } from "@/lib/api-guard"

export async function GET(request: Request) {
  return withAuth(request, async () => {
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const [
      projects,
      products,
      references,
      messages,
      unreadMessages,
      visits,
      todayVisits,
      productFeatures,
      projectProducts,
    ] = await Promise.all([
      db.project.count(),
      db.product.count(),
      db.reference.count(),
      db.contactMessage.count(),
      db.contactMessage.count({ where: { isRead: false } }),
      db.pageVisit.count(),
      db.pageVisit.count({
        where: { createdAt: { gte: startOfToday }, isBot: false },
      }),
      db.product.findMany({ select: { features: true } }),
      db.project.findMany({ select: { products: true } }),
    ])

    const accessoryCount = productFeatures.reduce(
      (sum, p) => sum + p.features.length,
      0,
    )
    const profileCount = projectProducts.reduce(
      (sum, p) => sum + p.products.length,
      0,
    )
    const totalParts = profileCount + accessoryCount

    return NextResponse.json({
      projects,
      products,
      references,
      messages,
      unreadMessages,
      visits,
      todayVisits,
      totalParts,
    })
  })
}
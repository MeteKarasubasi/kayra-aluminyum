import { NextResponse } from "next/server"
import { getSettings } from "@/lib/settings-cache"

export async function GET() {
  const data = await getSettings()
  return NextResponse.json(data)
}

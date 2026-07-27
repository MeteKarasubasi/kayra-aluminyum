"use client"

import { usePathname } from "next/navigation"
import { LangProvider } from "@/lib/i18n"
import { Navbar } from "./navbar"
import { Footer } from "./footer"
import { VisitTracker } from "./visit-tracker"

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  return (
    <LangProvider>
      <VisitTracker />
      {!isAdmin && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!isAdmin && <Footer />}
    </LangProvider>
  )
}

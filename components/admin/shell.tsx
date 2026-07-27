"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import {
  BookOpen,
  Eye,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Package,
  Settings,
  Star,
  X,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard },
  { href: "/admin/projeler", label: "Projeler", icon: FolderKanban },
  { href: "/admin/urunler", label: "Ürünler", icon: Package },
  { href: "/admin/referanslar", label: "Referanslar", icon: Star },
  { href: "/admin/mesajlar", label: "İletişim Talepleri", icon: Mail },
  { href: "/admin/ziyaretciler", label: "Ziyaretçiler", icon: Eye },
  { href: "/admin/katalog", label: "Katalog", icon: BookOpen },
  { href: "/admin/ayarlar", label: "Site Ayarları", icon: Settings },
]

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin"
  return pathname.startsWith(href)
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [admin, setAdmin] = useState<{
    name?: string
    email?: string
  } | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    function fetchUnread() {
      fetch("/api/admin/stats")
        .then((r) => r.json())
        .then((d) => setUnreadCount(d?.unreadMessages ?? 0))
        .catch(() => {})
    }
    fetchUnread()
    const id = setInterval(fetchUnread, 30000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    let cancelled = false
    fetch("/api/admin/me", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("unauthorized")
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        setAdmin({ name: data?.name, email: data?.email })
        setAuthChecked(true)
      })
      .catch(() => {
        if (cancelled) return
        router.replace("/admin/login")
      })
    return () => {
      cancelled = true
    }
  }, [router])

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
    } finally {
      window.location.href = "/admin/login"
    }
  }

  const initials = admin?.name
    ? admin.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AD"

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/admin" className="flex items-center">
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              prefetch
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "size-4 shrink-0",
                  active
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              <span className="flex items-center gap-2 flex-1 min-w-0">
                <span className="truncate">{item.label}</span>
                {unreadCount > 0 && item.href === "/admin/mesajlar" && (
                  <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ml-auto">
                    {unreadCount}
                  </span>
                )}
              </span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {admin?.name ?? "Yükleniyor..."}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {admin?.email ?? ""}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-4 shrink-0" />
          Çıkış Yap
        </button>
      </div>
    </div>
  )

  if (!authChecked && !admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-border bg-card/30 backdrop-blur lg:block">
        {SidebarContent}
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-[260px] border-r border-border bg-card backdrop-blur lg:hidden"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Menüyü kapat"
              >
                <X className="size-4" />
              </button>
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur lg:px-8">
          <button
            onClick={() => setOpen(true)}
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
            aria-label="Menüyü aç"
          >
            <Menu className="size-5" />
          </button>
          <div className="flex flex-1 items-center gap-2">
            <span className="font-display text-sm font-semibold tracking-wide text-foreground">
              Admin Panel
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
            aria-label="Çıkış yap"
          >
            <LogOut className="size-4" />
          </button>
        </header>

        <main className="px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}
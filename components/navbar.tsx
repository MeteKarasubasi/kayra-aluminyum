"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Menu, X } from "lucide-react"
import { Logo } from "./logo"
import { LangToggle } from "./lang-toggle"
import { useLang, type dict } from "@/lib/i18n"
import { cn } from "@/lib/utils"

type NavItem = { href: string; key: keyof typeof dict }

const items: NavItem[] = [
  { href: "/", key: "nav.home" },
  { href: "/urunler", key: "nav.products" },
  { href: "/katalog", key: "nav.catalog" },
  { href: "/projeler", key: "nav.projects" },
  { href: "/iletisim", key: "nav.contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const { t } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        initial={false}
        animate={{
          backgroundColor: scrolled ? "oklch(0.17 0.004 60 / 0.85)" : "oklch(0.17 0.004 60 / 0)",
          borderColor: scrolled ? "oklch(1 0 0 / 0.09)" : "oklch(1 0 0 / 0)",
        }}
        transition={{ duration: 0.35 }}
        className={cn("border-b backdrop-blur-xl", scrolled ? "shadow-lg shadow-black/20" : "")}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="KAYRAB Aluminyum" className="transition-opacity hover:opacity-80">
            <Logo />
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {items.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-full bg-secondary"
                        transition={{ type: "spring", stiffness: 480, damping: 34 }}
                      />
                    )}
                    {t(item.key)}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-3">
            <LangToggle />
            <Link
              href="/iletisim"
              className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95 sm:inline-flex"
            >
              {t("nav.quote")}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground md:hidden"
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-border bg-background/95 backdrop-blur-xl md:hidden"
          >
            <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
              {items.map((item, i) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
                return (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "block rounded-lg px-4 py-3 text-base font-medium",
                        active ? "bg-secondary text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {t(item.key)}
                    </Link>
                  </motion.li>
                )
              })}
              <Link
                href="/iletisim"
                className="mt-2 rounded-lg bg-primary px-4 py-3 text-center text-base font-semibold text-primary-foreground"
              >
                {t("nav.quote")}
              </Link>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

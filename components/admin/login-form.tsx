"use client"

import { useState, type FormEvent } from "react"
import { motion } from "motion/react"
import Link from "next/link"
import { ArrowLeft, Loader2, Lock, Mail, ShieldAlert } from "lucide-react"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"

type Status = "idle" | "sending" | "error"

export function AdminLoginForm() {
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")
    setError("")
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        window.location.href = "/admin"
        return
      }
      const data = await res.json().catch(() => null)
      setError(data?.error ?? "Giriş başarısız. Lütfen tekrar deneyin.")
      setStatus("error")
    } catch {
      setError("Sunucuyla bağlantı kurulamadı.")
      setStatus("error")
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60rem 60rem at 50% -10%, oklch(0.78 0.148 62 / 0.12), transparent 60%), radial-gradient(50rem 50rem at 110% 110%, oklch(0.78 0.148 62 / 0.08), transparent 60%)",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 grain" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-border bg-card/40 backdrop-blur">
            <Logo showText={false} className="h-12 w-12" />
          </div>
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Yönetim Paneli
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Devam etmek için giriş yapın
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/40 p-8 backdrop-blur">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-xs font-semibold tracking-wide text-muted-foreground"
              >
                E-posta
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kayra.com"
                  className="h-11 w-full rounded-xl border border-border bg-input/30 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-xs font-semibold tracking-wide text-muted-foreground"
              >
                Parola
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 w-full rounded-xl border border-border bg-input/30 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
              >
                <ShieldAlert className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className={cn(
                "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-70",
              )}
            >
              {status === "sending" ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                "Giriş Yap"
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            Siteye Dön
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
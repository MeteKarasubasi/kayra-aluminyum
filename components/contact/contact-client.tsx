"use client"

import { useState, type FormEvent } from "react"
import { motion } from "motion/react"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from "lucide-react"
import { useLang } from "@/lib/i18n"
import { useSettings } from "@/lib/use-settings"
import { Reveal } from "@/components/reveal"
import { PhoneInput } from "@/components/contact/phone-input"

type FormState = "idle" | "sending" | "sent" | "error"

const SYSTEM_OPTIONS = [
  { value: "", label: "Seçiniz" },
  { value: "Kış Bahçesi Sistemleri", label: "Kış Bahçesi Sistemleri" },
  { value: "Bioklimatik Pergola", label: "Bioklimatik Pergola" },
  { value: "Korkuluk Sistemleri", label: "Korkuluk Sistemleri" },
  { value: "Cam Balkon & Sürme Sistemler", label: "Cam Balkon & Sürme Sistemler" },
  { value: "Giydirme Cephe", label: "Giydirme Cephe" },
  { value: "Alüminyum Doğrama", label: "Alüminyum Doğrama" },
  { value: "Diğer", label: "Diğer" },
]

export function ContactClient() {
  const { t, lang } = useLang()
  const { settings } = useSettings()
  const [state, setState] = useState<FormState>("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [form, setForm] = useState({ name: "", email: "", phone: "", system: "", honey: "", message: "" })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setState("sending")
    setErrorMsg("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        let msg = t("contact.error")
        try {
          const data = await res.json()
          if (data?.error) msg = data.error
        } catch {
          // ignore JSON parse errors
        }
        throw new Error(msg)
      }
      setState("sent")
      setForm({ name: "", email: "", phone: "", system: "", honey: "", message: "" })
    } catch (err) {
      setState("error")
      setErrorMsg(err instanceof Error && err.message ? err.message : t("contact.error"))
    }
  }

  const address = settings[lang === "tr" ? "address_tr" : "address_en"] || t("contact.address.value")
  const phone = settings.phone || t("contact.phone.value")
  const email = settings.email || t("contact.email.value")
  const hours = settings[lang === "tr" ? "hours_tr" : "hours_en"] || t("contact.hours.value")
  const mapsLink = settings.google_maps_link || "https://maps.google.com/?q=Ankara+Organize+Sanayi+B%C3%B6lgesi"

  const infoCards = [
    { icon: MapPin, label: t("contact.address"), value: address },
    { icon: Phone, label: t("contact.phone"), value: phone, href: `tel:${phone.replace(/\s+/g, "")}` },
    { icon: Mail, label: t("contact.email"), value: email, href: `mailto:${email}` },
    { icon: Clock, label: t("contact.hours"), value: hours },
  ]

  return (
    <main className="pt-28">
      {/* Header */}
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <Reveal>
            <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              <span className="h-px w-8 bg-primary" />
              {t("contact.tag")}
            </p>
          </Reveal>
          <Reveal index={1}>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              {t("contact.page.heading")}
            </h1>
          </Reveal>
          <Reveal index={2}>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t("contact.page.sub")}
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <Reveal>
              <h2 className="font-display text-2xl font-bold tracking-tight">
                {t("contact.title")}
              </h2>
              <p className="mt-2 text-muted-foreground">{t("contact.desc")}</p>
            </Reveal>

            <Reveal index={3}>
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-foreground">
                      {t("contact.name")}
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="h-12 w-full rounded-xl border border-border bg-card/60 px-4 text-foreground placeholder:text-muted-foreground/50 backdrop-blur transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Adınız Soyadınız"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-foreground">
                      {t("contact.email")}
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="h-12 w-full rounded-xl border border-border bg-card/60 px-4 text-foreground placeholder:text-muted-foreground/50 backdrop-blur transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-phone" className="mb-2 block text-sm font-medium text-foreground">
                    {t("contact.phone")}
                  </label>
                  <PhoneInput
                    id="contact-phone"
                    value={form.phone}
                    onChange={(phone) => setForm((f) => ({ ...f, phone }))}
                  />
                </div>

                <div>
                  <label htmlFor="contact-system" className="mb-2 block text-sm font-medium text-foreground">
                    İlgilenilen Sistem
                  </label>
                  <select
                    id="contact-system"
                    value={form.system}
                    onChange={(e) => setForm((f) => ({ ...f, system: e.target.value }))}
                    className="h-12 w-full rounded-xl border border-border bg-card/60 px-4 text-foreground backdrop-blur transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {SYSTEM_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <input
                    type="text"
                    name="honey"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    style={{ position: "absolute", left: "-9999px" }}
                    value={form.honey}
                    onChange={(e) => setForm((f) => ({ ...f, honey: e.target.value }))}
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-foreground">
                    {t("contact.message")}
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    minLength={10}
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="w-full resize-none rounded-xl border border-border bg-card/60 px-4 py-3 text-foreground placeholder:text-muted-foreground/50 backdrop-blur transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Projeniz hakkında bilgi verin..."
                  />
                  <p className="mt-1.5 text-xs text-muted-foreground">{t("contact.message.hint")}</p>
                </div>

                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.03] active:scale-95 disabled:pointer-events-none disabled:opacity-60"
                >
                  {state === "sending" ? t("contact.sending") : t("contact.send")}
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>

                {/* Status messages */}
                {state === "sent" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400"
                  >
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    {t("contact.sent")}
                  </motion.div>
                )}
                {state === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{errorMsg || t("contact.error")}</span>
                  </motion.div>
                )}
              </form>
            </Reveal>
          </div>

          {/* Contact Info Cards */}
          <div className="lg:col-span-2">
            <Reveal>
              <h2 className="font-display text-2xl font-bold tracking-tight">
                {t("contact.info")}
              </h2>
              <p className="mt-2 text-muted-foreground">{t("contact.info.desc")}</p>
            </Reveal>

            <div className="mt-8 space-y-4">
              {infoCards.map((card, i) => (
                <Reveal key={card.label} index={i + 1}>
                  <div className="group rounded-2xl border border-border bg-card/40 p-5 backdrop-blur transition-colors hover:border-primary/30">
                    <div className="flex gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                        <card.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{card.label}</p>
                        {card.href ? (
                          <a href={card.href} className="mt-0.5 text-sm text-muted-foreground transition-colors hover:text-primary">
                            {card.value}
                          </a>
                        ) : (
                          <p className="mt-0.5 text-sm text-muted-foreground">{card.value}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <Reveal>
          <div className="mt-20">
            <h2 className="mb-6 font-display text-2xl font-bold tracking-tight">
              {t("contact.map.title")}
            </h2>
            <div className="overflow-hidden rounded-2xl border border-border">
              <iframe
                title="KAYRAB Aluminyum Konum"
                src={mapsLink}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale transition-[filter] duration-500 hover:grayscale-0"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  )
}

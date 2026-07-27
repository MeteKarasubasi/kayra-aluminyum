"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Check, ChevronDown, Search } from "lucide-react"
import { useLang } from "@/lib/i18n"
import {
  COUNTRIES,
  DEFAULT_COUNTRY,
  findCountryByCode,
  formatNational,
  type Country,
} from "@/lib/countries"
import { cn } from "@/lib/utils"

type PhoneInputProps = {
  /** Full E.164-ish value: "+90 5XX XXX XX XX" or empty string. */
  value: string
  onChange: (value: string) => void
  id?: string
  className?: string
}

/** Parse a stored phone value into a country and the unformatted national digits. */
function parseValue(value: string): { country: Country; national: string } {
  const trimmed = value.trim()
  if (!trimmed) return { country: DEFAULT_COUNTRY, national: "" }
  const match = trimmed.match(/^\+?(\d+)\s*(.*)$/)
  if (!match) return { country: DEFAULT_COUNTRY, national: "" }
  const dial = match[1]
  const rest = match[2]
  // Exact dial code match
  const exact = COUNTRIES.find((c) => c.dial === dial)
  if (exact) return { country: exact, national: rest.replace(/\D/g, "") }
  // Longest matching prefix
  const prefix = [...COUNTRIES]
    .filter((c) => dial.startsWith(c.dial))
    .sort((a, b) => b.dial.length - a.dial.length)[0]
  if (prefix) {
    return { country: prefix, national: dial.slice(prefix.dial.length) + rest.replace(/\D/g, "") }
  }
  return { country: DEFAULT_COUNTRY, national: dial + rest.replace(/\D/g, "") }
}

export function PhoneInput({ value, onChange, id, className }: PhoneInputProps) {
  const { t, lang } = useLang()
  const initial = useMemo(() => parseValue(value), [])
  const [country, setCountry] = useState<Country>(initial.country)
  const [national, setNational] = useState(initial.national)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const wrapRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const formatted = national ? formatNational(national, country) : ""
    onChange(national ? `+${country.dial} ${formatted}` : "")
  }, [country, national]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  useEffect(() => {
    if (open) searchRef.current?.focus()
  }, [open])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COUNTRIES
    return COUNTRIES.filter(
      (c) =>
        c.name.tr.toLowerCase().includes(q) ||
        c.name.en.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.code.toLowerCase().includes(q),
    )
  }, [query])

  const selectCountry = (c: Country) => {
    setCountry(c)
    setOpen(false)
    setQuery("")
  }

  return (
    <div className={cn("flex gap-2", className)}>
      {/* Country code combobox */}
      <div className="relative shrink-0" ref={wrapRef}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex h-12 w-[7.5rem] items-center justify-between gap-1 rounded-xl border border-border bg-card/60 px-3 text-foreground backdrop-blur transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <span className="flex items-center gap-1.5 truncate">
            <span className="text-lg leading-none">{country.flag}</span>
            <span className="text-sm font-medium">+{country.dial}</span>
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        </button>

        {open && (
          <div className="absolute left-0 top-full z-30 mt-2 w-72 overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/30">
            <div className="flex items-center gap-2 border-b border-border px-3 py-2">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("contact.phone.search")}
                className="h-8 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
            </div>
            <ul role="listbox" className="max-h-64 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <li className="px-3 py-4 text-center text-sm text-muted-foreground">
                  {t("contact.phone.empty")}
                </li>
              ) : (
                filtered.map((c) => (
                  <li key={c.code} role="option" aria-selected={c.code === country.code}>
                    <button
                      type="button"
                      onClick={() => selectCountry(c)}
                      className={cn(
                        "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                        c.code === country.code && "bg-muted",
                      )}
                    >
                      <span className="text-lg leading-none">{c.flag}</span>
                      <span className="flex-1 truncate text-foreground">{c.name[lang]}</span>
                      <span className="text-muted-foreground">+{c.dial}</span>
                      {c.code === country.code && <Check className="size-4 text-primary" />}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      {/* National number input with mask */}
      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        value={national ? formatNational(national, country) : ""}
        onChange={(e) => setNational(e.target.value.replace(/\D/g, "").slice(0, 15))}
        className="h-12 w-full rounded-xl border border-border bg-card/60 px-4 text-foreground placeholder:text-muted-foreground/50 backdrop-blur transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        placeholder={t("contact.phone.placeholder")}
      />
    </div>
  )
}
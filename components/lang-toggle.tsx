"use client"

import { motion } from "motion/react"
import { useLang, type Lang } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const langs: Lang[] = ["tr", "en"]

export function LangToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLang()

  return (
    <div
      className={cn(
        "relative flex items-center rounded-full border border-border bg-card/60 p-0.5 text-xs font-semibold backdrop-blur",
        className,
      )}
    >
      {langs.map((l) => {
        const active = lang === l
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            className={cn(
              "relative z-10 rounded-full px-2.5 py-1 uppercase transition-colors",
              active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={active}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 -z-10 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 500, damping: 34 }}
              />
            )}
            {l}
          </button>
        )
      })}
    </div>
  )
}

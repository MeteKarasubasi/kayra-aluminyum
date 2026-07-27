"use client"

import { useSettings } from "@/lib/use-settings"
import { cn } from "@/lib/utils"

export function Logo({
  className,
  showText = true,
}: {
  className?: string
  showText?: boolean
}) {
  const { settings, loading } = useSettings()
  const logoUrl = settings.logo_url
  const logoText = settings.logo_text || "KAYRAB"
  const logoSubtext = settings.logo_subtext || "ALUMINYUM"

  return (
    <span className={cn("flex items-center gap-2.5 select-none", className)}>
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={logoText}
          className={showText ? "h-8 w-auto shrink-0 object-contain" : "size-full object-contain"}
        />
      ) : (
        <LogoMark className={showText ? "h-8 w-8 shrink-0" : "size-full"} />
      )}
      {showText && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
            {loading && !settings.logo_text ? "KAYRAB" : logoText}
          </span>
          {logoSubtext && (
            <span className="text-[0.6rem] font-medium tracking-[0.42em] text-muted-foreground">
              {loading && !settings.logo_subtext ? "ALUMINYUM" : logoSubtext}
            </span>
          )}
        </span>
      )}
    </span>
  )
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 3v42h20v-6H12V3H6z"
        className="fill-foreground"
      />
      <path d="M17 6 L28 6 L21 42 L15 42 Z" className="fill-primary" opacity="0.55" />
      <path d="M23 6 L33 6 L26 42 L20 42 Z" className="fill-primary" opacity="0.8" />
      <path d="M29 6 L39 6 L32 42 L26 42 Z" className="fill-primary" />
    </svg>
  )
}

import { cn } from "@/lib/utils"

/**
 * KAYRAB Aluminyum brand lockup.
 * Mark: a bracket "L" holding three layered amber aluminium profiles
 * (matching the supplied logo). Wordmark rendered in the display font.
 */
export function Logo({
  className,
  showText = true,
}: {
  className?: string
  showText?: boolean
}) {
  return (
    <span className={cn("flex items-center gap-2.5 select-none", className)}>
      <LogoMark className="h-8 w-8 shrink-0" />
      {showText && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
            KAYRAB
          </span>
          <span className="text-[0.6rem] font-medium tracking-[0.42em] text-muted-foreground">
            ALUMINYUM
          </span>
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
      {/* Bracket L in foreground */}
      <path
        d="M6 3v42h20v-6H12V3H6z"
        className="fill-foreground"
      />
      {/* Three layered amber profiles */}
      <path d="M17 6 L28 6 L21 42 L15 42 Z" className="fill-primary" opacity="0.55" />
      <path d="M23 6 L33 6 L26 42 L20 42 Z" className="fill-primary" opacity="0.8" />
      <path d="M29 6 L39 6 L32 42 L26 42 Z" className="fill-primary" />
    </svg>
  )
}

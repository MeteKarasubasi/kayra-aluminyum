"use client"

import { cva, type VariantProps } from "class-variance-authority"
import Link from "next/link"
import { useEffect } from "react"
import { AnimatePresence, motion } from "motion/react"
import { X } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"
import { cn } from "@/lib/utils"

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function AdminCard({
  children,
  className,
  ...props
}: {
  children: ReactNode
  className?: string
} & Omit<ComponentProps<"div">, "className">) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card/40 p-6 backdrop-blur",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const adminButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-muted",
        danger: "bg-destructive text-white hover:bg-destructive/90",
        ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-11 px-4",
        lg: "h-12 px-6",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
)

type AdminButtonProps = VariantProps<typeof adminButtonVariants> & {
  className?: string
  children: ReactNode
} & (
    | ({ href: string } & Omit<ComponentProps<typeof Link>, "className">)
    | ({ href?: undefined } & Omit<
        ComponentProps<"button">,
        "className" | "href"
      >)
  )

export function AdminButton({
  variant,
  size,
  className,
  children,
  ...props
}: AdminButtonProps) {
  const classes = adminButtonVariants({ variant, size, className })
  if ("href" in props && props.href !== undefined) {
    const { href, ...rest } = props
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <button className={classes} {...(props as ComponentProps<"button">)}>
      {children}
    </button>
  )
}

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  highlight = false,
}: {
  label: string
  value: ReactNode
  sub?: string
  icon: React.ComponentType<{ className?: string }>
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card/40 p-6 backdrop-blur",
        highlight ? "border-primary/40" : "border-border",
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">
            {label}
          </p>
          <p
            className={cn(
              "mt-2 font-display text-3xl font-bold tracking-tight",
              highlight ? "text-primary" : "text-foreground",
            )}
          >
            {value}
          </p>
          {sub && (
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                highlight ? "text-primary/80" : "text-muted-foreground",
              )}
            >
              {sub}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-xl",
            highlight ? "bg-primary/20 text-primary" : "bg-primary/15 text-primary",
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  )
}

export function AdminLabel({
  htmlFor,
  children,
  className,
}: {
  htmlFor?: string
  children: ReactNode
  className?: string
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-xs font-semibold tracking-wide text-muted-foreground",
        className,
      )}
    >
      {children}
    </label>
  )
}

const controlBase =
  "w-full rounded-xl border border-border bg-input/30 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-60"

export function AdminInput({
  className,
  ...props
}: ComponentProps<"input">) {
  return (
    <input className={cn(controlBase, "h-11", className)} {...props} />
  )
}

export function AdminTextarea({
  className,
  ...props
}: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(controlBase, "min-h-[120px] py-2.5", className)}
      {...props}
    />
  )
}

export function AdminSelect({
  className,
  children,
  ...props
}: ComponentProps<"select">) {
  return (
    <select
      className={cn(controlBase, "h-11 appearance-none pr-8", className)}
      {...props}
    >
      {children}
    </select>
  )
}

export function AdminCheckbox({
  className,
  ...props
}: ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      className={cn(
        "size-4 rounded border-border bg-input/30 text-primary accent-primary outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        className,
      )}
      {...props}
    />
  )
}

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon?: ReactNode
  title: string
  description?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/20 px-6 py-16 text-center">
      {icon && (
        <div className="mb-4 flex size-12 items-center justify-center rounded-2xl border border-border bg-muted/40 text-muted-foreground">
          {icon}
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-foreground">
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
}

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        active: "bg-primary/15 text-primary",
        inactive: "bg-muted text-muted-foreground",
        danger: "bg-destructive/15 text-destructive",
      },
    },
    defaultVariants: { variant: "active" },
  },
)

export function Badge({
  children,
  variant,
  className,
}: {
  children: ReactNode
  variant?: VariantProps<typeof badgeVariants>["variant"]
  className?: string
}) {
  return (
    <span className={badgeVariants({ variant, className })}>
      <span className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  )
}

export function AdminModal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mt-10 w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-foreground">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Kapat"
              >
                <X className="size-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
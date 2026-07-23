"use client"

import { motion, type Variants } from "motion/react"
import type { ReactNode } from "react"

const variants: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
}

export function Reveal({
  children,
  className,
  index = 0,
  as = "div",
}: {
  children: ReactNode
  className?: string
  index?: number
  as?: "div" | "li" | "section" | "span"
}) {
  const MotionTag = motion[as]
  return (
    <MotionTag
      className={className}
      custom={index}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      {children}
    </MotionTag>
  )
}

export function SectionHeading({
  tag,
  title,
  desc,
  center = false,
}: {
  tag: string
  title: string
  desc?: string
  center?: boolean
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Reveal>
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.3em] text-primary">
          <span className="h-px w-8 bg-primary" />
          {tag}
        </span>
      </Reveal>
      <Reveal index={1}>
        <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </h2>
      </Reveal>
      {desc && (
        <Reveal index={2}>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">{desc}</p>
        </Reveal>
      )}
    </div>
  )
}

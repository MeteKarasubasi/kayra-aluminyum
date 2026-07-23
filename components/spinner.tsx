"use client"

import { motion } from "motion/react"

/**
 * Brand spinner: three stacked aluminium "profiles" (echoing the logo mark)
 * rotating with a staggered draw. Pure transform/opacity => GPU friendly, 60fps.
 */
export function Spinner({ size = 48 }: { size?: number }) {
  const bars = [0, 1, 2]
  return (
    <div
      className="will-transform relative"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.4, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
      >
        {bars.map((i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-primary"
            style={{
              left: "50%",
              top: "50%",
              width: size * (0.5 - i * 0.12),
              height: 3,
              transformOrigin: "left center",
              rotate: `${i * 30}deg`,
            }}
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{
              duration: 1.1,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.15,
            }}
          />
        ))}
      </motion.div>
      <span className="sr-only">Yükleniyor</span>
    </div>
  )
}

/** Full-screen route loading overlay */
export function LoadingScreen() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-6">
      <Spinner size={56} />
      <motion.span
        className="font-display text-sm tracking-[0.3em] text-muted-foreground"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY }}
      >
        KAYRAB
      </motion.span>
    </div>
  )
}

"use client"

import { motion } from "motion/react"

/**
 * Route-level enter transition. template.tsx remounts on navigation,
 * so each page fades + lifts in. Transform/opacity only => 60fps.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="will-transform"
    >
      {children}
    </motion.div>
  )
}

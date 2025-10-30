"use client"

import { motion } from "framer-motion"
import { Video } from "lucide-react"

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          {/* Smooth incline down & up loop */}
          <motion.div
            animate={{ rotate: [0, 15, 0, -15, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Video className="w-8 h-8 text-primary" />
          </motion.div>

          <h1 className="text-2xl font-bold text-foreground">Live Session</h1>
        </div>
      </div>
    </motion.header>
  )
}

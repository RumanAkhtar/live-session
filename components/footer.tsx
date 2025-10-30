"use client"

import { motion } from "framer-motion"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/60 backdrop-blur-md py-8 mt-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <p className="text-sm text-muted-foreground">
          © 2025 Live Session App. All rights reserved.
        </p>
      </motion.div>
    </footer>
  )
}

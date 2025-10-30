"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function AnimatedButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
}: AnimatedButtonProps) {
  const baseStyles = "font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variantStyles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    outline: "border border-border text-foreground hover:bg-muted",
  }

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </motion.button>
  )
}

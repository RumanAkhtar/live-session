"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Copy, Check } from "lucide-react"

interface SessionManagerProps {
  uniqueId: string
  userUrl: string
  type: "admin" | "student"
}

export function SessionManager({ uniqueId, userUrl, type }: SessionManagerProps) {
  const [copied, setCopied] = useState(false)

  const joinUrl = `${window.location.origin}/session/${uniqueId}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(joinUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card border border-border rounded-lg p-6 space-y-4"
    >
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Session ID</h3>
        <div className="flex items-center gap-2 bg-muted p-3 rounded-lg">
          <code className="flex-1 font-mono text-foreground">{uniqueId}</code>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyToClipboard}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </motion.button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Join URL</h3>
        <div className="flex items-center gap-2 bg-muted p-3 rounded-lg">
          <code className="flex-1 font-mono text-foreground text-sm truncate">{joinUrl}</code>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyToClipboard}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </motion.button>
        </div>
      </div>

      <div className="pt-2">
        <p className="text-xs text-muted-foreground">
          Role: <span className="font-semibold capitalize">{type}</span>
        </p>
      </div>
    </motion.div>
  )
}

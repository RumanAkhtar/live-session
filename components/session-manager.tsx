"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, Check } from "lucide-react"

interface SessionManagerProps {
  uniqueId: string
  userUrl: string
  type: "admin" | "student"
}

export function SessionManager({ uniqueId, userUrl, type }: SessionManagerProps) {
  const [copied, setCopied] = useState(false)
  const [joinUrl, setJoinUrl] = useState<string>("")

  // ✅ Compute join URL safely on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      setJoinUrl(`${window.location.origin}/session/${uniqueId}`)
    }
  }, [uniqueId])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error("❌ Failed to copy:", err)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-sm"
    >
      {/* 🧩 Session ID */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Session ID</h3>
        <div className="flex items-center gap-2 bg-muted p-3 rounded-lg group">
          <code className="flex-1 font-mono text-foreground break-all">{uniqueId}</code>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Copy session ID"
            onClick={() => copyToClipboard(uniqueId)}
            className="relative text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  <Check size={18} className="text-green-500" />
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  <Copy size={18} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* 🔗 Join URL */}
      {joinUrl && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Join URL</h3>
          <div className="flex items-center gap-2 bg-muted p-3 rounded-lg group">
            <code className="flex-1 font-mono text-foreground text-sm truncate">{joinUrl}</code>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Copy join link"
              onClick={() => copyToClipboard(joinUrl)}
              className="relative text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                  >
                    <Check size={18} className="text-green-500" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                  >
                    <Copy size={18} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      )}

      {/* 🧠 Role Info */}
      <div className="pt-2 flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Role:{" "}
          <span
            className={`font-semibold capitalize ${
              type === "admin" ? "text-blue-500" : "text-emerald-500"
            }`}
          >
            {type}
          </span>
        </p>
        {type === "admin" && (
          <span className="text-xs bg-blue-100 text-blue-600 font-medium px-2 py-0.5 rounded">
            Host
          </span>
        )}
      </div>
    </motion.div>
  )
}

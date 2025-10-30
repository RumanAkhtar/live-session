"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnimatedButton } from "@/components/button-animated"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleStartSession = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "admin",
          userUrl: window.location.origin,
        }),
      })

      const data = await response.json()

      if (data.success) {
        window.location.href = `/session/${data.data.uniqueId}`
      } else {
        setError(data.error || "Failed to create session")
      }
    } catch (err) {
      console.error(err)
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/20">
        {/* Centered content container */}
        <section className="flex-1 flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12 py-16">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Hero Section */}
              <motion.div variants={itemVariants} className="space-y-4">
                <h2 className="text-5xl sm:text-6xl font-bold text-foreground">
                  Start Your Live Session
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Create an interactive live streaming session and share it with your students. 
                  Full video controls and real-time sharing.
                </p>
              </motion.div>

              {/* Start Button */}
              <motion.div variants={itemVariants} className="flex gap-4 justify-center">
                <AnimatedButton size="lg" onClick={handleStartSession} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin inline" />
                      Creating Session...
                    </>
                  ) : (
                    "Start Session"
                  )}
                </AnimatedButton>
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg max-w-md mx-auto"
                >
                  {error}
                </motion.div>
              )}

              {/* Features Section */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
              >
                {[
                  {
                    title: "Full Controls",
                    description: "Play, pause, volume, and fullscreen controls",
                  },
                  {
                    title: "Easy Sharing",
                    description: "Share session ID or URL with students instantly",
                  },
                  {
                    title: "Real-time Sync",
                    description: "All participants see the same video stream",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="bg-card border border-border rounded-lg p-6 text-left shadow-sm transition-transform"
                  >
                    <h3 className="font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </>
  )
}

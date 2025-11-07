"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VideoPlayer } from "@/components/video-player"
import { SessionManager } from "@/components/session-manager"
import { AnimatedButton } from "@/components/button-animated"
import { Loader2, AlertCircle } from "lucide-react"
import { useParams } from "next/navigation"

interface Session {
  _id: string
  type: "admin" | "student"
  uniqueId: string
  userUrl: string
  isActive: boolean
}

export default function SessionPage() {
  const params = useParams()
  const sessionId = params.id as string
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [userType, setUserType] = useState<"admin" | "student">("student")

  /**
   * Fetch session data and determine user role
   */
  useEffect(() => {
    if (!sessionId) return

    const fetchSession = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/sessions?uniqueId=${sessionId}`, { cache: "no-store" })
        const data = await res.json()

        if (!data.success || !data.data) {
          setError("Session not found.")
          return
        }

        setSession(data.data)

        // 🧠 Manage user role locally (admin or student)
        const storageKey = `session_${sessionId}_role`
        const storedType = localStorage.getItem(storageKey)

        if (storedType === "admin" || storedType === "student") {
          setUserType(storedType as "admin" | "student")
        } else {
          const type = data.data.type === "admin" ? "admin" : "student"
          localStorage.setItem(storageKey, type)
          setUserType(type)
        }
      } catch (err) {
        console.error("❌ Error fetching session:", err)
        setError("Unable to load session data.")
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [sessionId])

  /**
   * ------------------------
   * Render States
   * ------------------------
   */

  // 🌀 Loading State
  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center bg-background">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <Loader2 className="w-12 h-12 text-primary" />
          </motion.div>
        </main>
      </>
    )
  }

  // ❌ Error State
  if (error || !session) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center bg-background px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-lg p-8 max-w-md text-center space-y-4 shadow-sm"
          >
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <h2 className="text-lg font-semibold text-foreground">
              {error || "An unknown error occurred."}
            </h2>
            <AnimatedButton onClick={() => (window.location.href = "/")}>
              Back to Home
            </AnimatedButton>
          </motion.div>
        </main>
        <Footer />
      </>
    )
  }

  /**
   * ✅ Main Content (Success)
   */
  return (
    <>
        <Header />
        <main className="min-h-screen bg-background flex flex-col">
          <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* 🎥 Main Video + Session Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Video Player */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <VideoPlayer
                    sessionId={session._id}
                    videoUrl={session.userUrl}
                    role={userType}
                  />
                </motion.div>

                {/* Session Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-card border border-border rounded-lg p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Session Information
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Session ID</p>
                      <p className="font-mono text-foreground break-all">
                        {session.uniqueId}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p
                        className={`font-semibold ${
                          session.isActive ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {session.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* 🧭 Sidebar */}
              <div className="space-y-6">
                {/* Session Controls */}
                <SessionManager
                  uniqueId={session.uniqueId}
                  userUrl={session.userUrl}
                  type={userType}
                />

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-card border border-border rounded-lg p-6 space-y-4 shadow-sm"
                >
                  <h3 className="font-semibold text-foreground">Quick Actions</h3>
                  <AnimatedButton
                    variant="outline"
                    className="w-full"
                    onClick={() => (window.location.href = "/")}
                  >
                    Back to Home
                  </AnimatedButton>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <Footer />
        </main>
    </>
  )
}

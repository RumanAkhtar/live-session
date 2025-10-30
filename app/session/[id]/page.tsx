"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
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
  const [error, setError] = useState("")
  const [userType, setUserType] = useState<"admin" | "student" | null>(null)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`/api/sessions?uniqueId=${sessionId}`)
        const data = await response.json()

        if (data.success) {
          setSession(data.data)
          // Determine user type - first visitor is admin, others are students
          const storedType = localStorage.getItem(`session_${sessionId}_type`)
          if (storedType) {
            setUserType(storedType as "admin" | "student")
          } else {
            const type = data.data.type === "admin" ? "student" : "student"
            localStorage.setItem(`session_${sessionId}_type`, type)
            setUserType(type)
          }
        } else {
          setError("Session not found")
        }
      } catch (err) {
        setError("Failed to load session")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (sessionId) {
      fetchSession()
    }
  }, [sessionId])

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Loader2 className="w-12 h-12 text-primary" />
          </motion.div>
        </main>
      </>
    )
  }

  if (error || !session) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-lg p-8 max-w-md text-center space-y-4"
          >
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold text-foreground">{error}</h2>
            <AnimatedButton onClick={() => (window.location.href = "/")}>Back to Home</AnimatedButton>
          </motion.div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <VideoPlayer videoUrl={session.userUrl} sessionId={session._id} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card border border-border rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">Session Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Session ID</p>
                    <p className="font-mono text-foreground">{session.uniqueId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-green-600 font-semibold">{session.isActive ? "Active" : "Inactive"}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="space-y-6">
              <SessionManager uniqueId={session.uniqueId} userUrl={session.userUrl} type={userType || "student"} />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-card border border-border rounded-lg p-6 space-y-4"
              >
                <h3 className="font-semibold text-foreground">Quick Actions</h3>
                <AnimatedButton variant="outline" className="w-full" onClick={() => (window.location.href = "/")}>
                  Back to Home
                </AnimatedButton>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  )
}

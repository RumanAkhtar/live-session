"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Loader2,
} from "lucide-react"

interface VideoPlayerProps {
  videoUrl?: string
  sessionId: string
  role?: "admin" | "student"
}

export function VideoPlayer({ videoUrl, sessionId, role = "student" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [isLive, setIsLive] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isMicOn, setIsMicOn] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  // 🧠 If admin, auto-init camera and mic
  useEffect(() => {
    if (role === "admin") {
      initMedia(true, true)
    }
  }, [role])

  /**
   * Initialize camera/mic stream
   */
  const initMedia = async (enableCamera: boolean, enableMic: boolean) => {
    try {
      setIsLoading(true)
      const constraints: MediaStreamConstraints = {
        video: enableCamera,
        audio: enableMic,
      }
      const userStream = await navigator.mediaDevices.getUserMedia(constraints)
      if (videoRef.current) videoRef.current.srcObject = userStream
      setStream(userStream)
      setIsCameraOn(enableCamera)
      setIsMicOn(enableMic)
      setIsLive(true)
      setIsPlaying(true)
    } catch (error) {
      console.error("❌ Error accessing media devices:", error)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Toggle camera (on/off)
   */
  const toggleCamera = () => {
    if (!stream) return
    const track = stream.getVideoTracks()[0]
    if (track) {
      track.enabled = !track.enabled
      setIsCameraOn(track.enabled)
    } else {
      // re-enable if camera was off
      initMedia(true, isMicOn)
    }
  }

  /**
   * Toggle microphone (on/off)
   */
  const toggleMic = () => {
    if (!stream) return
    const track = stream.getAudioTracks()[0]
    if (track) {
      track.enabled = !track.enabled
      setIsMicOn(track.enabled)
    } else {
      // re-enable mic if off
      initMedia(isCameraOn, true)
    }
  }

  /**
   * Play/pause for video files (student)
   */
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) videoRef.current.volume = newVolume
  }

  const toggleFullscreen = () => {
    if (videoRef.current?.parentElement) {
      videoRef.current.parentElement.requestFullscreen()
    }
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full bg-black rounded-xl overflow-hidden group aspect-video"
      onMouseMove={handleMouseMove}
    >
      {/* 🎥 Video feed */}
      <video
        ref={videoRef}
        src={role === "student" ? videoUrl : undefined}
        className="w-full h-full object-cover"
        autoPlay
        playsInline
        muted={role === "admin" || isMuted}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* 🔴 Live Badge */}
      {isLive && (
        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded-md shadow-md">
          LIVE
        </div>
      )}

      {/* ⚙️ Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
      )}

      {/* 🎛️ Control Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* ▶️ / ⏸️ */}
            {role === "student" && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePlay}
                className="text-white hover:text-primary transition-colors"
              >
                {isPlaying ? <Pause size={22} /> : <Play size={22} />}
              </motion.button>
            )}

            {/* 🔈 Volume */}
            {role === "student" && (
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMute}
                  className="text-white hover:text-primary transition-colors"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </motion.button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}

            {/* 🎥 Camera Toggle */}
            {role === "admin" && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCamera}
                className={`text-white transition-colors p-2 rounded-md ${
                  isCameraOn ? "bg-white/10 hover:bg-white/20" : "bg-red-600 hover:bg-red-500"
                }`}
                title={isCameraOn ? "Turn off camera" : "Turn on camera"}
              >
                {isCameraOn ? <Video size={18} /> : <VideoOff size={18} />}
              </motion.button>
            )}

            {/* 🎙️ Mic Toggle */}
            {role === "admin" && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMic}
                className={`text-white transition-colors p-2 rounded-md ${
                  isMicOn ? "bg-white/10 hover:bg-white/20" : "bg-red-600 hover:bg-red-500"
                }`}
                title={isMicOn ? "Mute mic" : "Unmute mic"}
              >
                {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
              </motion.button>
            )}
          </div>

          {/* ⛶ Fullscreen + ⚙️ Settings */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFullscreen}
              className="text-white hover:text-primary transition-colors"
            >
              <Maximize size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-white hover:text-primary transition-colors"
            >
              <Settings size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

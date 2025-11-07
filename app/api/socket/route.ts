// app/api/socket/route.ts
import { Server as SocketIOServer } from "socket.io"
import { NextRequest } from "next/server"

let io: SocketIOServer | null = null

export const GET = async (req: NextRequest) => {
  if (!io) {
    // @ts-ignore - attach to global server once
    io = new SocketIOServer(globalThis.server, {
      path: "/api/socket/io",
      cors: { origin: "*" },
    })

    io.on("connection", (socket) => {
      console.log("✅ New socket connected:", socket.id)

      socket.on("join-session", (sessionId: string) => {
        socket.join(sessionId)
        console.log(`👤 Joined session ${sessionId}`)
      })

      socket.on("offer", ({ sessionId, offer }) => {
        socket.to(sessionId).emit("offer", offer)
      })

      socket.on("answer", ({ sessionId, answer }) => {
        socket.to(sessionId).emit("answer", answer)
      })

      socket.on("ice-candidate", ({ sessionId, candidate }) => {
        socket.to(sessionId).emit("ice-candidate", candidate)
      })
    })
  }

  return new Response("Socket.io server is running ✅", { status: 200 })
}

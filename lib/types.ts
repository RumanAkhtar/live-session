export interface LiveSession {
  _id?: string
  type: "admin" | "student"
  uniqueId: string
  userUrl: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export interface SessionResponse {
  success: boolean
  data?: LiveSession
  error?: string
}

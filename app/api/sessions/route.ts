import { type NextRequest, NextResponse } from "next/server"
import { getSessionsCollection } from "@/lib/mongodb"
import { randomUUID } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, userUrl } = body

    if (!type || !userUrl) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Generate unique session ID
    const uniqueId = randomUUID()
    const sessionUrl = `${userUrl}/session/${uniqueId}`

    const sessions = await getSessionsCollection()

    // Create a new session document
    const sessionData = {
      type,
      unique_id: uniqueId,
      userurl: sessionUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    }

    const result = await sessions.insertOne(sessionData)

    return NextResponse.json({
      success: true,
      data: {
        _id: result.insertedId.toString(),
        ...sessionData,
      },
    })
  } catch (error) {
    console.error("❌ Error creating session:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create session" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const uniqueId = searchParams.get("uniqueId")

    if (!uniqueId) {
      return NextResponse.json(
        { success: false, error: "Missing uniqueId parameter" },
        { status: 400 }
      )
    }

    const sessions = await getSessionsCollection()
    const session = await sessions.findOne({ unique_id: uniqueId })

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        _id: session._id.toString(),
        ...session,
      },
    })
  } catch (error) {
    console.error("❌ Error fetching session:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch session" },
      { status: 500 }
    )
  }
}

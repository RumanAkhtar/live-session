import { type NextRequest, NextResponse } from "next/server"
import { getSessionsCollection } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// 🟢 Update an existing session
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const sessions = await getSessionsCollection()

    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false, error: "Invalid session ID" }, { status: 400 })
    }

    const result = await sessions.updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Session updated successfully",
    })
  } catch (error) {
    console.error("❌ Error updating session:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update session" },
      { status: 500 }
    )
  }
}

// 🔴 Delete an existing session
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessions = await getSessionsCollection()

    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false, error: "Invalid session ID" }, { status: 400 })
    }

    const result = await sessions.deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Session deleted successfully",
    })
  } catch (error) {
    console.error("❌ Error deleting session:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete session" },
      { status: 500 }
    )
  }
}

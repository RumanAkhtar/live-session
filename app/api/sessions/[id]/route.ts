import { type NextRequest, NextResponse } from "next/server"
import { getSessionsCollection } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const sessions = await getSessionsCollection()

    const result = await sessions.updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating session:", error)
    return NextResponse.json({ success: false, error: "Failed to update session" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessions = await getSessionsCollection()

    const result = await sessions.deleteOne({
      _id: new ObjectId(params.id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting session:", error)
    return NextResponse.json({ success: false, error: "Failed to delete session" }, { status: 500 })
  }
}

import { MongoClient, Db, Collection } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

/**
 * Connect to MongoDB (reuses cached connection for performance)
 */
export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("❌ MONGODB_URI environment variable is not set in .env.local")
  }

  try {
    const client = new MongoClient(uri)
    await client.connect()

    const db = client.db("live_sessions")

    cachedClient = client
    cachedDb = db

    console.log("✅ MongoDB connected successfully:", db.databaseName)
    return { client, db }
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error)
    throw new Error("MongoDB connection failed")
  }
}

/**
 * Get the sessions collection (creates one if missing)
 */
export async function getSessionsCollection(): Promise<Collection> {
  const { db } = await connectToDatabase()
  const collection = db.collection("sessions")
  return collection
}

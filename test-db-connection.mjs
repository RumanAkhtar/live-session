// test-db-connection.mjs
import { connectToDatabase } from "./lib/mongodb.js"

try {
  const { db } = await connectToDatabase()
  console.log("✅ Successfully connected to MongoDB!")
  console.log("📦 Database name:", db.databaseName)

  const collections = await db.listCollections().toArray()
  console.log("📂 Collections:", collections.map(c => c.name))

  process.exit(0)
} catch (error) {
  console.error("❌ Failed to connect to MongoDB:", error)
  process.exit(1)
}

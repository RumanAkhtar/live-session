import { MongoClient } from "mongodb";

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  // Reuse connection if already established
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("❌ MONGODB_URI environment variable is not set.");
  }

  // Create a new MongoDB client and connect
  const client = new MongoClient(mongoUri);
  await client.connect();

  // Use the database named "live_sessions"
  const db = client.db("live_sessions");

  // Cache for reuse
  cachedClient = client;
  cachedDb = db;

  console.log("✅ Connected to MongoDB:", db.databaseName);

  return { client, db };
}

export async function getSessionsCollection() {
  const { db } = await connectToDatabase();
  return db.collection("sessions");
}

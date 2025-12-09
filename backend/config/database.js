import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

// Create MongoDB client
const client = new MongoClient(MONGODB_URI);

// Database and collection names
const DB_NAME = "notSoSimple-Tasks";
const COLLECTION_NAME = "tasks";

let db = null;

// Connect to MongoDB
export async function connectToDatabase() {
  try {
    if (db) {
      return db;
    }

    await client.connect();
    console.log("Connected to MongoDB");
    
    db = client.db(DB_NAME);
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

// Get database instance
export function getDatabase() {
  if (!db) {
    throw new Error("Database not connected. Call connectToDatabase() first.");
  }
  return db;
}

// Get tasks collection
export function getTasksCollection() {
  const database = getDatabase();
  return database.collection(COLLECTION_NAME);
}

// Close database connection
export async function closeDatabase() {
  try {
    await client.close();
    console.log("MongoDB connection closed");
    db = null;
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
    throw error;
  }
}



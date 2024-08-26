import { Surreal } from "surrealdb.js";

let db: Surreal | undefined;

export async function initDb(): Promise<Surreal | undefined> {
  if (db) return db;
  db = new Surreal();
  try {
    await db.connect("http://127.0.0.1:8000/rpc");
    await db.use({ namespace: "test", database: "test" });
    return db;
  } catch (err) {
    console.error("Failed to connect to SurrealDB:", err);
    throw err;
  }
}

export async function closeDb(): Promise<void> {
  if (!db) return;
  await db.close();
  db = undefined;
}

export function getDb(): Surreal | undefined {
  return db;
}

export async function initializeDbAndCreateTest(): Promise<void> {
  // Initialize the database if not already initialized
  if (!db) {
    await initDb();
  }

  if (!db) {
    throw new Error("Failed to initialize database");
  }

  try {
    // Create the Test table
    await db.query('DEFINE TABLE Test;');
    console.log("Test table created successfully");
  } catch (err) {
    console.error("Error creating Test table:", err);
    throw err;
  }
}

export async function addTestRecord(data: Record<string, any>): Promise<any> {
  if (!db) {
    throw new Error("Database not initialized");
  }

  try {
    const result = await db.create("Test", data);
    console.log("Record added successfully:", result);
    return result;
  } catch (err) {
    console.error("Error adding record to Test table:", err);
    throw err;
  }
}

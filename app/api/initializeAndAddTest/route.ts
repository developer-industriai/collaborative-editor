import { NextResponse } from 'next/server';
import { initializeDbAndCreateTest, addTestRecord, getDb } from '../../../lib/utils/surreal';

export async function POST(request: Request) {
  try {
    const { name, value } = await request.json();

    if (!name || value === undefined) {
      return NextResponse.json({ error: 'Name and value are required' }, { status: 400 });
    }

    console.log('Initializing DB and creating Test table');
    // Initialize the database and create the Test table
    await initializeDbAndCreateTest();

    console.log('Adding new record to Test table');
    // Add a new record to the Test table
    const newRecord = { name, value };
    const result = await addTestRecord(newRecord);

    console.log('Triggering update for SSE connection');
    // Trigger an update for the SSE connection
    const db = getDb();
    if (db) {
      await db.query('UPDATE Test SET updated_at = time::now() WHERE id = $id', { id: result.id });
    }

    console.log('Record added successfully:', result);
    return NextResponse.json({ message: 'Database initialized and record added', result });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
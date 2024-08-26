import { NextResponse } from 'next/server';
import { initializeDbAndCreateTest, addTestRecord } from '../../../lib/utils/surreal';

export async function POST(request: Request) {
  try {
    const { name, value } = await request.json();

    if (!name || value === undefined) {
      return NextResponse.json({ error: 'Name and value are required' }, { status: 400 });
    }

    // Initialize the database and create the Test table
    await initializeDbAndCreateTest();

    // Add a new record to the Test table
    const newRecord = { name, value };
    const result = await addTestRecord(newRecord);

    return NextResponse.json({ message: 'Database initialized and record added', result });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
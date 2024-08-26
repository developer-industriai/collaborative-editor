import { NextResponse } from 'next/server';
import { initDb, listTestRecords, getDb } from '../../../lib/utils/surreal';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sse = searchParams.get('sse') === 'true';

  if (!sse) {
    try {
      await initDb();
      const tests = await listTestRecords();
      return NextResponse.json(tests);
    } catch (error) {
      console.error('Error listing tests:', error);
      return NextResponse.json({ error: 'Failed to list tests' }, { status: 500 });
    }
  } else {
    const stream = new ReadableStream({
      async start(controller) {
        await initDb();
        const db = getDb();
        if (!db) {
          controller.close();
          return;
        }

        const sendTests = async () => {
          const tests = await listTestRecords();
          controller.enqueue(`data: ${JSON.stringify(tests)}\n\n`);
        };

        await sendTests();

        db.live('Test', async () => {
          console.log('Test table changed, sending update');
          await sendTests();
        });
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  }
}
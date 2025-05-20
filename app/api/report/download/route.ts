import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Report from '@/models/report';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing report ID' }, { status: 400 });
    }

    const report = await Report.findById(id);

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const headers = new Headers();
    headers.set('Content-Type', report.mimeType);
    headers.set('Content-Disposition', `attachment; filename="${report.fileName}"`);

    return new NextResponse(report.file.buffer, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('❌ Download error:', error.message);
    return NextResponse.json({ error: 'Failed to download report' }, { status: 500 });
  }
}

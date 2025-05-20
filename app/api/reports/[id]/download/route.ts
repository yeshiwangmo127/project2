import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Report from '@/models/report';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const report = await Report.findById(params.id);
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Create response with file data
    const response = new NextResponse(report.file);
    
    // Set appropriate headers
    response.headers.set('Content-Type', report.mimeType);
    response.headers.set('Content-Disposition', `attachment; filename="${report.fileName}"`);
    
    return response;
  } catch (error: any) {
    console.error('❌ Download error:', error.message);
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
  }
}

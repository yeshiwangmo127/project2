import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Report from '@/models/report';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  await connectDB();
  const allReports = await Report.find({}, { patientEmail: 1, _id: 0 });
  return NextResponse.json({ emails: allReports.map(r => r.patientEmail) });
} 
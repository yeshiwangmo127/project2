import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Report from '@/models/report';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId');
    const email = searchParams.get('email');

    let reports = [];
    if (patientId) {
      reports = await Report.find({ patientId }).sort({ uploadedAt: -1 });
    } else if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      reports = await Report.find({
        patientEmail: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') }
      }).sort({ uploadedAt: -1 });
    } else {
      return NextResponse.json({ error: 'Patient ID or email is required' }, { status: 400 });
    }

    // Transform for frontend
    const formattedReports = reports.map((r: any) => ({
      id: r._id.toString(),
      title: r.title,
      description: r.description,
      file_url: `/api/reports/${r._id}/download`,
      file_name: r.fileName,
      created_at: r.uploadedAt ? r.uploadedAt.toISOString() : null,
      doctor_name: r.doctorName,
      patient_name: r.patientName
    }));

    return NextResponse.json({ reports: formattedReports });
  } catch (error: any) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

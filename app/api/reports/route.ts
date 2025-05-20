import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Report from '@/models/report';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    console.log('🔌 Connecting to DB...');
    await connectDB();
    console.log('✅ DB Connected');

    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId');
    const email = searchParams.get('email');

    let reports = [];
    if (patientId) {
      reports = await Report.find({ patientId }).sort({ uploadedAt: -1 });
    } else if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      console.log('🔍 Searching for reports with normalized email:', normalizedEmail);

      // First, let's check if there are any reports at all
      const totalReports = await Report.countDocuments();
      console.log('Total reports in database:', totalReports);

      // Try to find reports with case-insensitive email match
      reports = await Report.find({
        patientEmail: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') }
      }).sort({ uploadedAt: -1 });

      console.log('📄 Found reports for email:', normalizedEmail, 'Count:', reports.length);
      
      if (reports.length > 0) {
        console.log('Sample report details:', {
          id: reports[0]._id,
          title: reports[0].title,
          patientEmail: reports[0].patientEmail,
          doctorName: reports[0].doctorName,
          uploadedAt: reports[0].uploadedAt
        });
      } else {
        // Let's check if there are any reports with similar emails
        const similarReports = await Report.find({
          patientEmail: { $regex: normalizedEmail, $options: 'i' }
        });
        console.log('Found similar email reports:', similarReports.length);
        if (similarReports.length > 0) {
          console.log('Similar email reports:', similarReports.map(r => ({
            email: r.patientEmail,
            title: r.title
          })));
        }
      }
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

    console.log('✅ Sending formatted reports:', formattedReports.length);
    return NextResponse.json({ reports: formattedReports });
  } catch (error: any) {
    console.error('❌ Fetch error:', error.message);
    console.error(error.stack);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

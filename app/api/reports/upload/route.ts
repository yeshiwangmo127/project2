import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Report from '@/models/report';
import User from '@/models/User';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    console.log('🔌 Connecting to DB...');
    await connectDB();
    console.log('✅ DB Connected');

    console.log('📥 Parsing form data...');
    const formData = await request.formData();

    // Debug: print all formData entries
    Array.from(formData.entries()).forEach(([key, value]) => {
      console.log('FORM DATA:', key, value);
    });

    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const patientName = formData.get('patientName') as string;
    const patientEmailRaw = formData.get('patientEmail');
    const doctorName = formData.get('doctorName') as string;
    const reportDateRaw = formData.get('reportDate');
    console.log('Received doctorName:', doctorName, 'reportDate:', reportDateRaw);
    let uploadedAt = new Date();
    if (reportDateRaw && typeof reportDateRaw === 'string' && reportDateRaw.trim()) {
      // Parse yyyy-mm-dd to Date
      uploadedAt = new Date(reportDateRaw);
    }
    console.log('Final uploadedAt value to be saved:', uploadedAt);

    // Validate and normalize patientEmail
    if (!patientEmailRaw || typeof patientEmailRaw !== 'string' || !patientEmailRaw.trim()) {
      return NextResponse.json({ error: 'Patient email is required' }, { status: 400 });
    }
    const patientEmail = patientEmailRaw.toLowerCase().trim();

    console.log('📋 Received form data:', { 
      fileName: file?.name, 
      title, 
      description, 
      patientName, 
      patientEmail, 
      doctorName 
    });

    if (!file || !title || !description || !patientName || !patientEmail || !doctorName) {
      console.log('❌ Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find or create patient (with all required fields)
    console.log('🔍 Looking for patient with email:', patientEmail);
    let patient = await User.findOne({ email: patientEmail, userType: 'patient' });
    
    if (!patient) {
      console.log('Creating new patient account for:', patientEmail);
      const randomPassword = Math.random().toString(36).slice(-8);
      patient = await User.create({
        name: patientName,
        email: patientEmail,
        userType: 'patient',
        password: randomPassword,
      });
      console.log('Created patient account:', patient._id);
    } else {
      console.log('Found existing patient account:', patient._id);
    }

    // Find doctor (must exist)
    console.log('🔍 Looking for doctor:', doctorName);
    const doctor = await User.findOne({ name: doctorName, userType: 'doctor' });
    if (!doctor) {
      console.log('❌ Doctor not found:', doctorName);
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }
    console.log('Found doctor:', doctor._id);

    console.log('📦 Reading file buffer...');
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate a unique file URL
    const fileUrl = `/api/reports/${Date.now()}-${file.name}`;

    console.log('🧾 Creating report document with data:', {
      title,
      description,
      patientName,
      patientEmail,
      doctorName,
      patientId: patient._id,
      doctorId: doctor._id,
      fileName: file.name
    });

    const report = await Report.create({
      title,
      description,
      patientName,
      patientEmail,
      doctorName,
      patientId: patient._id,
      doctorId: doctor._id,
      file: buffer,
      fileName: file.name,
      mimeType: file.type,
      fileUrl,
      uploadedAt
    });

    console.log('Saved report uploadedAt:', report.uploadedAt);
    console.log('✅ Report uploaded successfully! Report ID:', report._id);
    return NextResponse.json({ 
      message: 'Report uploaded successfully',
      reportId: report._id 
    });
  } catch (error: any) {
    console.error('❌ Upload error:', error.message);
    console.error(error.stack);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
} 
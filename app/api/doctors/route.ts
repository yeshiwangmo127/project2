import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Doctor from '@/models/Doctor';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    let query = {};
    if (department) {
      query = { department };
    }
    const doctors = await Doctor.find(query).lean();
    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, department, qualification, experience, specialization, imageUrl, available } = body;
    if (!name || !department || !qualification || !experience || !specialization) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const defaultAvailability = Array.from({ length: 30 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return {
        date: date.toISOString().split('T')[0],
        timeSlots: [
          { startTime: '09:00', endTime: '10:00', isBooked: false },
          { startTime: '10:00', endTime: '11:00', isBooked: false }
        ]
      };
    });
    const doctor = await Doctor.create({
      name,
      department,
      qualification,
      experience,
      specialization,
      imageUrl,
      available: available !== undefined ? available : true,
      availability: body.availability || defaultAvailability
    });
    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    console.error('Error creating doctor:', error);
    return NextResponse.json(
      { error: 'Failed to create doctor' },
      { status: 500 }
    );
  }
} 
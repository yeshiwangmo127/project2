import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
import Patient from '@/models/Patient';

// Define User model if not already defined
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  type: String,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.type !== 'doctor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Fetch all patients
    const patients = await User.find({ type: 'patient' })
      .select('name email _id')
      .sort({ name: 1 });

    return NextResponse.json({ patients });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    
    // Check if patient already exists
    const existingPatient = await Patient.findOne({ email: data.email });
    if (existingPatient) {
      return NextResponse.json(existingPatient);
    }
    
    // Create new patient
    const patient = await Patient.create(data);
    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 
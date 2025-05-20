import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import connectDB from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import User from '@/models/User';
import mongoose from 'mongoose';
import Doctor from '@/models/Doctor';

export async function GET() {
  try {
    // Fetch all appointments, populate doctor info if needed
    const appointments = await Appointment.find({})
      .populate({
        path: 'doctorId',
        select: 'name specialty department qualifications'
      })
      .sort({ date: -1, createdAt: -1 });

    // Format the response
    const formattedAppointments = appointments.map(app => ({
      id: app._id,
      date: app.date,
      time: app.time,
      status: app.status,
      department: app.department,
      doctor: app.doctorId ? {
        id: app.doctorId._id,
        name: app.doctorId.name,
        specialty: app.doctorId.specialty,
        department: app.doctorId.department,
        qualifications: app.doctorId.qualifications
      } : null,
      patient: app.patient,
      description: app.description,
      createdAt: app.createdAt
    }));

    return NextResponse.json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { doctorId, date, time = "", department, description, name, email, phone, dateOfBirth } = await request.json();

    // Validate required fields
    if (!doctorId || !date || !department || !name || !email || !phone || !dateOfBirth) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Try to find doctor in User collection
    let doctor = null;
    try {
      doctor = await User.findOne({ _id: new mongoose.Types.ObjectId(doctorId), role: 'doctor' });
    } catch (e) {
      doctor = null;
    }
    // If not found, try Doctor collection
    if (!doctor) {
      try {
        doctor = await Doctor.findById(doctorId);
      } catch (e) {
        doctor = null;
      }
    }
    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }

    // Create the appointment (store patient info directly)
    const appointment = await Appointment.create({
      doctorId,
      date,
      time,
      department,
      status: 'scheduled',
      createdAt: new Date(),
      description,
      patient: {
        name,
        email,
        phone,
        dateOfBirth
      }
    });

    return NextResponse.json({
      id: appointment._id,
      message: 'Appointment booked successfully'
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment. Please try again.' },
      { status: 500 }
    );
  }
} 
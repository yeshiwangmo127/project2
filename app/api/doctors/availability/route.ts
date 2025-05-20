import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Doctor from '@/models/Doctor';

interface TimeSlot {
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface Availability {
  date: Date;
  timeSlots: TimeSlot[];
}

interface DoctorAvailabilityRequest {
  doctorId: string;
  date: string;
  timeSlot: TimeSlot;
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { doctorId, date, timeSlot }: DoctorAvailabilityRequest = await request.json();

    // Fetch the doctor
    const doctor = await Doctor.findById(doctorId);

    // Add the check here:
    if (!doctor || !doctor.availability) {
      return NextResponse.json({ error: 'Doctor has no availability set' }, { status: 400 });
    }

    // Find the availability for the selected date
    const availabilityIndex = doctor.availability.findIndex(
      (a: Availability) => new Date(a.date).toDateString() === new Date(date).toDateString()
    );

    if (availabilityIndex === -1) {
      return NextResponse.json({ error: 'No availability for selected date' }, { status: 400 });
    }

    // Find and update the specific time slot
    const timeSlotIndex = doctor.availability[availabilityIndex].timeSlots.findIndex(
      (slot: TimeSlot) => slot.startTime === timeSlot.startTime && slot.endTime === timeSlot.endTime
    );

    if (timeSlotIndex === -1) {
      return NextResponse.json({ error: 'Invalid time slot' }, { status: 400 });
    }

    if (doctor.availability[availabilityIndex].timeSlots[timeSlotIndex].isBooked) {
      return NextResponse.json({ error: 'Time slot already booked' }, { status: 400 });
    }

    // Update the time slot to booked
    doctor.availability[availabilityIndex].timeSlots[timeSlotIndex].isBooked = true;
    await doctor.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating availability:', error);
    return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 });
  }
}
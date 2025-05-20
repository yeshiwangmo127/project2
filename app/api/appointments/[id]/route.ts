import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Appointment from '@/models/Appointment';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { status } = await request.json();
    const updated = await Appointment.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );
    if (!updated) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deleted = await Appointment.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
} 
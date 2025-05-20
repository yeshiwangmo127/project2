import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Appointment from '@/models/Appointment';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const { status } = await request.json();
    const updated = await Appointment.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );
    
    if (!updated) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const deleted = await Appointment.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
} 
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// GET all users
export async function GET() {
  await connectDB();
  const users = await User.find({}).lean();
  return NextResponse.json(users);
}

// Create a new user
export async function POST(request: Request) {
  await connectDB();
  const { name, email, password, userType, department } = await request.json();
  const user = await User.create({ name, email, password, userType, department });
  return NextResponse.json(user);
}

// Update a user
export async function PUT(request: Request) {
  await connectDB();
  const { id, name, email, userType, department } = await request.json();
  const user = await User.findByIdAndUpdate(
    id,
    { name, email, userType, department },
    { new: true }
  );
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json(user);
}

// Delete a user
export async function DELETE(request: Request) {
  await connectDB();
  const { id } = await request.json();
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
} 
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).lean();
    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || user.userType,
      department: user.department,
      createdAt: user.createdAt
    }));
    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, password, role, department } = await request.json();

    const { rows } = await sql`
      INSERT INTO users (name, email, password, role, department, created_at)
      VALUES (${name}, ${email}, ${password}, ${role}, ${department}, CURRENT_TIMESTAMP)
      RETURNING id
    `;

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, email, role, department } = await request.json();

    const { rows } = await sql`
      UPDATE users
      SET 
        name = ${name},
        email = ${email},
        role = ${role},
        department = ${department}
      WHERE id = ${id}
      RETURNING id
    `;

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    await sql`
      DELETE FROM users
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/db';
import User from '../../../../models/User';

export async function POST(request: Request) {
  try {
    await connectDB();

    const { name, email, password, userType } = await request.json();

    // Validate input
    if (!name || !email || !password || !userType) {
      return NextResponse.json(
        { message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      );
    }

    try {
      // Create new user
      const user = await User.create({
        name,
        email,
        password,
        userType
      });

      return NextResponse.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType
        }
      });
    } catch (dbError: any) {
      console.error('Database error during user creation:', dbError);
      
      // Check for validation errors
      if (dbError.name === 'ValidationError') {
        const validationErrors = Object.values(dbError.errors).map((err: any) => err.message);
        return NextResponse.json(
          { message: validationErrors.join(', ') },
          { status: 400 }
        );
      }

      throw dbError; // Re-throw if it's not a validation error
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error during registration' },
      { status: 500 }
    );
  }
} 
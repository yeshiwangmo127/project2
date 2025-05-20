import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/db';
import User from '../../../../models/User';

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    console.log('Trying to login:', email);

    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    console.log('User found:', !!user);
    if (user) {
      console.log('User password (hashed):', user.password);
      // Check if password matches
      const isMatch = await user.matchPassword(password);
      console.log('Password match:', isMatch);

      if (!isMatch) {
        return NextResponse.json(
          { message: 'Invalid credentials' },
          { status: 401 }
        );
      }
    } else {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session/token here if needed
    // For now, just return success
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
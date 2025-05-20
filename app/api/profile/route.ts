import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import User from '@/models/User';
import { writeFile } from 'fs/promises';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const file = formData.get('profilePic') as File | null;

    // Assume user ID is in localStorage or session (for demo, get from email)
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    let profilePicUrl = user.profilePic;
    if (file && typeof file !== 'string') {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const fileName = `${user._id}_${Date.now()}_${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, new Uint8Array(buffer));
      profilePicUrl = `/uploads/${fileName}`;
    }

    user.name = name;
    user.email = email;
    user.profilePic = profilePicUrl;
    await user.save();

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        profilePic: user.profilePic
      }
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Profile update failed' }, { status: 500 });
  }
} 
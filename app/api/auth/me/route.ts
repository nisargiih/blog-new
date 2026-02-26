import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { User } from '@/lib/models';

export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ user: null });

    await dbConnect();
    const user = await User.findById(authUser.userId, '-password');
    if (!user) return NextResponse.json({ user: null });

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}

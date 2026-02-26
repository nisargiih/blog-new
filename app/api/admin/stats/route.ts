import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Blog, User, Category, Tag } from '@/lib/models';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const [totalBlogs, publishedBlogs, draftBlogs, totalUsers, totalCategories, totalTags] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ status: 'published' }),
      Blog.countDocuments({ status: 'draft' }),
      User.countDocuments(),
      Category.countDocuments(),
      Tag.countDocuments(),
    ]);

    return NextResponse.json({
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      totalUsers,
      totalCategories,
      totalTags,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Blog, Category, Tag } from '@/lib/models';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('q');
    const statusParam = searchParams.get('status');
    
    let query: any = {};
    
    if (statusParam === 'all') {
      // Admin view, no status filter unless specified
    } else {
      query.status = statusParam || 'published';
    }

    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) query.category = cat._id;
    }

    if (tag) {
      const t = await Tag.findOne({ slug: tag });
      if (t) query.tags = t._id;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const blogs = await Blog.find(query)
      .populate('category')
      .populate('tags')
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json(blogs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const data = await req.json();
    
    const blog = await Blog.create({
      ...data,
      author: user.userId,
    });

    return NextResponse.json(blog);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

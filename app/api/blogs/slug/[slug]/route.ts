import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Blog } from '@/lib/models';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await dbConnect();
    const { slug } = await params;
    const blog = await Blog.findOne({ slug, status: 'published' })
      .populate('category')
      .populate('tags')
      .populate('author', 'name');
    
    if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(blog);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

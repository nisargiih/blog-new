'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/navbar';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/slug/${slug}`);
        if (res.ok) setBlog(await res.json());
      } catch (error) {
        console.error('Failed to fetch blog', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!blog) return <div className="min-h-screen flex items-center justify-center">Post not found.</div>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <article className="max-w-4xl mx-auto px-4 py-20">
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link 
              href={`/category/${blog.category?.slug}`}
              className="text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors mb-4 block"
            >
              {blog.category?.name}
            </Link>
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-8">
              {blog.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-black/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-xs">
                  {blog.author?.name[0]}
                </div>
                <span className="font-medium text-black">{blog.author?.name}</span>
              </div>
              <span>•</span>
              <time>{format(new Date(blog.createdAt), 'MMMM d, yyyy')}</time>
            </div>
          </motion.div>
        </header>

        {blog.featuredImage && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-16 shadow-2xl shadow-black/10"
          >
            <Image
              src={blog.featuredImage}
              alt={blog.title}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}

        <div className="prose prose-lg prose-zinc max-w-none mx-auto font-serif leading-relaxed">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>

        <footer className="mt-20 pt-12 border-t border-black/5">
          <div className="flex flex-wrap gap-2 mb-12">
            {blog.tags?.map((tag: any) => (
              <Link
                key={tag._id}
                href={`/tag/${tag.slug}`}
                className="px-4 py-1.5 bg-zinc-50 text-[10px] font-bold uppercase tracking-wider rounded-full hover:bg-black hover:text-white transition-all"
              >
                #{tag.name}
              </Link>
            ))}
          </div>

          <div className="bg-zinc-50 rounded-3xl p-8 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-zinc-200 flex items-center justify-center text-2xl font-bold text-zinc-400">
              {blog.author?.name[0]}
            </div>
            <div>
              <h4 className="font-bold text-lg">{blog.author?.name}</h4>
              <p className="text-sm text-black/60 mt-1">
                A passionate storyteller and contributor at Lumina Blog. Sharing insights on technology and design.
              </p>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}

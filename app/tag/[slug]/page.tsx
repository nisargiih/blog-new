'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/navbar';
import BlogCard from '@/components/blog-card';

export default function TagPage() {
  const { slug } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/blogs?tag=${slug}`);
        if (res.ok) setBlogs(await res.json());
      } catch (error) {
        console.error('Fetch failed', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-20">
        <header className="mb-20 text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-4 block">Tagged with</span>
          <h1 className="text-5xl font-serif font-bold mb-6 capitalize">#{slug}</h1>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3].map(i => <div key={i} className="h-80 bg-zinc-50 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {blogs.map((blog: any) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
            {blogs.length === 0 && (
              <div className="col-span-full text-center py-40 border border-dashed border-zinc-200 rounded-3xl">
                <p className="text-zinc-400">No stories found with this tag yet.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

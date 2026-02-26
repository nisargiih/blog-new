'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/navbar';
import BlogCard from '@/components/blog-card';

export default function CategoryPage() {
  const { slug } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsRes, catsRes] = await Promise.all([
          fetch(`/api/blogs?category=${slug}`),
          fetch('/api/categories')
        ]);
        if (blogsRes.ok) setBlogs(await blogsRes.json());
        if (catsRes.ok) {
          const cats = await catsRes.json();
          setCategory(cats.find((c: any) => c.slug === slug));
        }
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
        <header className="mb-20 text-center max-w-2xl mx-auto">
          <h1 className="text-5xl font-serif font-bold mb-6 capitalize">{category?.name || slug}</h1>
          <p className="text-black/60 leading-relaxed">
            {category?.description || `Explore our collection of stories in the ${slug} category.`}
          </p>
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
                <p className="text-zinc-400">No stories found in this category yet.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

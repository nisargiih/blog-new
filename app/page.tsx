'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import BlogCard from '@/components/blog-card';
import Link from 'next/link';
import { motion } from 'motion/react';

export default function HomePage() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsRes, catsRes] = await Promise.all([
          fetch('/api/blogs'),
          fetch('/api/categories')
        ]);
        if (blogsRes.ok) setBlogs(await blogsRes.json());
        if (catsRes.ok) setCategories(await catsRes.json());
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-zinc-900">
          <div className="absolute inset-0 opacity-40">
            <img 
              src="https://picsum.photos/1920/1080?grayscale" 
              alt="Hero" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 text-center px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-8xl font-serif font-bold text-white mb-6 tracking-tight">
                Stories that <br /> <span className="italic font-light">illuminate.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/70 font-light max-w-2xl mx-auto mb-8">
                Explore a collection of deep dives into technology, design, and the human experience.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {categories.slice(0, 4).map((cat: any) => (
                  <Link
                    key={cat._id}
                    href={`/category/${cat.slug}`}
                    className="px-6 py-2 border border-white/20 rounded-full text-white text-sm font-medium hover:bg-white hover:text-black transition-all"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-serif font-bold">Latest Stories</h2>
              <p className="text-black/40 text-sm mt-2">Fresh perspectives, updated daily.</p>
            </div>
            <Link href="/blogs" className="text-sm font-bold uppercase tracking-widest hover:underline underline-offset-8">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[16/10] bg-zinc-100 rounded-2xl mb-4" />
                  <div className="h-4 bg-zinc-100 rounded w-1/4 mb-2" />
                  <div className="h-6 bg-zinc-100 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-zinc-100 rounded w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {blogs.map((blog: any) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
              {blogs.length === 0 && (
                <div className="col-span-full text-center py-20 bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
                  <p className="text-zinc-400">No stories found yet. Check back later!</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-zinc-50 border-t border-black/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <Link href="/" className="text-2xl font-serif font-bold tracking-tight text-black">
                LUMINA
              </Link>
              <p className="mt-4 text-black/60 max-w-sm leading-relaxed">
                A digital garden where ideas grow and perspectives shift. Join our community of curious minds.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Explore</h4>
              <ul className="space-y-4 text-sm text-black/60">
                <li><Link href="/" className="hover:text-black">Home</Link></li>
                <li><Link href="/blogs" className="hover:text-black">All Posts</Link></li>
                <li><Link href="/categories" className="hover:text-black">Categories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Connect</h4>
              <ul className="space-y-4 text-sm text-black/60">
                <li><Link href="#" className="hover:text-black">Twitter</Link></li>
                <li><Link href="#" className="hover:text-black">Instagram</Link></li>
                <li><Link href="#" className="hover:text-black">Newsletter</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-black/40">
            <p>© 2024 LUMINA BLOG. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8">
              <Link href="#" className="hover:text-black">Privacy Policy</Link>
              <Link href="#" className="hover:text-black">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

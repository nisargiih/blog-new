'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/navbar';
import BlogCard from '@/components/blog-card';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/blogs?q=${encodeURIComponent(query)}`);
        if (res.ok) setBlogs(await res.json());
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <header className="mb-12">
        <h1 className="text-3xl font-serif font-bold">
          Search Results for <span className="italic">"{query}"</span>
        </h1>
        <p className="text-black/40 text-sm mt-2">{blogs.length} stories found</p>
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
              <p className="text-zinc-400">No results found for your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Suspense fallback={<div className="p-20 text-center">Loading search...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}

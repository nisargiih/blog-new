'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin-sidebar';
import Link from 'next/link';
import { Plus, Edit2, Trash2, ExternalLink, Search } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blogs?status=all'); // I should update the API to handle 'all'
      if (res.ok) setPosts(await res.json());
    } catch (error) {
      console.error('Failed to fetch posts', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) fetchPosts();
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  const filteredPosts = posts.filter((post: any) => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-serif font-bold text-zinc-900">Posts</h1>
            <p className="text-zinc-500 text-sm mt-1">Manage and edit your blog content.</p>
          </div>
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-black/80 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Post
          </Link>
        </header>

        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-zinc-100 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-black/5"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50/50 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-8 bg-zinc-50/20" />
                    </tr>
                  ))
                ) : filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-zinc-400 text-sm">
                      No posts found.
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post: any) => (
                    <tr key={post._id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-zinc-900">{post.title}</div>
                        <div className="text-[10px] text-zinc-400 font-mono mt-1">/{post.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-zinc-600 bg-zinc-100 px-2 py-1 rounded">
                          {post.category?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full",
                          post.status === 'published' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                        )}>
                          {post.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-500">
                        {format(new Date(post.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-900 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/posts/edit/${post._id}`}
                            className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-900 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(post._id)}
                            className="p-2 hover:bg-red-50 rounded-lg text-zinc-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

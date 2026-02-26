'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin-sidebar';
import { Plus, Trash2, Tag as TagIcon } from 'lucide-react';

export default function AdminTags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTagName, setNewTagName] = useState('');

  const fetchTags = async () => {
    try {
      const res = await fetch('/api/tags');
      if (res.ok) setTags(await res.json());
    } catch (error) {
      console.error('Failed to fetch tags', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    
    const slug = newTagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTagName, slug }),
      });
      if (res.ok) {
        setNewTagName('');
        fetchTags();
      }
    } catch (error) {
      console.error('Save failed', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/tags/${id}`, { method: 'DELETE' });
      fetchTags();
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <header className="mb-12">
          <h1 className="text-3xl font-serif font-bold text-zinc-900">Tags</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage keywords for your blog posts.</p>
        </header>

        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="mb-12 flex gap-4">
            <input
              type="text"
              placeholder="Enter tag name..."
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="flex-1 px-6 py-4 bg-white border border-zinc-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-black/5 transition-all outline-none"
            />
            <button
              type="submit"
              className="bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-black/80 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Add
            </button>
          </form>

          <div className="flex flex-wrap gap-4">
            {loading ? (
              [1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 w-24 bg-white rounded-full animate-pulse" />)
            ) : (
              tags.map((tag: any) => (
                <div 
                  key={tag._id} 
                  className="flex items-center gap-3 bg-white pl-4 pr-2 py-2 rounded-full border border-zinc-100 shadow-sm group hover:border-black transition-all"
                >
                  <TagIcon className="w-3 h-3 text-zinc-400 group-hover:text-black" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 group-hover:text-black">{tag.name}</span>
                  <button 
                    onClick={() => handleDelete(tag._id)}
                    className="p-1 hover:bg-red-50 rounded-full text-zinc-300 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

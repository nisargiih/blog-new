'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin-sidebar';
import { Plus, Edit2, Trash2, Search, Layers } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) setCategories(await res.json());
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (cat: any = null) => {
    if (cat) {
      setEditingCategory(cat);
      setFormData({ name: cat.name, slug: cat.slug, description: cat.description || '' });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', slug: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCategory ? `/api/categories/${editingCategory._id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        fetchCategories();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Save failed', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      fetchCategories();
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-serif font-bold text-zinc-900">Categories</h1>
            <p className="text-zinc-500 text-sm mt-1">Organize your posts into meaningful groups.</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-black/80 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="h-40 bg-white rounded-2xl animate-pulse" />)
          ) : (
            categories.map((cat: any) => (
              <div key={cat._id} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-zinc-50 rounded-xl group-hover:bg-black group-hover:text-white transition-all">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleOpenModal(cat)} className="p-2 hover:bg-zinc-50 rounded-lg text-zinc-400 hover:text-zinc-900">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(cat._id)} className="p-2 hover:bg-red-50 rounded-lg text-zinc-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-zinc-900">{cat.name}</h3>
                <p className="text-xs font-mono text-zinc-400 mt-1">/{cat.slug}</p>
                <p className="text-sm text-zinc-500 mt-4 line-clamp-2">{cat.description || 'No description provided.'}</p>
              </div>
            ))
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-serif font-bold mb-6">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setFormData({ ...formData, name, slug });
                    }}
                    className="w-full px-4 py-3 bg-zinc-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-black/5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Slug</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-black/5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-black/5 h-24 resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 bg-zinc-100 text-zinc-600 rounded-xl font-bold hover:bg-zinc-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-black text-white rounded-xl font-bold hover:bg-black/80 transition-all"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

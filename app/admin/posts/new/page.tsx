'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminSidebar from '@/components/admin-sidebar';
import { ChevronLeft, Save, Image as ImageIcon, Eye } from 'lucide-react';
import Link from 'next/link';

export default function PostEditor() {
  const router = useRouter();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    featuredImage: '',
    category: '',
    tags: [] as string[],
    status: 'draft',
    metaTitle: '',
    metaDescription: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, tagsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/tags')
        ]);
        if (catsRes.ok) setCategories(await catsRes.json());
        if (tagsRes.ok) setTags(await tagsRes.json());

        if (isEdit) {
          const postRes = await fetch(`/api/blogs/${id}`);
          if (postRes.ok) {
            const post = await postRes.json();
            setFormData({
              title: post.title,
              slug: post.slug,
              content: post.content,
              featuredImage: post.featuredImage || '',
              category: post.category?._id || '',
              tags: post.tags?.map((t: any) => t._id) || [],
              status: post.status,
              metaTitle: post.metaTitle || '',
              metaDescription: post.metaDescription || '',
            });
          }
        }
      } catch (error) {
        console.error('Fetch failed', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEdit]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, title, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isEdit ? `/api/blogs/${id}` : '/api/blogs';
      const method = isEdit ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/posts');
      } else {
        alert('Failed to save post');
      }
    } catch (error) {
      console.error('Save failed', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Link href="/admin/posts" className="p-2 hover:bg-white rounded-full transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-serif font-bold">
                {isEdit ? 'Edit Post' : 'New Post'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="bg-white border-none rounded-xl px-4 py-2 text-sm font-bold shadow-sm focus:ring-2 focus:ring-black/5"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-xl font-bold hover:bg-black/80 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Post'}
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-4">
                <input
                  type="text"
                  placeholder="Post Title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full text-3xl font-serif font-bold border-none p-0 focus:ring-0 placeholder:text-zinc-200"
                  required
                />
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <span>Slug:</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="bg-transparent border-none p-0 focus:ring-0 w-full"
                  />
                </div>
                <textarea
                  placeholder="Write your story here... (Markdown supported)"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full min-h-[500px] border-none p-0 focus:ring-0 resize-none text-lg leading-relaxed placeholder:text-zinc-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-zinc-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black/5"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat: any) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Featured Image URL</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      value={formData.featuredImage}
                      onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-zinc-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-black/5"
                      placeholder="https://..."
                    />
                  </div>
                  {formData.featuredImage && (
                    <div className="mt-4 aspect-video rounded-xl overflow-hidden bg-zinc-100">
                      <img src={formData.featuredImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag: any) => (
                      <button
                        key={tag._id}
                        type="button"
                        onClick={() => {
                          const newTags = formData.tags.includes(tag._id)
                            ? formData.tags.filter(id => id !== tag._id)
                            : [...formData.tags, tag._id];
                          setFormData(prev => ({ ...prev, tags: newTags }));
                        }}
                        className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                          formData.tags.includes(tag._id)
                            ? "bg-black text-white"
                            : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200"
                        )}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-6">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Eye className="w-4 h-4" /> SEO Settings
                </h3>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Meta Title</label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                    className="w-full px-4 py-3 bg-zinc-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-black/5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Meta Description</label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                    className="w-full px-4 py-3 bg-zinc-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-black/5 h-24 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

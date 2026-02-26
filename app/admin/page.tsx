'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin-sidebar';
import { 
  FileText, 
  Users, 
  Layers, 
  Tag, 
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) setStats(await res.json());
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Posts', value: stats?.totalBlogs, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Total Users', value: stats?.totalUsers, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Categories', value: stats?.totalCategories, icon: Layers, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { name: 'Tags', value: stats?.totalTags, icon: Tag, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <header className="mb-12">
          <h1 className="text-3xl font-serif font-bold text-zinc-900">Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">Welcome back, Admin. Here's what's happening today.</p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {statCards.map((stat, i) => (
                <motion.div
                  key={stat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={stat.bg + " p-2 rounded-lg"}>
                      <stat.icon className={stat.color + " w-5 h-5"} />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +12%
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-zinc-900">{stat.value}</div>
                  <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mt-1">{stat.name}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg">Recent Activity</h3>
                  <button className="text-xs font-bold text-zinc-400 hover:text-zinc-900 flex items-center gap-1">
                    View All <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-6">
                  {/* Mock activity for now */}
                  {[
                    { user: 'John Doe', action: 'published a new post', target: 'The Future of AI', time: '2 hours ago' },
                    { user: 'Jane Smith', action: 'joined the community', target: '', time: '5 hours ago' },
                    { user: 'Admin', action: 'created a new category', target: 'Technology', time: '1 day ago' },
                  ].map((act, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-400">
                        {act.user[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-zinc-900">
                          <span className="font-bold">{act.user}</span> {act.action} {act.target && <span className="italic">"{act.target}"</span>}
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-900 rounded-2xl p-6 text-white">
                <h3 className="font-bold text-lg mb-6">Quick Stats</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                      <span>Published Ratio</span>
                      <span>{Math.round((stats?.publishedBlogs / stats?.totalBlogs) * 100) || 0}%</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500" 
                        style={{ width: `${(stats?.publishedBlogs / stats?.totalBlogs) * 100 || 0}%` }} 
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                      <span>Drafts</span>
                      <span>{stats?.draftBlogs}</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500" 
                        style={{ width: `${(stats?.draftBlogs / stats?.totalBlogs) * 100 || 0}%` }} 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-12 p-4 bg-zinc-800 rounded-xl">
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Tip: Use the SEO metadata fields to improve your blog's visibility on search engines.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

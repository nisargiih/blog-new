'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin-sidebar';
import { Mail, Shield, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users');
        if (res.ok) setUsers(await res.json());
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <header className="mb-12">
          <h1 className="text-3xl font-serif font-bold text-zinc-900">Users</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage your community members and roles.</p>
        </header>

        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50/50 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-8 bg-zinc-50/20" />
                  </tr>
                ))
              ) : (
                users.map((user: any) => (
                  <tr key={user._id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-400">
                          {user.name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-zinc-900">{user.name}</div>
                          <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                            <Mail className="w-3 h-3" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Shield className={`w-3 h-3 ${user.role === 'ADMIN' ? 'text-amber-500' : 'text-zinc-400'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${user.role === 'ADMIN' ? 'text-amber-600' : 'text-zinc-500'}`}>
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(user.createdAt), 'MMM d, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

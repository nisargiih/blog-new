'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Layers, 
  Tag, 
  Users, 
  Home,
  PlusCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Posts', href: '/admin/posts', icon: FileText },
  { name: 'Categories', href: '/admin/categories', icon: Layers },
  { name: 'Tags', href: '/admin/tags', icon: Tag },
  { name: 'Users', href: '/admin/users', icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-zinc-950 text-zinc-400 border-r border-zinc-800 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 text-white font-serif text-xl font-bold italic">
          LUMINA <span className="text-[10px] font-sans font-normal not-italic opacity-50 uppercase tracking-widest">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <div className="pb-4">
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-3 px-4 py-3 bg-white text-black rounded-lg text-sm font-semibold hover:bg-zinc-200 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            New Post
          </Link>
        </div>

        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-4 py-2">
          Management
        </div>

        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all duration-200",
                isActive 
                  ? "bg-zinc-800 text-white" 
                  : "hover:bg-zinc-900 hover:text-zinc-200"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2 text-sm hover:text-white transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to Site
        </Link>
      </div>
    </aside>
  );
}

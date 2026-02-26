import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

interface BlogCardProps {
  blog: any;
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <article className="group flex flex-col gap-4">
      <Link href={`/blog/${blog.slug}`} className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-100">
        <Image
          src={blog.featuredImage || `https://picsum.photos/seed/${blog._id}/800/500`}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider rounded-full">
            {blog.category?.name}
          </span>
        </div>
      </Link>
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[11px] font-medium text-black/40 uppercase tracking-wider">
          <span>{blog.author?.name}</span>
          <span>•</span>
          <span>{format(new Date(blog.createdAt), 'MMM d, yyyy')}</span>
        </div>
        
        <Link href={`/blog/${blog.slug}`}>
          <h3 className="text-xl font-serif font-bold leading-tight group-hover:underline decoration-1 underline-offset-4">
            {blog.title}
          </h3>
        </Link>
        
        <p className="text-sm text-black/60 line-clamp-2 leading-relaxed">
          {blog.metaDescription || blog.content.substring(0, 150).replace(/[#*`]/g, '')}...
        </p>
      </div>
    </article>
  );
}

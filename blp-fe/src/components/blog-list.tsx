"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { fetchApi } from "@/lib/fetch-api";
import Image from "next/image";

interface Blog {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
    name: string;
  };
  tags: Array<{ id: number; name: string }>;
}

export function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  const fetchBlogs = async () => {
    try {
      const response = await fetchApi(`/blogs?page=${page}&limit=10`);
      const data = await response.json();
      if (data.success) {
        if (page === 1) {
          // If it's first page, replace existing blogs
          setBlogs(data.data.blogs);
        } else {
          // If loading more, append to existing blogs
          setBlogs((prevBlogs) => [...prevBlogs, ...data.data.blogs]);
        }
        setHasMore(data.data.meta.page < data.data.meta.totalPages);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch blogs",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto max-w-7xl ">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog, index) => (
          <article key={index} className="group">
            <Link href={`/blog/${blog.id}`}>
              <div className="space-y-4">
                <div className="aspect-[16/9] overflow-hidden rounded-lg">
                  <Image
                    src={blog.thumbnail}
                    alt={blog.title}
                    width={600}
                    height={338}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "/thumbnail-placeholder.png";
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{blog.user.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(blog.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <h2 className="text-xl font-bold font-serif line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-muted-foreground line-clamp-3">
                  {blog.content}
                </p>
                <div className="flex gap-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={`${blog.id}-${tag.id}`}
                      className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
      {hasMore && (
        <div className="mt-12 text-center">
          <Button
            variant="outline"
            onClick={() => setPage((prevPage) => prevPage + 1)}
            className="rounded-full px-8"
          >
            Show more stories
          </Button>
        </div>
      )}
    </div>
  );
}

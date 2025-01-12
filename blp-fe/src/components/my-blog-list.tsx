"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { fetchApi } from "@/lib/fetch-api";
import { useAuth } from "./auth-provider";

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

export function MyBlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<number | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetchBlogs();
  }, [page, user?.id]);
  console.log(user);

  const fetchBlogs = async () => {
    try {
      const response = await fetchApi(
        `/blogs/user/${user?.id}?page=${page}&limit=10`
      );
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

  const handleDelete = async (id: number) => {
    try {
      const response = await fetchApi(`/blogs/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setBlogs(blogs.filter((blog) => blog.id !== id));
        toast({
          title: "Success",
          description: "Blog deleted successfully",
        });
      } else {
        throw new Error(data.message || "Failed to delete blog");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    }
    setDeleteDialogOpen(false);
    setBlogToDelete(null);
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog, index) => (
          <article key={index} className="group relative">
            <Link href={`/blog/${blog.id}`}>
              <div className="space-y-4">
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
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
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(blog.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <h2 className="text-xl font-bold font-serif line-clamp-2">
                    {blog.title}
                  </h2>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0 "
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault()
                          router.push(`/edit/${blog.id}`)}}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          setDeleteDialogOpen(true);
                          setBlogToDelete(blog.id);
                        }}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-muted-foreground line-clamp-3">
                  {blog.content}
                </p>
                <div className="flex gap-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag.id}
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
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this blog?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => blogToDelete && handleDelete(blogToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

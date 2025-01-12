import { MyBlogList } from "@/components/my-blog-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MyBlogs() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Blogs I&apos;ve created</h1>
        <Link href="/create">
        <Button variant={"ghost"}>Create Blog</Button>
        </Link>
      </div>
    
      <MyBlogList />
    </div>
  );
}

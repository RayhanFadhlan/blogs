import { BlogList } from "@/components/blog-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Read Interesting Ideas</h1>
        <Link href="/create">
          <Button variant={"ghost"}>Create Blog</Button>
        </Link>
      </div>
      <BlogList />
    </main>
  );
}

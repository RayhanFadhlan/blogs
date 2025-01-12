'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useToast } from '@/hooks/use-toast'
import { CommentSection } from '@/components/comment-section'
import { fetchApi } from '@/lib/fetch-api'
import remarkGfm from 'remark-gfm'

interface Blog {
  id: number
  title: string
  content: string
  thumbnail: string
  createdAt: string
  user: {
    id: number
    username: string
    name: string
  }
  tags: Array<{ id: number; name: string }>
}

const sampleBlog: Blog = {
  id: 1,
  title: "Understanding React Server Components",
  content: `
# Understanding React Server Components

**React Server Components (RSC) represent a groundbreaking evolution in how we build React applications. They introduce a new paradigm that allows components to execute exclusively on the server, offering numerous benefits for performance and developer experience.**

## What are Server Components?

Server Components are React components that are rendered on the server and can access server-side resources directly. Unlike traditional React components, they:

- Execute only on the server
- Can access databases and filesystems directly
- Reduce client-side JavaScript bundle size
- Improve initial page load performance

## Key Benefits

### 1. Improved Performance

Server Components can significantly improve application performance by:

- Reducing the JavaScript bundle size
- Eliminating client-side processing for server-only logic
- Leveraging server-side capabilities efficiently

### 2. Better Developer Experience

The development experience is enhanced through:

\`\`\`javascript
// Example of a Server Component
async function BlogPost({ id }) {
  const post = await db.query('SELECT * FROM posts WHERE id = ?', [id]);
  return <article>{post.content}</article>;
}
\`\`\`

### 3. Seamless Integration

Server Components integrate smoothly with existing React applications:

- Work alongside traditional client components
- Support gradual adoption
- Maintain React's component model

## Best Practices

1. Use Server Components for:
   - Data fetching
   - Access to backend resources
   - Large dependencies
   
2. Use Client Components for:
   - Interactivity
   - Browser APIs
   - State management

## Conclusion

React Server Components represent a significant step forward in React's evolution, offering developers powerful new tools for building faster, more efficient applications.
`,
  thumbnail: "/placeholder.svg?height=600&width=1200",
  createdAt: "2024-01-12T09:29:59.386Z",
  user: {
    id: 1,
    username: "johndoe",
    name: "John Doe"
  },
  tags: [
    { id: 1, name: "React" },
    { id: 2, name: "Web Development" },
    { id: 3, name: "Programming" }
  ]
}

export default function BlogPost() {
  const params = useParams()
  const [blog, setBlog] = useState<Blog>(sampleBlog)
  const { toast } = useToast()
  const readingTime = Math.ceil(blog.content.split(' ').length / 200)

  useEffect(() => {
    fetchBlog()
  }, [])

  const fetchBlog = async () => {
    try {
      const response = await fetchApi(`/blogs/${params.id}`)
      const data = await response.json()
      if (data.success) {
        setBlog(data.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch blog post",
          variant: "destructive",
        })
      }
    } catch{
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <article className="min-h-screen">
      <div className="border-b">
        <div className="container max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Avatar>
              <AvatarImage src={`https://avatar.vercel.sh/${blog.user.username}`} />
              <AvatarFallback>{blog.user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{blog.user.name}</div>
              <div className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })} 
                · {readingTime} min read
              </div>
            </div>
            {/* <Button variant="outline" className="ml-auto rounded-full">
              Follow
            </Button> */}
          </div>
          <h1 className="text-4xl font-serif font-bold mb-6">
            {blog.title}
          </h1>
          <div className="flex gap-2 mb-8">
            {blog.tags.map(tag => (
              <span
                key={tag.id}
                className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm"
              >
                {tag.name}
              </span>
            ))}
          </div>
            <div className="aspect-[2/1] relative mb-8">
            <Image
              src={blog.thumbnail}
              alt={blog.title}
              fill
              className="object-cover rounded-lg"
              priority
              onError={(e) => {
              e.currentTarget.src = '/thumbnail-placeholder.png';
              }}
            />
            </div>
        </div>
      </div>
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
           
          >
            {blog.content}
          </ReactMarkdown>
        </div>
        <Separator className="my-12" />
        <CommentSection blogId={blog.id} />
      </div>
    </article>
  )
}


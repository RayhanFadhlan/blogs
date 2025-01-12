'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from '@/components/auth-provider'
import MarkdownEditor from '@/components/markdown-editor'
import { useToast } from '@/hooks/use-toast'
import { fetchApi } from '@/lib/fetch-api'

export default function CreateBlog() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a blog post",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)
    formData.append('tags', tags)
    if (thumbnail) {
      formData.append('thumbnail', thumbnail)
    }

    try {
      const response = await fetchApi('/blogs', {
        
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Blog created successfully",
        })
        router.push(`/blog/${data.data.id}`)
      } else {
        throw new Error(data.message || 'Failed to create blog')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-bold mb-8">Create a New Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. React, Web Development, Programming"
          />
        </div>
        <div>
          <Label htmlFor="thumbnail">Thumbnail Image</Label>
          <Input
            id="thumbnail"
            type="file"
            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
            accept="image/*"
          />
        </div>
        <div>
          <Label htmlFor="content">Content</Label>
          <MarkdownEditor
            value={content}
            onChange={setContent}
          />
        </div>
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Blog Post'}
        </Button>
      </form>
    </div>
  )
}


'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatDistanceToNow } from 'date-fns'
import { MoreVertical, Edit, Trash } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast'
import { fetchApi } from '@/lib/fetch-api'

interface Comment {
  id: number
  content: string
  createdAt: string
  user: {
    id: number
    username: string
    name: string
  }
}

export function CommentSection({ blogId }: { blogId: number }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [editingComment, setEditingComment] = useState<Comment | null>(null)
  const [editedContent, setEditedContent] = useState('')
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchComments()
  }, [blogId])

  const fetchComments = async () => {
    try {
      const response = await fetchApi(`/comments/${blogId}`)
      const data = await response.json()
      if (data.success) {
        setComments(data.data)
      }
    } catch  {
      toast({
        title: "Error",
        description: "Failed to fetch comments",
        variant: "destructive",
      })
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to comment",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetchApi('/comments', {
        method: 'POST',
        body: JSON.stringify({
          content: newComment,
          blogId,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setComments([data.data, ...comments])
        setNewComment('')
        toast({
          title: "Success",
          description: "Comment posted successfully",
        })
      }
    } catch  {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      })
    }
  }

  const handleEditComment = async () => {
    if (!editingComment) return

    try {
      const response = await fetchApi(`/comments/${editingComment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setComments(comments.map(comment => 
          comment.id === editingComment.id ? { ...comment, content: editedContent } : comment
        ))
        setIsEditDialogOpen(false)
        setEditingComment(null)
        setEditedContent('')
        toast({
          title: "Success",
          description: "Comment updated successfully",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update comment",
        variant: "destructive",
      })
    }
  }

  const handleDeleteComment = async () => {
    if (!commentToDelete) return

    try {
      const response = await fetchApi(`/comments/${commentToDelete}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (data.success) {
        setComments(comments.filter(comment => comment.id !== commentToDelete))
        setIsDeleteDialogOpen(false)
        setCommentToDelete(null)
        toast({
          title: "Success",
          description: "Comment deleted successfully",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-serif font-bold">Comments</h2>
      
      {user ? (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <Button type="submit" className="rounded-full">
            Post Comment
          </Button>
        </form>
      ) : (
        <p className="text-muted-foreground">
          Please sign in to comment on this post.
        </p>
      )}

      <div className="space-y-6">
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-4">
            <Avatar>
              <AvatarImage src={`https://avatar.vercel.sh/${comment.user.username}`} />
              <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-medium">{comment.user.name}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                {user && user.id === comment.user.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setEditingComment(comment)
                        setEditedContent(comment.content)
                        setIsEditDialogOpen(true)
                      }}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setCommentToDelete(comment.id)
                        setIsDeleteDialogOpen(true)
                      }}>
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <p className="text-muted-foreground">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
            <DialogDescription>
              Make changes to your comment here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditComment}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this comment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your comment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteComment}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


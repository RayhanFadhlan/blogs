'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<string>('write')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="write">Write</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="write" className="mt-0">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your blog post content here..."
          className="min-h-[400px] font-mono"
        />
      </TabsContent>
      <TabsContent value="preview" className="mt-0">
        <div className="border rounded-md p-4 min-h-[400px] prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown>{value}</ReactMarkdown>
        </div>
      </TabsContent>
    </Tabs>
  )
}

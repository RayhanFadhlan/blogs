'use client';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { fetchApi } from "@/lib/fetch-api";
export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetchApi('/register', {
        method: 'POST',
        body: JSON.stringify({ name, username, password }),
      })
      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Registration successful. Please login.",
        })
        router.push('/login')
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Enter your username below to register to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Username</Label>
                <Input
                  id="username"
                  type="username"
                  placeholder="johndoe"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Name</Label>
                <Input
                  id="name"
                  type="name"
                  placeholder="John Doe"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                 
                </div>
                <Input id="password" type="password" required onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" >
                Register
              </Button>
            
            </div>
            <div className="mt-4 text-center text-sm">
              already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
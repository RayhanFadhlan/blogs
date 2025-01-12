"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="py-6 mb-8 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Han&apos;s Blog
        </Link>
        <nav>
          {user ? (
            <>
              {/* <Button variant="ghost" asChild>
                <Link href="/create">Create Blog</Link>
              </Button> */}
               <Button variant="ghost" asChild>
                <Link href="/myblogs">My Blogs</Link>
              </Button>
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
          <Button variant="outline" size="icon" onClick={toggleTheme} className=" align-top  ml-2">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}

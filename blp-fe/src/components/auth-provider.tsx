'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
interface User {
  id: number
  name: string
  username: string
  token: string
}


interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  isLoading: boolean
}

export const setCookie = (name: string, value: string) => {
  Cookies.set(name, value, {
    expires: 7,
  })
}

export const removeCookie = (name: string) => {
  Cookies.remove(name)
}


const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user')
        const token = Cookies.get('auth-token')
        
        if (storedUser && token) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    setCookie('auth-token', userData.token)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    removeCookie('auth-token')
  }

  if (isLoading) {
    return null 
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
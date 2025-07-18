"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AuthModal } from "./AuthModal"
import { useAuth } from "@/contexts/AuthContext"
import { User, LogOut } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function Header() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const { user, logout, isLoading } = useAuth()

  const handleSignIn = () => {
    setAuthMode("login")
    setAuthModalOpen(true)
  }

  const handleSignUp = () => {
    setAuthMode("signup")
    setAuthModalOpen(true)
  }

  if (isLoading) {
    return (
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto max-w-screen-xl px-4 py-4">
          <Link href="/" className="flex items-center space-x-2">
            {" "}
            <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">NG</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">NextGen Food Court</h1>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="h-9 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-9 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto max-w-screen-xl px-4 py-4">
          <Link href="/" className="flex items-center space-x-2">
            {" "}
            <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">NG</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">NextGen Food Court</h1>
          </Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={handleSignIn}>
                  Sign In
                </Button>
                <Button onClick={handleSignUp} className="bg-orange-600 hover:bg-orange-700">
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode={authMode} />
    </>
  )
}

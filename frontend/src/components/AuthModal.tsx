"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { LoginForm } from "./LoginForm"
import { SignupForm } from "./SignupForm"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: "login" | "signup"
}

export function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode)

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 border-0 bg-transparent shadow-none">
        {mode === "login" ? (
          <LoginForm onToggleForm={toggleMode} onClose={onClose} />
        ) : (
          <SignupForm onToggleForm={toggleMode} onClose={onClose} />
        )}
      </DialogContent>
    </Dialog>
  )
}

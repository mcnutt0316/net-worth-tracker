"use client"

import { useState } from "react"
import { AuthForm } from "@/components/auth-form"

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin")

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Net Worth Tracker</h1>
          <p className="text-slate-400">Track your financial journey</p>
        </div>
        <AuthForm mode={mode} onToggleMode={toggleMode} />
      </div>
    </div>
  )
}
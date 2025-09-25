"use client"

import { useState, useCallback, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { createClient } from "@/lib/client"
import { Eye, EyeOff, Loader2 } from "lucide-react"

// Schema and types
const authSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type AuthFormData = z.infer<typeof authSchema>
type AuthMode = "signin" | "signup"

interface AuthFormProps {
  mode: AuthMode
  onToggleMode: () => void
}

// Constants for styling and content
const STYLES = {
  card: "w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm border-white/20",
  title: "text-2xl font-bold text-gray-900",
  description: "text-gray-600",
  label: "text-gray-700 font-medium",
  input: "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500",
  button: "w-full bg-purple-600 hover:bg-purple-700 text-white font-medium",
  error: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm",
  toggleButton: "ml-1 text-purple-600 hover:text-purple-700 hover:underline font-medium transition-colors",
  passwordToggle: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
} as const

const FORM_CONTENT = {
  signin: {
    title: "Welcome back",
    description: "Enter your email and password to sign in",
    submitText: "Sign in",
    togglePrompt: "Don't have an account?",
    toggleText: "Sign up",
    autoComplete: "current-password"
  },
  signup: {
    title: "Create account",
    description: "Enter your email and password to create an account",
    submitText: "Create account",
    togglePrompt: "Already have an account?",
    toggleText: "Sign in",
    autoComplete: "new-password"
  }
} as const

// Custom hooks for better separation of concerns
function useAuthForm() {
  return useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
}

function useAuthSubmission(mode: AuthMode) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = useCallback(async (data: AuthFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const authResult = mode === "signup"
        ? await supabase.auth.signUp({
            email: data.email,
            password: data.password,
          })
        : await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
          })

      if (authResult.error) {
        throw authResult.error
      }

      router.push("/")
      router.refresh()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message
        : "An unexpected error occurred. Please try again."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [mode, router])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return { isLoading, error, handleSubmit, clearError }
}

// Subcomponents for better organization
function PasswordToggleButton({
  showPassword,
  onToggle,
  disabled
}: {
  showPassword: boolean
  onToggle: () => void
  disabled: boolean
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={STYLES.passwordToggle}
      disabled={disabled}
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? (
        <EyeOff className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Eye className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  )
}

function ErrorMessage({ error }: { error: string }) {
  return (
    <div className={STYLES.error} role="alert">
      {error}
    </div>
  )
}

function LoadingButton({
  isLoading,
  children
}: {
  isLoading: boolean
  children: React.ReactNode
}) {
  return (
    <Button
      type="submit"
      className={STYLES.button}
      disabled={isLoading}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}

function ModeToggle({
  mode,
  onToggle,
  disabled
}: {
  mode: AuthMode
  onToggle: () => void
  disabled: boolean
}) {
  const content = FORM_CONTENT[mode]

  return (
    <div className="mt-4 text-center text-sm">
      <span className={STYLES.description}>
        {content.togglePrompt}
      </span>
      <button
        onClick={onToggle}
        className={STYLES.toggleButton}
        disabled={disabled}
      >
        {content.toggleText}
      </button>
    </div>
  )
}

export function AuthForm({ mode, onToggleMode }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const form = useAuthForm()
  const { isLoading, error, handleSubmit, clearError } = useAuthSubmission(mode)

  const content = useMemo(() => FORM_CONTENT[mode], [mode])

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev)
  }, [])

  // Clear error when mode changes
  useState(() => {
    clearError()
  })

  return (
    <Card className={STYLES.card}>
      <CardHeader className="space-y-1">
        <CardTitle className={STYLES.title}>
          {content.title}
        </CardTitle>
        <CardDescription className={STYLES.description}>
          {content.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={STYLES.label}>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className={STYLES.input}
                      autoComplete="email"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={STYLES.label}>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className={STYLES.input}
                        autoComplete={content.autoComplete}
                        {...field}
                        disabled={isLoading}
                      />
                      <PasswordToggleButton
                        showPassword={showPassword}
                        onToggle={togglePasswordVisibility}
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <ErrorMessage error={error} />}

            <LoadingButton isLoading={isLoading}>
              {content.submitText}
            </LoadingButton>
          </form>
        </Form>

        <ModeToggle
          mode={mode}
          onToggle={onToggleMode}
          disabled={isLoading}
        />
      </CardContent>
    </Card>
  )
}
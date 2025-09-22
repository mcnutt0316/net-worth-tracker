"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// 🎓 LEARNING: Similar schema to Asset, but for debts/liabilities
const liabilityFormSchema = z.object({
  name: z.string().min(1, "Liability name is required").max(100, "Name too long"),
  category: z.string().min(1, "Category is required").max(50, "Category too long"),
  value: z.string().refine((val) => {
    const num = parseFloat(val)
    return !isNaN(num) && num >= 0
  }, "Please enter a valid positive number"),
  description: z.string().max(500, "Description too long").optional(),
})

type LiabilityFormValues = z.infer<typeof liabilityFormSchema>

interface LiabilityFormProps {
  onSubmit: (data: LiabilityFormValues) => Promise<void>
  initialData?: Partial<LiabilityFormValues>
  isLoading?: boolean
}

export function LiabilityForm({ onSubmit, initialData, isLoading }: LiabilityFormProps) {
  const form = useForm<LiabilityFormValues>({
    resolver: zodResolver(liabilityFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      category: initialData?.category || "",
      value: initialData?.value || "",
      description: initialData?.description || "",
    },
  })

  const handleSubmit = async (data: LiabilityFormValues) => {
    try {
      await onSubmit(data)
      if (!initialData) {
        form.reset()
      }
    } catch (error) {
      console.error("Failed to submit liability:", error)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto financial-card">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <span className="text-red-600 text-lg">📋</span>
          </div>
          <div>
            <CardTitle className="heading-md">{initialData ? "Edit Liability" : "Add New Liability"}</CardTitle>
            <CardDescription className="mt-1">
              {initialData
                ? "Update your liability information below"
                : "Add a new liability (debt) to track in your net worth"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 form-enhanced">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Liability Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Credit Card, Mortgage, Student Loan"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Give your liability a descriptive name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Credit Card, Mortgage, Personal Loan, Auto Loan"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Categorize your liability for better organization
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Balance</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the current outstanding balance of this debt
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Additional notes about this liability..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Any additional details or notes
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full btn-financial h-12 text-base font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>{initialData ? "💾 Update Liability" : "📋 Add Liability"}</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
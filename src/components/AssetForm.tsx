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

// 🎓 LEARNING: Zod Schema Definition
// This creates a TypeScript type AND validation rules in one place
const assetFormSchema = z.object({
  name: z.string().min(1, "Asset name is required").max(100, "Name too long"),
  category: z.string().min(1, "Category is required").max(50, "Category too long"),
  value: z.string().refine((val) => {
    const num = parseFloat(val)
    return !isNaN(num) && num >= 0
  }, "Please enter a valid positive number"),
  description: z.string().max(500, "Description too long").optional(),
})

// 🎓 LEARNING: TypeScript type inferred from Zod schema
// This means if we change the schema, TypeScript will automatically update everywhere
type AssetFormValues = z.infer<typeof assetFormSchema>

interface AssetFormProps {
  onSubmit: (data: AssetFormValues) => Promise<void>
  initialData?: Partial<AssetFormValues>
  isLoading?: boolean
}

export function AssetForm({ onSubmit, initialData, isLoading }: AssetFormProps) {
  // 🎓 LEARNING: React Hook Form setup
  // - zodResolver connects Zod validation to React Hook Form
  // - defaultValues populates form (useful for editing existing assets)
  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      category: initialData?.category || "",
      value: initialData?.value || "",
      description: initialData?.description || "",
    },
  })

  // 🎓 LEARNING: Form submission handler
  // React Hook Form handles all validation before this function runs
  const handleSubmit = async (data: AssetFormValues) => {
    try {
      await onSubmit(data)
      // Reset form after successful submission (for "add" mode)
      if (!initialData) {
        form.reset()
      }
    } catch (error) {
      // 🎓 LEARNING: Error handling in forms
      console.error("Failed to submit asset:", error)
      // In a real app, you'd show a toast notification here
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto financial-card">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <span className="text-green-600 text-lg">💰</span>
          </div>
          <div>
            <CardTitle className="heading-md">{initialData ? "Edit Asset" : "Add New Asset"}</CardTitle>
            <CardDescription className="mt-1">
              {initialData
                ? "Update your asset information below"
                : "Add a new asset to track in your net worth"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 form-enhanced">
            {/* 🎓 LEARNING: FormField Pattern */}
            {/* Each field follows this pattern: FormField -> FormItem -> FormLabel + FormControl + FormMessage */}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Savings Account, House, Investment Portfolio"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Give your asset a descriptive name
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
                      placeholder="e.g., Cash, Real Estate, Investments, Retirement"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Categorize your asset for better organization
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
                  <FormLabel>Current Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the current dollar value of this asset
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
                      placeholder="Additional notes about this asset..."
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
                    <span>{initialData ? "💾 Update Asset" : "✨ Add Asset"}</span>
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
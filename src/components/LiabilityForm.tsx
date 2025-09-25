"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

const liabilityFormSchema = z.object({
  name: z.string().min(1, "Liability name is required").max(100, "Name too long"),
  category: z.string().min(1, "Category is required").max(50, "Category too long"),
  value: z.string().refine((val) => {
    const numericValue = parseFloat(val)
    return !isNaN(numericValue) && numericValue >= 0
  }, "Please enter a valid positive number"),
  description: z.string().max(500, "Description too long").optional(),
})

type LiabilityFormValues = z.infer<typeof liabilityFormSchema>

interface LiabilityFormProps {
  onSubmit: (data: LiabilityFormValues) => Promise<void>
  initialData?: Partial<LiabilityFormValues>
  isLoading?: boolean
}

const FORM_DEFAULT_VALUES = {
  name: "",
  category: "",
  value: "",
  description: "",
}

const LOADING_SPINNER = (
  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
)

export function LiabilityForm({ onSubmit, initialData, isLoading = false }: LiabilityFormProps) {
  const form = useForm<LiabilityFormValues>({
    resolver: zodResolver(liabilityFormSchema),
    defaultValues: {
      name: initialData?.name ?? FORM_DEFAULT_VALUES.name,
      category: initialData?.category ?? FORM_DEFAULT_VALUES.category,
      value: initialData?.value ?? FORM_DEFAULT_VALUES.value,
      description: initialData?.description ?? FORM_DEFAULT_VALUES.description,
    },
  })

  const isEditMode = Boolean(initialData)

  const handleFormSubmission = async (data: LiabilityFormValues) => {
    try {
      await onSubmit(data)
      if (!isEditMode) {
        form.reset()
      }
    } catch (error) {
      console.error("Liability submission failed:", error)
    }
  }

  const renderFormHeader = () => (
    <CardHeader className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
          <span className="text-red-600 text-lg">📋</span>
        </div>
        <div>
          <CardTitle className="heading-md">
            {isEditMode ? "Edit Liability" : "Add New Liability"}
          </CardTitle>
          <CardDescription className="mt-1">
            {isEditMode
              ? "Update your liability information below"
              : "Add a new liability (debt) to track in your net worth"}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  )

  const renderFormField = (
    name: keyof LiabilityFormValues,
    label: string,
    placeholder: string,
    description: string,
    inputProps: Record<string, unknown> = {}
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} {...inputProps} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  const renderSubmitButton = () => (
    <div className="pt-4">
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full btn-financial h-12 text-base font-medium"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            {LOADING_SPINNER}
            Saving...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>{isEditMode ? "💾 Update Liability" : "📋 Add Liability"}</span>
          </div>
        )}
      </Button>
    </div>
  )

  return (
    <Card className="w-full max-w-2xl mx-auto financial-card">
      {renderFormHeader()}
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmission)} className="space-y-6 form-enhanced">
            {renderFormField(
              "name",
              "Liability Name",
              "e.g., Credit Card, Mortgage, Student Loan",
              "Give your liability a descriptive name"
            )}

            {renderFormField(
              "category",
              "Category",
              "e.g., Credit Card, Mortgage, Personal Loan, Auto Loan",
              "Categorize your liability for better organization"
            )}

            {renderFormField(
              "value",
              "Current Balance",
              "0.00",
              "Enter the current outstanding balance of this debt",
              { type: "number", step: "0.01" }
            )}

            {renderFormField(
              "description",
              "Description (Optional)",
              "Additional notes about this liability...",
              "Any additional details or notes"
            )}

            {renderSubmitButton()}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
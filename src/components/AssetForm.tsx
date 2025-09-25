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

const assetFormSchema = z.object({
  name: z.string().min(1, "Asset name is required").max(100, "Name too long"),
  category: z.string().min(1, "Category is required").max(50, "Category too long"),
  value: z.string().refine((val) => {
    const numericValue = parseFloat(val)
    return !isNaN(numericValue) && numericValue >= 0
  }, "Please enter a valid positive number"),
  description: z.string().max(500, "Description too long").optional(),
})

type AssetFormValues = z.infer<typeof assetFormSchema>

interface AssetFormProps {
  onSubmit: (data: AssetFormValues) => Promise<void>
  initialData?: Partial<AssetFormValues>
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

export function AssetForm({ onSubmit, initialData, isLoading = false }: AssetFormProps) {
  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      name: initialData?.name ?? FORM_DEFAULT_VALUES.name,
      category: initialData?.category ?? FORM_DEFAULT_VALUES.category,
      value: initialData?.value ?? FORM_DEFAULT_VALUES.value,
      description: initialData?.description ?? FORM_DEFAULT_VALUES.description,
    },
  })

  const isEditMode = Boolean(initialData)

  const handleFormSubmission = async (data: AssetFormValues) => {
    try {
      await onSubmit(data)
      if (!isEditMode) {
        form.reset()
      }
    } catch (error) {
      console.error("Asset submission failed:", error)
    }
  }

  const renderFormHeader = () => (
    <CardHeader className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
          <span className="text-green-600 text-lg">💰</span>
        </div>
        <div>
          <CardTitle className="heading-md">
            {isEditMode ? "Edit Asset" : "Add New Asset"}
          </CardTitle>
          <CardDescription className="mt-1">
            {isEditMode
              ? "Update your asset information below"
              : "Add a new asset to track in your net worth"}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  )

  const renderFormField = (
    name: keyof AssetFormValues,
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
            <span>{isEditMode ? "💾 Update Asset" : "✨ Add Asset"}</span>
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
              "Asset Name",
              "e.g., Savings Account, House, Investment Portfolio",
              "Give your asset a descriptive name"
            )}

            {renderFormField(
              "category",
              "Category",
              "e.g., Cash, Real Estate, Investments, Retirement",
              "Categorize your asset for better organization"
            )}

            {renderFormField(
              "value",
              "Current Value",
              "0.00",
              "Enter the current dollar value of this asset",
              { type: "number", step: "0.01" }
            )}

            {renderFormField(
              "description",
              "Description (Optional)",
              "Additional notes about this asset...",
              "Any additional details or notes"
            )}

            {renderSubmitButton()}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
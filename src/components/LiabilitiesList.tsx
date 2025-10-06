"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Plus } from "lucide-react"
import type { LiabilityWithNumberValue } from "@/lib/calculations"
import { formatCurrency, calculateTotalLiabilities } from "@/lib/calculations"

interface LiabilitiesListProps {
  liabilities: LiabilityWithNumberValue[]
  onEdit: (liability: LiabilityWithNumberValue) => void
  onDelete: (liabilityId: string) => Promise<void>
  onAdd: () => void
  isLoading?: boolean
}

interface LiabilityItemProps {
  liability: LiabilityWithNumberValue
  onEdit: (liability: LiabilityWithNumberValue) => void
  onDelete: (liabilityId: string, liabilityName: string) => Promise<void>
  isDeleting: boolean
  isDisabled: boolean
  animationDelay: string
}

function LiabilityItem({ liability, onEdit, onDelete, isDeleting, isDisabled, animationDelay }: LiabilityItemProps) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-200 animate-slide-in-up"
      style={{ animationDelay }}
    >
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-semibold text-lg">{liability.name}</h3>
          <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700 font-medium">
            {liability.category}
          </span>
        </div>
        <p className="financial-amount-lg text-red-600">
          {formatCurrency(liability.value)}
        </p>
        {liability.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {liability.description}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          Last updated: {new Date(liability.updatedAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(liability)}
          disabled={isDisabled}
          aria-label={`Edit ${liability.name}`}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(liability.id, liability.name)}
          disabled={isDisabled}
          className="text-destructive hover:text-destructive"
          aria-label={`Delete ${liability.name}`}
        >
          {isDeleting ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}

interface EmptyStateProps {
  onAdd: () => void
}

function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <p className="text-lg font-medium mb-2">No liabilities tracked</p>
      <p className="text-sm mb-4">Add debts or loans to get a complete picture of your net worth</p>
      <Button onClick={onAdd} variant="outline">
        <Plus className="h-4 w-4 mr-2" />
        Add Your First Liability
      </Button>
    </div>
  )
}

interface LiabilitiesSummaryProps {
  liabilities: LiabilityWithNumberValue[]
}

function LiabilitiesSummary({ liabilities }: LiabilitiesSummaryProps) {
  const totalValue = calculateTotalLiabilities(liabilities)

  return (
    <div className="pt-4 border-t">
      <div className="flex justify-between items-center font-medium">
        <span>Total Liabilities:</span>
        <span className="text-lg text-red-600">
          {formatCurrency(totalValue)}
        </span>
      </div>
    </div>
  )
}

export function LiabilitiesList({ liabilities, onEdit, onDelete, onAdd, isLoading }: LiabilitiesListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (liabilityId: string, liabilityName: string) => {
    const confirmMessage = `Are you sure you want to delete "${liabilityName}"? This action cannot be undone.`
    if (!confirm(confirmMessage)) {
      return
    }

    setDeletingId(liabilityId)
    try {
      await onDelete(liabilityId)
    } catch (error) {
      console.error("Failed to delete liability:", error)
    } finally {
      setDeletingId(null)
    }
  }

  const isAnyDeleting = deletingId !== null
  const isDisabled = isLoading || isAnyDeleting

  return (
    <Card className="financial-card">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-lg" role="img" aria-label="Clipboard">
                📋
              </span>
            </div>
            <div>
              <CardTitle className="heading-md">Your Liabilities</CardTitle>
              <CardDescription>
                Manage your debts and outstanding balances
              </CardDescription>
            </div>
          </div>
          <Button
            onClick={onAdd}
            disabled={isDisabled}
            className="btn-financial bg-red-700 text-white hover:bg-red-800"
            aria-label="Add new liability"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Liability
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {liabilities.length === 0 ? (
          <EmptyState onAdd={onAdd} />
        ) : (
          <div className="space-y-4">
            {liabilities.map((liability, index) => (
              <LiabilityItem
                key={liability.id}
                liability={liability}
                onEdit={onEdit}
                onDelete={handleDelete}
                isDeleting={deletingId === liability.id}
                isDisabled={isDisabled}
                animationDelay={`${index * 0.1}s`}
              />
            ))}
            <LiabilitiesSummary liabilities={liabilities} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
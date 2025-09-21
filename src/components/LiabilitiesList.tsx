"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Plus } from "lucide-react"
import type { LiabilityWithNumberValue } from "@/lib/calculations"

interface LiabilitiesListProps {
  liabilities: LiabilityWithNumberValue[]
  onEdit: (liability: LiabilityWithNumberValue) => void
  onDelete: (liabilityId: string) => Promise<void>
  onAdd: () => void
  isLoading?: boolean
}

export function LiabilitiesList({ liabilities, onEdit, onDelete, onAdd, isLoading }: LiabilitiesListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (liabilityId: string, liabilityName: string) => {
    if (!confirm(`Are you sure you want to delete "${liabilityName}"? This action cannot be undone.`)) {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Liabilities</CardTitle>
            <CardDescription>
              Manage your debts and outstanding balances
            </CardDescription>
          </div>
          <Button onClick={onAdd} disabled={isLoading}>
            <Plus className="h-4 w-4 mr-2" />
            Add Liability
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {liabilities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-lg font-medium mb-2">No liabilities tracked</p>
            <p className="text-sm mb-4">Add debts or loans to get a complete picture of your net worth</p>
            <Button onClick={onAdd} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Liability
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {liabilities.map((liability) => (
              <div
                key={liability.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium">{liability.name}</h3>
                    <span className="px-2 py-1 text-xs rounded-full bg-destructive/10 text-destructive">
                      {liability.category}
                    </span>
                  </div>
                  {/* 🎓 LEARNING: Different color for debts (red vs green for assets) */}
                  <p className="text-2xl font-bold text-red-600">
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
                    disabled={isLoading || deletingId === liability.id}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(liability.id, liability.name)}
                    disabled={isLoading || deletingId !== null}
                    className="text-destructive hover:text-destructive"
                  >
                    {deletingId === liability.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center font-medium">
                <span>Total Liabilities:</span>
                <span className="text-lg text-red-600">
                  {formatCurrency(liabilities.reduce((sum, liability) => sum + liability.value, 0))}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
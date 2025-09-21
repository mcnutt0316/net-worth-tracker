"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Plus } from "lucide-react"
import type { AssetWithNumberValue } from "@/lib/calculations"

interface AssetsListProps {
  assets: AssetWithNumberValue[]
  onEdit: (asset: AssetWithNumberValue) => void
  onDelete: (assetId: string) => Promise<void>
  onAdd: () => void
  isLoading?: boolean
}

export function AssetsList({ assets, onEdit, onDelete, onAdd, isLoading }: AssetsListProps) {
  // 🎓 LEARNING: Local state for loading states
  // We track which asset is being deleted to show loading spinner on that specific button
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // 🎓 LEARNING: Delete handler with loading state
  const handleDelete = async (assetId: string, assetName: string) => {
    // Confirm deletion (UX best practice for destructive actions)
    if (!confirm(`Are you sure you want to delete "${assetName}"? This action cannot be undone.`)) {
      return
    }

    setDeletingId(assetId)
    try {
      await onDelete(assetId)
    } catch (error) {
      console.error("Failed to delete asset:", error)
      // In a real app, show error toast here
    } finally {
      setDeletingId(null)
    }
  }

  // 🎓 LEARNING: Currency formatting utility
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
            <CardTitle>Your Assets</CardTitle>
            <CardDescription>
              Manage your assets and their current values
            </CardDescription>
          </div>
          <Button onClick={onAdd} disabled={isLoading}>
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {assets.length === 0 ? (
          // 🎓 LEARNING: Empty state UX
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-lg font-medium mb-2">No assets yet</p>
            <p className="text-sm mb-4">Start building your net worth by adding your first asset</p>
            <Button onClick={onAdd} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Asset
            </Button>
          </div>
        ) : (
          // 🎓 LEARNING: Responsive grid layout
          <div className="space-y-4">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium">{asset.name}</h3>
                    <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                      {asset.category}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(asset.value)}
                  </p>
                  {asset.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {asset.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Last updated: {new Date(asset.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                {/* 🎓 LEARNING: Action buttons with loading states */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(asset)}
                    disabled={isLoading || deletingId === asset.id}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(asset.id, asset.name)}
                    disabled={isLoading || deletingId !== null}
                    className="text-destructive hover:text-destructive"
                  >
                    {deletingId === asset.id ? (
                      // Simple loading indicator
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}

            {/* 🎓 LEARNING: Summary row */}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center font-medium">
                <span>Total Assets:</span>
                <span className="text-lg text-green-600">
                  {formatCurrency(assets.reduce((sum, asset) => sum + asset.value, 0))}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
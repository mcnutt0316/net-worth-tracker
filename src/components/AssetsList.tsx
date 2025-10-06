"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Plus } from "lucide-react"
import type { AssetWithNumberValue } from "@/lib/calculations"
import { formatCurrency, calculateTotalAssets } from "@/lib/calculations"

interface AssetsListProps {
  assets: AssetWithNumberValue[]
  onEdit: (asset: AssetWithNumberValue) => void
  onDelete: (assetId: string) => Promise<void>
  onAdd: () => void
  isLoading?: boolean
}

interface AssetItemProps {
  asset: AssetWithNumberValue
  onEdit: (asset: AssetWithNumberValue) => void
  onDelete: (assetId: string, assetName: string) => Promise<void>
  isDeleting: boolean
  isDisabled: boolean
  animationDelay: string
}

function AssetItem({ asset, onEdit, onDelete, isDeleting, isDisabled, animationDelay }: AssetItemProps) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-200 animate-slide-in-up"
      style={{ animationDelay }}
    >
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-semibold text-lg">{asset.name}</h3>
          <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
            {asset.category}
          </span>
        </div>
        <p className="financial-amount-lg text-green-600">
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

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(asset)}
          disabled={isDisabled}
          aria-label={`Edit ${asset.name}`}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(asset.id, asset.name)}
          disabled={isDisabled}
          className="text-destructive hover:text-destructive"
          aria-label={`Delete ${asset.name}`}
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
      <p className="text-lg font-medium mb-2">No assets yet</p>
      <p className="text-sm mb-4">Start building your net worth by adding your first asset</p>
      <Button onClick={onAdd} variant="outline">
        <Plus className="h-4 w-4 mr-2" />
        Add Your First Asset
      </Button>
    </div>
  )
}

interface AssetsSummaryProps {
  assets: AssetWithNumberValue[]
}

function AssetsSummary({ assets }: AssetsSummaryProps) {
  const totalValue = calculateTotalAssets(assets)

  return (
    <div className="pt-4 border-t">
      <div className="flex justify-between items-center font-medium">
        <span>Total Assets:</span>
        <span className="text-lg text-green-600">
          {formatCurrency(totalValue)}
        </span>
      </div>
    </div>
  )
}

export function AssetsList({ assets, onEdit, onDelete, onAdd, isLoading }: AssetsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (assetId: string, assetName: string) => {
    const confirmMessage = `Are you sure you want to delete "${assetName}"? This action cannot be undone.`
    if (!confirm(confirmMessage)) {
      return
    }

    setDeletingId(assetId)
    try {
      await onDelete(assetId)
    } catch (error) {
      console.error("Failed to delete asset:", error)
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
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-lg" role="img" aria-label="Money">
                💰
              </span>
            </div>
            <div>
              <CardTitle className="heading-md">Your Assets</CardTitle>
              <CardDescription>
                Manage your assets and their current values
              </CardDescription>
            </div>
          </div>
          <Button
            onClick={onAdd}
            disabled={isDisabled}
            className="btn-financial bg-green-600 text-white hover:bg-green-700"
            aria-label="Add new asset"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {assets.length === 0 ? (
          <EmptyState onAdd={onAdd} />
        ) : (
          <div className="space-y-4">
            {assets.map((asset, index) => (
              <AssetItem
                key={asset.id}
                asset={asset}
                onEdit={onEdit}
                onDelete={handleDelete}
                isDeleting={deletingId === asset.id}
                isDisabled={isDisabled}
                animationDelay={`${index * 0.1}s`}
              />
            ))}
            <AssetsSummary assets={assets} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
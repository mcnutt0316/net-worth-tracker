"use client"

import { useState } from "react"
import { AssetForm } from "./AssetForm"
import { LiabilityForm } from "./LiabilityForm"
import { AssetsList } from "./AssetsList"
import { LiabilitiesList } from "./LiabilitiesList"
import {
  createAssetAction,
  updateAssetAction,
  deleteAssetAction,
  createLiabilityAction,
  updateLiabilityAction,
  deleteLiabilityAction,
  type AssetFormData,
  type LiabilityFormData
} from "@/app/actions"
import type { AssetWithNumberValue, LiabilityWithNumberValue } from "@/lib/calculations"

// 🎓 LEARNING: Client component for managing state and interactions
// Server components can't have state or event handlers, so we use client components for those

interface DashboardClientProps {
  initialAssets: AssetWithNumberValue[]
  initialLiabilities: LiabilityWithNumberValue[]
}

// 🎓 LEARNING: UI States for forms/modals
type UIState =
  | { type: 'list' }
  | { type: 'add-asset' }
  | { type: 'edit-asset', asset: AssetWithNumberValue }
  | { type: 'add-liability' }
  | { type: 'edit-liability', liability: LiabilityWithNumberValue }

export function DashboardClient({ initialAssets, initialLiabilities }: DashboardClientProps) {
  // 🎓 LEARNING: State management for UI and data
  const [uiState, setUIState] = useState<UIState>({ type: 'list' })
  const [isLoading, setIsLoading] = useState(false)

  // =================
  // ASSET HANDLERS
  // =================

  const handleCreateAsset = async (data: AssetFormData) => {
    setIsLoading(true)
    try {
      const result = await createAssetAction(data)
      if (result.success) {
        setUIState({ type: 'list' })
      } else {
        // In a real app, show toast with result.error
        console.error("Failed to create asset:", result.error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateAsset = async (assetId: string, data: AssetFormData) => {
    setIsLoading(true)
    try {
      const result = await updateAssetAction(assetId, data)
      if (result.success) {
        setUIState({ type: 'list' })
      } else {
        console.error("Failed to update asset:", result.error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAsset = async (assetId: string) => {
    const result = await deleteAssetAction(assetId)
    if (!result.success) {
      console.error("Failed to delete asset:", result.error)
    }
    // Note: No need to update state - revalidatePath in the action handles UI updates
  }

  // =================
  // LIABILITY HANDLERS
  // =================

  const handleCreateLiability = async (data: LiabilityFormData) => {
    setIsLoading(true)
    try {
      const result = await createLiabilityAction(data)
      if (result.success) {
        setUIState({ type: 'list' })
      } else {
        console.error("Failed to create liability:", result.error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateLiability = async (liabilityId: string, data: LiabilityFormData) => {
    setIsLoading(true)
    try {
      const result = await updateLiabilityAction(liabilityId, data)
      if (result.success) {
        setUIState({ type: 'list' })
      } else {
        console.error("Failed to update liability:", result.error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteLiability = async (liabilityId: string) => {
    const result = await deleteLiabilityAction(liabilityId)
    if (!result.success) {
      console.error("Failed to delete liability:", result.error)
    }
  }

  // 🎓 LEARNING: Conditional rendering based on UI state
  if (uiState.type === 'add-asset') {
    return (
      <div className="space-y-6">
        <AssetForm
          onSubmit={handleCreateAsset}
          isLoading={isLoading}
        />
        <div className="text-center">
          <button
            onClick={() => setUIState({ type: 'list' })}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (uiState.type === 'edit-asset') {
    return (
      <div className="space-y-6">
        <AssetForm
          onSubmit={(data) => handleUpdateAsset(uiState.asset.id, data)}
          initialData={{
            name: uiState.asset.name,
            category: uiState.asset.category,
            value: uiState.asset.value.toString(),
            description: uiState.asset.description || "",
          }}
          isLoading={isLoading}
        />
        <div className="text-center">
          <button
            onClick={() => setUIState({ type: 'list' })}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (uiState.type === 'add-liability') {
    return (
      <div className="space-y-6">
        <LiabilityForm
          onSubmit={handleCreateLiability}
          isLoading={isLoading}
        />
        <div className="text-center">
          <button
            onClick={() => setUIState({ type: 'list' })}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (uiState.type === 'edit-liability') {
    return (
      <div className="space-y-6">
        <LiabilityForm
          onSubmit={(data) => handleUpdateLiability(uiState.liability.id, data)}
          initialData={{
            name: uiState.liability.name,
            category: uiState.liability.category,
            value: uiState.liability.value.toString(),
            description: uiState.liability.description || "",
          }}
          isLoading={isLoading}
        />
        <div className="text-center">
          <button
            onClick={() => setUIState({ type: 'list' })}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Default: Show the lists
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <AssetsList
        assets={initialAssets}
        onAdd={() => setUIState({ type: 'add-asset' })}
        onEdit={(asset) => setUIState({ type: 'edit-asset', asset })}
        onDelete={handleDeleteAsset}
        isLoading={isLoading}
      />

      <LiabilitiesList
        liabilities={initialLiabilities}
        onAdd={() => setUIState({ type: 'add-liability' })}
        onEdit={(liability) => setUIState({ type: 'edit-liability', liability })}
        onDelete={handleDeleteLiability}
        isLoading={isLoading}
      />
    </div>
  )
}
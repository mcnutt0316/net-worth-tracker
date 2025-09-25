"use client"

import { useState, ReactNode } from "react"
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

interface DashboardClientProps {
  initialAssets: AssetWithNumberValue[]
  initialLiabilities: LiabilityWithNumberValue[]
}

type UIState =
  | { type: 'list' }
  | { type: 'add-asset' }
  | { type: 'edit-asset', asset: AssetWithNumberValue }
  | { type: 'add-liability' }
  | { type: 'edit-liability', liability: LiabilityWithNumberValue }

type ActionResult = { success: boolean; error?: string }

export function DashboardClient({ initialAssets, initialLiabilities }: DashboardClientProps) {
  const [uiState, setUIState] = useState<UIState>({ type: 'list' })
  const [isLoading, setIsLoading] = useState(false)

  const navigateToList = () => setUIState({ type: 'list' })

  const createGenericHandler = <T,>(
    actionFn: (data: T) => Promise<ActionResult>,
    entityType: string
  ) => {
    return async (data: T) => {
      setIsLoading(true)
      try {
        const result = await actionFn(data)
        if (result.success) {
          navigateToList()
        } else {
          console.error(`Failed to create ${entityType}:`, result.error)
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  const updateGenericHandler = <T,>(
    actionFn: (id: string, data: T) => Promise<ActionResult>,
    entityType: string
  ) => {
    return async (id: string, data: T) => {
      setIsLoading(true)
      try {
        const result = await actionFn(id, data)
        if (result.success) {
          navigateToList()
        } else {
          console.error(`Failed to update ${entityType}:`, result.error)
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  const deleteGenericHandler = (
    actionFn: (id: string) => Promise<ActionResult>,
    entityType: string
  ) => {
    return async (id: string) => {
      const result = await actionFn(id)
      if (!result.success) {
        console.error(`Failed to delete ${entityType}:`, result.error)
      }
    }
  }

  const handleCreateAsset = createGenericHandler(createAssetAction, 'asset')
  const handleUpdateAsset = updateGenericHandler(updateAssetAction, 'asset')
  const handleDeleteAsset = deleteGenericHandler(deleteAssetAction, 'asset')

  const handleCreateLiability = createGenericHandler(createLiabilityAction, 'liability')
  const handleUpdateLiability = updateGenericHandler(updateLiabilityAction, 'liability')
  const handleDeleteLiability = deleteGenericHandler(deleteLiabilityAction, 'liability')

  const renderBackButton = () => (
    <div className="text-center">
      <button
        onClick={navigateToList}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200 btn-financial"
      >
        <span>←</span>
        Back to Dashboard
      </button>
    </div>
  )

  const renderFormContainer = (children: ReactNode) => (
    <div className="space-y-6">
      {children}
      {renderBackButton()}
    </div>
  )

  const createInitialFormData = (item: AssetWithNumberValue | LiabilityWithNumberValue) => ({
    name: item.name,
    category: item.category,
    value: item.value.toString(),
    description: item.description || ""
  })

  const renderFormByState = () => {
    switch (uiState.type) {
      case 'add-asset':
        return renderFormContainer(
          <AssetForm onSubmit={handleCreateAsset} isLoading={isLoading} />
        )

      case 'edit-asset':
        return renderFormContainer(
          <AssetForm
            onSubmit={(data) => handleUpdateAsset(uiState.asset.id, data)}
            initialData={createInitialFormData(uiState.asset)}
            isLoading={isLoading}
          />
        )

      case 'add-liability':
        return renderFormContainer(
          <LiabilityForm onSubmit={handleCreateLiability} isLoading={isLoading} />
        )

      case 'edit-liability':
        return renderFormContainer(
          <LiabilityForm
            onSubmit={(data) => handleUpdateLiability(uiState.liability.id, data)}
            initialData={createInitialFormData(uiState.liability)}
            isLoading={isLoading}
          />
        )

      case 'list':
      default:
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
  }

  return renderFormByState()
}
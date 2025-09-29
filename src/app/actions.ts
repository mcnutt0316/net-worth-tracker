"use server"

// 🎓 LEARNING: "use server" directive
// This tells Next.js these functions run on the server, not the browser

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createAsset, updateAsset, deleteAsset, getAssets } from "@/lib/assets"
import { createLiability, updateLiability, deleteLiability, getLiabilities } from "@/lib/liabilities"
import { getUser } from "@/lib/auth"
import { get } from "http"
import { getNetWorthSummary } from "@/lib/calculations"

// 🎓 LEARNING: Server Action Types
// These match our form schemas but convert string numbers to actual numbers
export type AssetFormData = {
  name: string
  category: string
  value: string // Will be converted to number
  description?: string
}

export type LiabilityFormData = {
  name: string
  category: string
  value: string // Will be converted to number
  description?: string
}

// 🎓 LEARNING: Helper function to validate and convert form data
function validateAndConvertData(data: AssetFormData | LiabilityFormData) {
  const value = parseFloat(data.value)

  if (isNaN(value) || value < 0) {
    throw new Error("Please enter a valid positive number for the value")
  }

  return {
    name: data.name.trim(),
    category: data.category.trim(),
    value,
    description: data.description?.trim() || undefined,
  }
}

// =================
// ASSET ACTIONS
// =================

export async function createAssetAction(data: AssetFormData) {
  try {
    // 🎓 LEARNING: Authentication check in Server Actions
    const user = await getUser()
    if (!user) {
      redirect("/auth")
    }

    // Validate and convert the form data
    const validatedData = validateAndConvertData(data)

    // Create the asset in the database
    await createAsset(user.id, validatedData)

    // 🎓 LEARNING: revalidatePath tells Next.js to refresh this route's data
    // This automatically updates the UI with the new asset
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Failed to create asset:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create asset"
    }
  }
}

export async function updateAssetAction(assetId: string, data: AssetFormData) {
  try {
    const user = await getUser()
    if (!user) {
      redirect("/auth")
    }

    const validatedData = validateAndConvertData(data)
    await updateAsset(assetId, validatedData)

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to update asset:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update asset"
    }
  }
}

export async function deleteAssetAction(assetId: string) {
  try {
    const user = await getUser()
    if (!user) {
      redirect("/auth")
    }

    await deleteAsset(assetId)

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete asset:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete asset"
    }
  }
}

// =================
// LIABILITY ACTIONS
// =================

export async function createLiabilityAction(data: LiabilityFormData) {
  try {
    const user = await getUser()
    if (!user) {
      redirect("/auth")
    }

    const validatedData = validateAndConvertData(data)
    await createLiability(user.id, validatedData)

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to create liability:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create liability"
    }
  }
}

export async function updateLiabilityAction(liabilityId: string, data: LiabilityFormData) {
  try {
    const user = await getUser()
    if (!user) {
      redirect("/auth")
    }

    const validatedData = validateAndConvertData(data)
    await updateLiability(liabilityId, validatedData)

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to update liability:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update liability"
    }
  }
}

export async function deleteLiabilityAction(liabilityId: string) {
  try {
    const user = await getUser()
    if (!user) {
      redirect("/auth")
    }

    await deleteLiability(liabilityId)

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete liability:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete liability"
    }
  }
}

// 🎓 LEARNING: Data fetching actions
// These are used to get fresh data on the server side
export async function getUserAssetsAction() {
  try {
    const user = await getUser()
    if (!user) {
      return []
    }
    const assets = await getAssets(user.id)
    // 🎓 LEARNING: Convert Prisma types for frontend compatibility
    return assets.map(asset => ({
      ...asset,
      value: Number(asset.value),
      description: asset.description || undefined
    }))
  } catch (error) {
    console.error("Failed to fetch assets:", error)
    return []
  }
}

export async function getUserLiabilitiesAction() {
  try {
    const user = await getUser()
    if (!user) {
      return []
    }
    const liabilities = await getLiabilities(user.id)
    // Convert Prisma types for frontend compatibility
    return liabilities.map(liability => ({
      ...liability,
      value: Number(liability.value),
      description: liability.description || undefined
    }))
  } catch (error) {
    console.error("Failed to fetch liabilities:", error)
    return []
  }
}

export async function createSnapshotAction(){
  try{
    const user = await getUser()
    if(!user) {
      redirect("/auth")
    }
    const assets = await getUserAssetsAction()
    const liabilities = await getUserLiabilitiesAction()
    const netWorth = getNetWorthSummary(assets: Asset[], liabilities: Liability[]): { totalAssets: number; totalLiabilities: number; netWorth: number; formattedAssets: string; formattedLiabilities: string; formattedNetWorth: string; }
    revalidatePath("/")
    return { success: true }
  }
  catch (error) {
    console.error("Failed to create Snapshot:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create Snapshot"
    }
  }
}

export async function getSnapshotAction(){
  try{
    const user = await getUser()
    if (!user) {
      return []
    }
    const assets = await getAssets(user.id)
    const liabilities = await getLiabilities(user.id)
  }
  catch (error) {
    console.error("Failed to get Snapshot:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get Snapshot"
    }
  }
}
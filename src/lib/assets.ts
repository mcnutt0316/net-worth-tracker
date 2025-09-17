import { PrismaClient } from '@prisma/client'

// Create a global Prisma instance (recommended pattern for Next.js)
// This prevents creating multiple connections during development hot reloads
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Types for our asset operations - defines the shape of data we expect
export type CreateAssetData = {
  name: string
  category: string
  value: number
  description?: string // The ? means optional
}

export type UpdateAssetData = {
  name?: string
  category?: string
  value?: number
  description?: string
}

/**
 * Get all assets for a specific user
 * @param userId - The ID of the user whose assets to fetch
 * @returns Array of assets or empty array if none found
 */
export async function getAssets(userId: string) {
  try {
    const assets = await prisma.assets.findMany({
      where: {
        userId: userId // Only get assets belonging to this user
      },
      orderBy: {
        createdAt: 'desc' // Most recent first
      }
    })
    return assets
  } catch (error) {
    console.error('Error fetching assets:', error)
    throw new Error('Failed to fetch assets')
  }
}

/**
 * Create a new asset for a user
 * @param userId - The ID of the user creating the asset
 * @param assetData - The asset data to create
 * @returns The created asset
 */
export async function createAsset(userId: string, assetData: CreateAssetData) {
  try {
    const asset = await prisma.assets.create({
      data: {
        name: assetData.name,
        category: assetData.category,
        value: assetData.value,
        description: assetData.description,
        userId: userId // Link this asset to the user
      }
    })
    return asset
  } catch (error) {
    console.error('Error creating asset:', error)
    throw new Error('Failed to create asset')
  }
}

/**
 * Update an existing asset
 * @param assetId - The ID of the asset to update
 * @param updates - The fields to update (only the fields you want to change)
 * @returns The updated asset
 */
export async function updateAsset(assetId: string, updates: UpdateAssetData) {
  try {
    const asset = await prisma.assets.update({
      where: {
        id: assetId
      },
      data: updates // Prisma only updates the fields you provide
    })
    return asset
  } catch (error) {
    console.error('Error updating asset:', error)
    throw new Error('Failed to update asset')
  }
}

/**
 * Delete an asset
 * @param assetId - The ID of the asset to delete
 * @returns Success message
 */
export async function deleteAsset(assetId: string) {
  try {
    await prisma.assets.delete({
      where: {
        id: assetId
      }
    })
    return { success: true, message: 'Asset deleted successfully' }
  } catch (error) {
    console.error('Error deleting asset:', error)
    throw new Error('Failed to delete asset')
  }
}

/**
 * Get a single asset by ID
 * @param assetId - The ID of the asset to fetch
 * @returns The asset or null if not found
 */
export async function getAssetById(assetId: string) {
  try {
    const asset = await prisma.assets.findUnique({
      where: {
        id: assetId
      }
    })
    return asset
  } catch (error) {
    console.error('Error fetching asset:', error)
    throw new Error('Failed to fetch asset')
  }
}
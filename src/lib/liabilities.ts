import { PrismaClient } from '@prisma/client'

// Same global Prisma pattern as assets.ts
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Types for liability operations
export type CreateLiabilityData = {
  name: string
  category: string
  value: number
  description?: string
}

export type UpdateLiabilityData = {
  name?: string
  category?: string
  value?: number
  description?: string
}

/**
 * Get all liabilities for a specific user
 * @param userId - The ID of the user whose liabilities to fetch
 * @returns Array of liabilities or empty array if none found
 */
export async function getLiabilities(userId: string) {
  try {
    const liabilities = await prisma.liability.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return liabilities
  } catch (error) {
    console.error('Error fetching liabilities:', error)
    throw new Error('Failed to fetch liabilities')
  }
}

/**
 * Create a new liability for a user
 * @param userId - The ID of the user creating the liability
 * @param liabilityData - The liability data to create
 * @returns The created liability
 */
export async function createLiability(userId: string, liabilityData: CreateLiabilityData) {
  try {
    const liability = await prisma.liability.create({
      data: {
        name: liabilityData.name,
        category: liabilityData.category,
        value: liabilityData.value,
        description: liabilityData.description,
        userId: userId
      }
    })
    return liability
  } catch (error) {
    console.error('Error creating liability:', error)
    throw new Error('Failed to create liability')
  }
}

/**
 * Update an existing liability
 * @param liabilityId - The ID of the liability to update
 * @param updates - The fields to update
 * @returns The updated liability
 */
export async function updateLiability(liabilityId: string, updates: UpdateLiabilityData) {
  try {
    const liability = await prisma.liability.update({
      where: {
        id: liabilityId
      },
      data: updates
    })
    return liability
  } catch (error) {
    console.error('Error updating liability:', error)
    throw new Error('Failed to update liability')
  }
}

/**
 * Delete a liability
 * @param liabilityId - The ID of the liability to delete
 * @returns Success message
 */
export async function deleteLiability(liabilityId: string) {
  try {
    await prisma.liability.delete({
      where: {
        id: liabilityId
      }
    })
    return { success: true, message: 'Liability deleted successfully' }
  } catch (error) {
    console.error('Error deleting liability:', error)
    throw new Error('Failed to delete liability')
  }
}

/**
 * Get a single liability by ID
 * @param liabilityId - The ID of the liability to fetch
 * @returns The liability or null if not found
 */
export async function getLiabilityById(liabilityId: string) {
  try {
    const liability = await prisma.liability.findUnique({
      where: {
        id: liabilityId
      }
    })
    return liability
  } catch (error) {
    console.error('Error fetching liability:', error)
    throw new Error('Failed to fetch liability')
  }
}
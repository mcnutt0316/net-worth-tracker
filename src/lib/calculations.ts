import { Asset, Liability } from '@prisma/client'

/**
 * Calculate the total value of all assets
 * @param assets - Array of asset objects from the database
 * @returns Total value as a number
 */
export function calculateTotalAssets(assets: Asset[]): number {
  return assets.reduce((total, asset) => {
    // Prisma returns Decimal as a Decimal object, convert to number
    const assetValue = typeof asset.value === 'number' ? asset.value : Number(asset.value)
    return total + assetValue
  }, 0)
}

/**
 * Calculate the total value of all liabilities (debts)
 * @param liabilities - Array of liability objects from the database
 * @returns Total liability value as a number
 */
export function calculateTotalLiabilities(liabilities: Liability[]): number {
  return liabilities.reduce((total, liability) => {
    // Prisma returns Decimal as a Decimal object, convert to number
    const liabilityValue = typeof liability.value === 'number' ? liability.value : Number(liability.value)
    return total + liabilityValue
  }, 0)
}

/**
 * Calculate net worth (assets minus liabilities)
 * @param totalAssets - Total value of assets
 * @param totalLiabilities - Total value of liabilities
 * @returns Net worth as a number
 */
export function calculateNetWorth(totalAssets: number, totalLiabilities: number): number {
  return totalAssets - totalLiabilities
}

/**
 * Format currency for display
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Get net worth summary for a user (convenience function)
 * @param assets - User's assets
 * @param liabilities - User's liabilities
 * @returns Object with totals and formatted strings
 */
export function getNetWorthSummary(assets: Asset[], liabilities: Liability[]) {
  const totalAssets = calculateTotalAssets(assets)
  const totalLiabilities = calculateTotalLiabilities(liabilities)
  const netWorth = calculateNetWorth(totalAssets, totalLiabilities)

  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    // Formatted versions for display
    formattedAssets: formatCurrency(totalAssets),
    formattedLiabilities: formatCurrency(totalLiabilities),
    formattedNetWorth: formatCurrency(netWorth),
  }
}

/**
 * Calculate asset allocation percentages
 * @param assets - User's assets
 * @returns Object with category percentages
 */
export function calculateAssetAllocation(assets: Asset[]) {
  const totalAssets = calculateTotalAssets(assets)

  if (totalAssets === 0) {
    return {}
  }

  // Group assets by category and calculate percentages
  const categoryTotals: Record<string, number> = {}

  assets.forEach(asset => {
    const value = typeof asset.value === 'number' ? asset.value : Number(asset.value)
    categoryTotals[asset.category] = (categoryTotals[asset.category] || 0) + value
  })

  // Convert to percentages
  const percentages: Record<string, number> = {}
  Object.entries(categoryTotals).forEach(([category, total]) => {
    percentages[category] = (total / totalAssets) * 100
  })

  return percentages
}
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export type CreateSnapshotData = {
    assets: number
    liabilities: number
    networth: number
}

export async function createSnapshot(userId: string, data: CreateSnapshotData){
    try{
        const netWorth = await prisma.netWorthSnapshot.create({
            data: {
                networth: data.networth,
                assets: data.assets,
                liabilities: data.liabilities,
                userId: userId
            }
        })
        return netWorth
    } catch (error) {
        console.error('Error creating snapshot:', error)
        throw new Error('Failed to create snapshot')
    }
}

export async function getSnapshots(userId: string){
    try {
        const netWorth = await prisma.netWorthSnapshot.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return netWorth
    }catch (error) {
        console.error('Error fetching networth:', error)
        throw new Error('Failed to fetch networth')
    }
}
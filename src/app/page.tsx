import { getUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"
import { getUserAssetsAction, getUserLiabilitiesAction, createSnapshotAction, getSnapshotAction } from "./actions"
import { calculateTotalAssets, calculateTotalLiabilities, calculateNetWorth, formatCurrency } from "@/lib/calculations"
import { DashboardClient } from "@/components/DashboardClient"
import NetWorthChart from "@/components/trends/NetWorthChart"

// Force this page to be dynamic - prevents static generation
export const dynamic = 'force-dynamic'

async function signOut() {
  "use server"
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/auth")
}
async function takeSnapshot() {
  "use server"
   await createSnapshotAction()
}

export default async function Home() {
  const user = await getUser()

  // Middleware should ensure user exists, but add safety check
  if (!user) {
    redirect("/auth")
  }

  // 🎓 LEARNING: Fetch real data on the server side
  // This runs on the server before the page is sent to the browser
  const [assets, liabilities, snapshots] = await Promise.all([
    getUserAssetsAction(),
    getUserLiabilitiesAction(),
    getSnapshotAction()
  ])

  // 🎓 LEARNING: Calculate totals using our utility functions
  const totalAssets = calculateTotalAssets(assets)
  const totalLiabilities = calculateTotalLiabilities(liabilities)
  const netWorth = calculateNetWorth(totalAssets, totalLiabilities)

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-10">
          <div className="mb-4 sm:mb-0">
            <h1 className="heading-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Net Worth Tracker
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your financial progress and build wealth
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-muted-foreground">Welcome back</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <form action={signOut}>
              <Button variant="outline" type="submit" className="btn-financial">
                Sign Out
              </Button>
            </form>
          </div>
        </div>

        {/* Enhanced summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-fade-in">
          <Card className="financial-card" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Total Assets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="financial-amount-lg text-green-600">
                  {formatCurrency(totalAssets)}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {assets.length} asset{assets.length !== 1 ? 's' : ''}
                  </span>
                  {totalAssets > 0 && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      Growing
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="financial-card" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Total Liabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="financial-amount-lg text-red-600">
                  {formatCurrency(totalLiabilities)}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {liabilities.length} liabilit{liabilities.length !== 1 ? 'ies' : 'y'}
                  </span>
                  {totalLiabilities > 0 && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                      Active Debt
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="financial-card border-2" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Net Worth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className={`financial-amount-lg ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(netWorth)}
                </p>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    netWorth >= 0
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {netWorth >= 0 ? '📈 Positive' : '📉 Negative'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {netWorth >= 0 ? 'Keep it up!' : 'Focus on growth'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Net Worth Trend Chart */}
        <Card className="financial-card mb-10">
          <CardHeader>
            <CardTitle>Net Worth Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <NetWorthChart snapshots={snapshots} />
          </CardContent>
        </Card>

        {/* 🎓 LEARNING: Client component for interactive parts */}
        {/* We pass server data to a client component that handles forms/modals */}
        <DashboardClient initialAssets={assets} initialLiabilities={liabilities} />
        <Card className="financial-card">
          <CardHeader>
            <CardTitle>Net Worth Snapshot</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={takeSnapshot}>
              <Button type="submit" className="w-full">
                Take Snapshot
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
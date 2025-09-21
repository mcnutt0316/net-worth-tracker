import { getUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"
import { getUserAssetsAction, getUserLiabilitiesAction } from "./actions"
import { calculateTotalAssets, calculateTotalLiabilities, calculateNetWorth, formatCurrency } from "@/lib/calculations"
import { DashboardClient } from "@/components/DashboardClient"

async function signOut() {
  "use server"
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/auth")
}

export default async function Home() {
  const user = await getUser()

  // Middleware should ensure user exists, but add safety check
  if (!user) {
    redirect("/auth")
  }

  // 🎓 LEARNING: Fetch real data on the server side
  // This runs on the server before the page is sent to the browser
  const [assets, liabilities] = await Promise.all([
    getUserAssetsAction(),
    getUserLiabilitiesAction()
  ])

  // 🎓 LEARNING: Calculate totals using our utility functions
  const totalAssets = calculateTotalAssets(assets)
  const totalLiabilities = calculateTotalLiabilities(liabilities)
  const netWorth = calculateNetWorth(totalAssets, totalLiabilities)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Net Worth Tracker</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user.email}
            </span>
            <form action={signOut}>
              <Button variant="outline" type="submit">
                Sign Out
              </Button>
            </form>
          </div>
        </div>

        {/* 🎓 LEARNING: Summary cards with real data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totalAssets)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {assets.length} asset{assets.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Liabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(totalLiabilities)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {liabilities.length} liabilit{liabilities.length !== 1 ? 'ies' : 'y'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Net Worth</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(netWorth)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {netWorth >= 0 ? 'Positive net worth' : 'Negative net worth'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 🎓 LEARNING: Client component for interactive parts */}
        {/* We pass server data to a client component that handles forms/modals */}
        <DashboardClient initialAssets={assets} initialLiabilities={liabilities} />
      </div>
    </div>
  )
}
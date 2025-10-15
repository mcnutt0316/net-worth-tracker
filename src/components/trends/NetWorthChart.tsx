"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useState } from "react"
import TimeRangeSelector from "./TimeRangeSelector"

type Snapshot = {
    id: string,
    networth:  number,
    assets: number,
    liabilities: number,
    createdAt: Date
}

type NetWorthChartProps = {
    snapshots: Snapshot[]
}

const formatCurrency = (value:  number) => {
    const isNegative = value < 0
    const absoluteValue = Math.abs(value)
    let formatted = ""
    if(absoluteValue >= 1_000_000){
        formatted = `$${(absoluteValue / 1_000_000).toFixed(2).replace(/\.0$/, '')}M`
    }else if(absoluteValue >= 1_000){
        formatted = `$${(absoluteValue / 1_000).toFixed(2).replace(/\.0$/, '')}K`
    }else{
        formatted = `$${absoluteValue}`
    }
    if(isNegative){
        return `-${formatted}`
    }else{
        return formatted
    }
}

export default function NetWorthChart({ snapshots }: NetWorthChartProps){
    const [selectedRange, setSelectedRange] = useState<"6M" | "1Y" | "2Y" | "All">("All")
    const filterSnapshots = () => {
        if (selectedRange === "All") 
            return snapshots
        const now = new Date()
        let monthsBack = 0
        if (selectedRange === "6M") monthsBack = 6
        if (selectedRange === "1Y") monthsBack = 12
        if (selectedRange === "2Y") monthsBack = 24

        const cutoffDate = new Date(now.getFullYear(), now.getMonth() - monthsBack, now.getDate())

        return snapshots.filter(snapshot => new Date(snapshot.createdAt) >= cutoffDate)
    }
    const chartData = filterSnapshots().map((snapshot) => {
        return {
            date: snapshot.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric'}),
            value: snapshot.networth
        }
    })

    return (
        <>
        <TimeRangeSelector selected={selectedRange} onSelect={setSelectedRange}/>
        <ResponsiveContainer width="100%" height={400}>
        <LineChart
        data={chartData}
        >
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="date"/>
            <Tooltip formatter={(value) => Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(value as number)}/>
            <YAxis tickFormatter={(value) => Intl.NumberFormat("en-US", {style: "currency", currency: "USD"} ).format(value)} width={100}/>
            <Line type="monotone" dataKey="value" stroke="hsl(142 76% 36%)"/>

        </LineChart>
        </ResponsiveContainer>
        </>
    )
}
"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

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

export default function NetWorthChart({ snapshots }: NetWorthChartProps){
    const chartData = snapshots.map((snapshot) => {
        return {
            date: snapshot.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric'}),
            value: snapshot.networth
        }
    })
    return (
        <ResponsiveContainer width="100%" height={400}>
        <LineChart
        data={chartData}
        >
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="date"/>
            <YAxis/>
            <Line type="monotone" dataKey="value" stroke="#8884d8"/>

        </LineChart>
        </ResponsiveContainer>
    )
}
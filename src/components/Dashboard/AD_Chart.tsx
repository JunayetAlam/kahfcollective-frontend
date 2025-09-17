"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Button } from "../ui/button"

// Skeleton loader component
const ChartSkeleton = () => {
    return (
        <Card className="w-full bg-gray-900">
            <CardHeader className="pb-4">
                <div className="flex w-full justify-between">
                    <div className="h-6 w-32 bg-gray-700 rounded animate-pulse"></div>
                    <div className="flex gap-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
                        ))}
                    </div>
                </div>
                <div className="text-sm text-gray-400 mt-2">
                    <div className="h-4 w-40 bg-gray-700 rounded animate-pulse"></div>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <div className="h-[300px] sm:h-[400px] w-full bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
                    <div className="text-gray-500">Loading chart...</div>
                </div>
            </CardContent>
        </Card>
    )
}

const timePeriods = [
    { key: "3months", label: "Last 3 months" },
    { key: "30days", label: "Last 30 days" },
    { key: "7days", label: "Last 7 days" },
]

const dataFields = [
    {
        key: "mobile",
        label: "Mobile",
        color: "#8b5cf6",
        format: (value: number) => value.toLocaleString(),
    },
    {
        key: "desktop",
        label: "Desktop",
        color: "#06b6d4",
        format: (value: number) => value.toLocaleString(),
    },
]

export default function VisitorsChart() {
    const [selectedPeriod, setSelectedPeriod] = useState("3months")
    const isLoading = false

    if (isLoading) {
        return <ChartSkeleton />
    }

    // Sample data for different time periods
    const chartDataSets = {
        "3months": [
            { period: "Oct", mobile: 850, desktop: 720 },
            { period: "Nov", mobile: 920, desktop: 680 },
            { period: "Dec", mobile: 1100, desktop: 800 },
        ],
        "30days": [
            { period: "Week 1", mobile: 280, desktop: 210 },
            { period: "Week 2", mobile: 320, desktop: 250 },
            { period: "Week 3", mobile: 290, desktop: 180 },
            { period: "Week 4", mobile: 410, desktop: 290 },
        ],
        "7days": [
            { period: "Mon", mobile: 45, desktop: 35 },
            { period: "Tue", mobile: 52, desktop: 41 },
            { period: "Wed", mobile: 38, desktop: 28 },
            { period: "Thu", mobile: 65, desktop: 52 },
            { period: "Fri", mobile: 71, desktop: 58 },
            { period: "Sat", mobile: 43, desktop: 31 },
            { period: "Sun", mobile: 39, desktop: 25 },
        ],
    }

    const currentData = chartDataSets[selectedPeriod as keyof typeof chartDataSets]
    const totalMobile = currentData.reduce((sum, item) => sum + item.mobile, 0)
    const totalDesktop = currentData.reduce((sum, item) => sum + item.desktop, 0)

    return (
        <Card className="w-full ">
            <CardHeader className="pb-4">
                <div className="flex w-full justify-between items-start">
                    <div>
                        <CardTitle className="text-xl">Total Visitors</CardTitle>
                        <p className="text-sm  mt-1">
                            Total for the {timePeriods.find(p => p.key === selectedPeriod)?.label.toLowerCase()}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        {timePeriods.map((period) => (
                            <Button
                                key={period.key}
                                onClick={() => setSelectedPeriod(period.key)}
                                variant={
                                     selectedPeriod === period.key ? 'secondary': 'outline'
                                }
                            >
                                {period.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4">
                <ChartContainer
                    config={{
                        mobile: {
                            label: "Mobile",
                            color: "#8b5cf6",
                        },
                        desktop: {
                            label: "Desktop", 
                            color: "#06b6d4",
                        },
                    }}
                    className="h-[300px] sm:h-[400px] w-full"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={currentData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 20,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis
                                dataKey="period"
                                className="text-xs sm:text-sm"
                                tick={{ fontSize: 10, fill: '#9ca3af' }}
                                interval={0}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                className="text-xs sm:text-sm"
                                tick={{ fontSize: 10, fill: '#9ca3af' }}
                                width={50}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => {
                                    if (value >= 1000) {
                                        return `${(value / 1000).toFixed(0)}k`
                                    }
                                    return value.toString()
                                }}
                            />
                            <ChartTooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className=" border rounded-lg p-3 shadow-lg">
                                                <p className="font-medium mb-2">{label}</p>
                                                {payload.map((entry, index) => (
                                                    <div key={index} className="flex items-center gap-2 text-sm">
                                                        <div 
                                                            className="w-3 h-3 rounded-full" 
                                                            style={{ backgroundColor: entry.color }}
                                                        ></div>
                                                        <span className="">
                                                            {entry.dataKey}: {entry.value?.toLocaleString()}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />

                            <Line
                                type="monotone"
                                dataKey="mobile"
                                stroke="#8b5cf6"
                                strokeWidth={2}
                                dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 3 }}
                                activeDot={{ r: 5, stroke: "#8b5cf6", strokeWidth: 2 }}
                                name="Mobile"
                                connectNulls={false}
                            />
                            
                            <Line
                                type="monotone"
                                dataKey="desktop"
                                stroke="#06b6d4"
                                strokeWidth={2}
                                dot={{ fill: "#06b6d4", strokeWidth: 2, r: 3 }}
                                activeDot={{ r: 5, stroke: "#06b6d4", strokeWidth: 2 }}
                                name="Desktop"
                                connectNulls={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>

                {/* Legend */}
                <div className="flex justify-center gap-6 mt-4">
                    {dataFields.map((field) => (
                        <div key={field.key} className="flex items-center gap-2 text-sm">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: field.color }}
                            ></div>
                            <span>
                                {field.label}: {field.format(field.key === 'mobile' ? totalMobile : totalDesktop)}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
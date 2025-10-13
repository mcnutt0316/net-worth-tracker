"use client"

type TimeRange = "6M" | "1Y" | "2Y" | "All"

interface TimeRangeSelectorProps {
    selected: TimeRange,
    onSelect: (range: TimeRange) => void
}
export default function TimeRangeSelector({ selected, onSelect }: TimeRangeSelectorProps){
    const ranges: TimeRange[] = ["6M", "1Y", "2Y", "All"]
return (
    <div className="flex gap-1 justify-end mb-4">
        {ranges.map((range) => (
            <button
            key={range}
            onClick={() => onSelect(range)}
            className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
          selected === range
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            >
                {range}
            </button>
        ))}
    </div>
)
}
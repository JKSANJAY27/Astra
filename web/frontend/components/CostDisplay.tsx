'use client'

import { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import type { CostBreakdown } from '@/lib/types'

interface CostDisplayProps {
    total: number
    breakdown: CostBreakdown[]
}

export default function CostDisplay({ total, breakdown }: CostDisplayProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div className="relative">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition border border-green-200"
            >
                <span className="text-sm font-medium">
                    Monthly Cost: ${total.toFixed(2)}
                </span>
                {isExpanded ? (
                    <ChevronUpIcon className="h-4 w-4" />
                ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                )}
            </button>

            {isExpanded && breakdown.length > 0 && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                            {breakdown.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                    <div>
                                        <p className="font-medium text-gray-900">{item.component}</p>
                                        <p className="text-xs text-gray-500 capitalize">{item.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">
                                            ${item.scaledCost.toFixed(2)}
                                        </p>
                                        {item.baseCost > 0 && item.baseCost !== item.scaledCost && (
                                            <p className="text-xs text-gray-500">
                                                base: ${item.baseCost.toFixed(2)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-900">Total</span>
                                <span className="text-lg font-bold text-green-600">
                                    ${total.toFixed(2)}/mo
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

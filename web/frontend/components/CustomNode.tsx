'use client'

import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import type { NodeData } from '@/lib/types'

interface CustomNodeProps {
    data: NodeData
}

const CustomNode = memo(({ data }: CustomNodeProps) => {
    return (
        <div className="px-4 py-3 shadow-lg rounded-lg bg-white border-2 border-gray-200 hover:border-blue-400 transition min-w-[180px]">
            <Handle type="target" position={Position.Top} className="w-3 h-3" />
            <Handle type="target" position={Position.Left} className="w-3 h-3" />

            <div className="flex items-center space-x-3">
                {data.icon && (
                    <img
                        src={data.icon}
                        alt={data.label}
                        className="w-8 h-8"
                        onError={(e) => {
                            // Fallback if icon fails to load
                            e.currentTarget.style.display = 'none'
                        }}
                    />
                )}
                <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-sm">{data.label}</div>
                    <div className="text-xs text-gray-500 capitalize">{data.category}</div>
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
            <Handle type="source" position={Position.Right} className="w-3 h-3" />
        </div>
    )
})

CustomNode.displayName = 'CustomNode'

export default CustomNode

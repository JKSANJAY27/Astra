'use client'

import type { Scope } from '@/lib/types'

interface ScopePanelProps {
    scope: Scope
    onScopeChange: (scope: Scope) => void
}

export default function ScopePanel({ scope, onScopeChange }: ScopePanelProps) {
    const updateScope = (field: keyof Scope, value: number) => {
        onScopeChange({
            ...scope,
            [field]: value,
        })
    }

    return (
        <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Scope</h2>
            <p className="text-sm text-gray-500 mb-6">
                Define your requirements to get accurate cost estimates
            </p>

            <div className="space-y-6">
                {/* Users */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected Users
                    </label>
                    <input
                        type="number"
                        value={scope.users}
                        onChange={(e) => updateScope('users', parseInt(e.target.value) || 0)}
                        min="0"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Monthly active users</p>
                </div>

                {/* Traffic Level */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Traffic Level: {scope.trafficLevel}/5
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="5"
                        value={scope.trafficLevel}
                        onChange={(e) => updateScope('trafficLevel', parseInt(e.target.value))}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Low</span>
                        <span>High</span>
                    </div>
                </div>

                {/* Data Volume */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data Volume (GB)
                    </label>
                    <input
                        type="number"
                        value={scope.dataVolumeGB}
                        onChange={(e) => updateScope('dataVolumeGB', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="10"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Total data storage needed</p>
                </div>

                {/* Regions */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deployment Regions
                    </label>
                    <select
                        value={scope.regions}
                        onChange={(e) => updateScope('regions', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={1}>Single Region</option>
                        <option value={2}>2 Regions</option>
                        <option value={3}>3 Regions</option>
                        <option value={4}>4+ Regions</option>
                    </select>
                </div>

                {/* Availability */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Availability SLA
                    </label>
                    <select
                        value={scope.availability}
                        onChange={(e) => updateScope('availability', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={99.0}>99.0% (Basic)</option>
                        <option value={99.9}>99.9% (Standard)</option>
                        <option value={99.95}>99.95% (High)</option>
                        <option value={99.99}>99.99% (Critical)</option>
                        <option value={99.999}>99.999% (Mission Critical)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                        Higher SLA increases costs
                    </p>
                </div>
            </div>

            {/* Summary */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Quick Summary</h3>
                <ul className="text-xs text-blue-700 space-y-1">
                    <li>• {scope.users.toLocaleString()} users</li>
                    <li>• Traffic level {scope.trafficLevel}/5</li>
                    <li>• {scope.dataVolumeGB} GB data</li>
                    <li>• {scope.regions} region(s)</li>
                    <li>• {scope.availability}% uptime</li>
                </ul>
            </div>
        </div>
    )
}

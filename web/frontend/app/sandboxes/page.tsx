'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon, CloudIcon } from '@heroicons/react/24/outline'
import { sandboxesAPI } from '@/lib/api'
import type { SandboxResponse } from '@/lib/types'

export default function SandboxesPage() {
    const [sandboxes, setSandboxes] = useState<SandboxResponse[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        loadSandboxes()
    }, [])

    const loadSandboxes = async () => {
        setIsLoading(true)
        try {
            const data = await sandboxesAPI.list({ limit: 50 })
            setSandboxes(data)
        } catch (error) {
            console.error('Error loading sandboxes:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredSandboxes = sandboxes.filter((sandbox) =>
        sandbox.projectName.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="border-b bg-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center space-x-2">
                            <CloudIcon className="h-8 w-8 text-blue-600" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Astra
                            </span>
                        </Link>
                        <div className="flex items-center space-x-6">
                            <Link href="/builder" className="text-gray-600 hover:text-gray-900 transition">
                                Builder
                            </Link>
                            <Link href="/sandboxes" className="text-gray-900 font-medium">
                                Gallery
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Architecture Gallery
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Explore cloud architectures created by the community
                    </p>

                    {/* Search */}
                    <div className="relative max-w-2xl">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search architectures..."
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading architectures...</p>
                    </div>
                ) : filteredSandboxes.length === 0 ? (
                    <div className="text-center py-12">
                        <CloudIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">No architectures found</p>
                        <Link
                            href="/builder"
                            className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Create Your First Architecture
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSandboxes.map((sandbox) => (
                            <Link
                                key={sandbox.sandboxId}
                                href={`/sandboxes/${sandbox.sandboxId}`}
                                className="block bg-white rounded-lg shadow hover:shadow-xl transition p-6 border border-gray-200 hover:border-blue-400"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {sandbox.projectName}
                                </h3>
                                {sandbox.description && (
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {sandbox.description}
                                    </p>
                                )}

                                {/* Tech Stack */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {sandbox.techStack.slice(0, 4).map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                    {sandbox.techStack.length > 4 && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                            +{sandbox.techStack.length - 4} more
                                        </span>
                                    )}
                                </div>

                                {/* Meta Info */}
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>${sandbox.totalCost.toFixed(2)}/mo</span>
                                    <span>{sandbox.views} views</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}

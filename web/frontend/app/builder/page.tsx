'use client'

import { useState, useCallback, useEffect } from 'react'
import ReactFlow, {
    Node,
    Edge,
    Controls,
    Background,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { chatAPI } from '@/lib/api'
import type { ArchitectureJson, Scope, ChatMessage, ChatResponse } from '@/lib/types'
import ChatPanel from '@/components/ChatPanel'
import ScopePanel from '@/components/ScopePanel'
import CostDisplay from '@/components/CostDisplay'
import CustomNode from '@/components/CustomNode'

const nodeTypes = {
    custom: CustomNode,
}

const initialScope: Scope = {
    users: 1000,
    trafficLevel: 3,
    dataVolumeGB: 100,
    regions: 1,
    availability: 99.9,
}

export default function BuilderPage() {
    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const [scope, setScope] = useState<Scope>(initialScope)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    )

    // Send message to AI
    const handleSendMessage = async (message: string) => {
        if (!message.trim()) return

        setIsLoading(true)

        // Add user message to chat
        const userMessage: ChatMessage = { role: 'user', content: message }
        setChatMessages((prev) => [...prev, userMessage])

        try {
            // Build architecture JSON
            const architectureJson: ArchitectureJson = {
                nodes: nodes.map((n) => ({
                    id: n.id,
                    type: n.type || 'custom',
                    position: n.position,
                    data: n.data as any,
                })),
                edges: edges.map((e) => ({
                    id: e.id,
                    source: e.source,
                    target: e.target,
                    sourceHandle: e.sourceHandle as any,
                    targetHandle: e.targetHandle as any,
                    type: e.type || 'custom',
                })),
                scope,
                timestamp: Date.now(),
            }

            // Call API
            const response: ChatResponse = await chatAPI.sendMessage({
                message,
                session_id: sessionId || undefined,
                architecture_json: architectureJson,
                chat_width: 600,
            })

            // Update session ID
            if (!sessionId) {
                setSessionId(response.session_id)
            }

            // Add assistant message
            const assistantMessage: ChatMessage = {
                role: 'assistant',
                content: response.message,
            }
            setChatMessages((prev) => [...prev, assistantMessage])

            // Update canvas if architecture was generated
            if (response.canvas_action === 'update' && response.updated_architecture) {
                const arch = response.updated_architecture

                // Update nodes
                const newNodes = arch.nodes.map((n) => ({
                    id: n.id,
                    type: n.type,
                    position: n.position,
                    data: n.data,
                }))
                setNodes(newNodes)

                // Update edges
                const newEdges = arch.edges.map((e) => ({
                    id: e.id,
                    source: e.source,
                    target: e.target,
                    sourceHandle: e.sourceHandle,
                    targetHandle: e.targetHandle,
                    type: e.type,
                }))
                setEdges(newEdges)

                // Update scope if provided
                if (arch.scope) {
                    setScope(arch.scope)
                }
            }

            // Update scope from scope_analysis if provided
            if (response.updated_scope) {
                setScope((prev) => ({
                    ...prev,
                    ...response.updated_scope,
                }))
            }
        } catch (error) {
            console.error('Error sending message:', error)
            const errorMessage: ChatMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
            }
            setChatMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    // Calculate cost estimate
    const costEstimate = nodes.length > 0 ? {
        total: 0,
        breakdown: [],
    } : undefined

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <a href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Astra
                    </a>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-700 font-medium">Architecture Builder</span>
                </div>

                <div className="flex items-center space-x-4">
                    {costEstimate && (
                        <CostDisplay
                            total={costEstimate.total}
                            breakdown={costEstimate.breakdown}
                        />
                    )}
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Publish to Gallery
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Scope Configuration */}
                <div className="w-80 bg-white border-r overflow-y-auto">
                    <ScopePanel scope={scope} onScopeChange={setScope} />
                </div>

                {/* Canvas */}
                <div className="flex-1 relative">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        fitView
                        className="bg-gray-50"
                    >
                        <Controls />
                        <MiniMap />
                        <Background gap={12} size={1} />
                    </ReactFlow>

                    {nodes.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center text-gray-400">
                                <svg
                                    className="mx-auto h-12 w-12 mb-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                                    />
                                </svg>
                                <p className="text-lg font-medium">Start by chatting with the AI assistant</p>
                                <p className="text-sm mt-2">Ask to create an architecture and watch it appear here</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar - Chat */}
                <div className="w-96 bg-white border-l">
                    <ChatPanel
                        messages={chatMessages}
                        onSendMessage={handleSendMessage}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    )
}

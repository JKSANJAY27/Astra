/**
 * TypeScript type definitions for Astra API
 */

// ==================== Architecture Types ====================

export interface NodePosition {
    x: number
    y: number
}

export interface NodeData {
    label: string
    componentId: string
    category: string
    icon?: string
    color?: string
    config?: Record<string, any>
}

export interface Node {
    id: string
    type: string
    position: NodePosition
    data: NodeData
}

export interface Edge {
    id: string
    source: string
    target: string
    sourceHandle?: 'top' | 'right' | 'bottom' | 'left'
    targetHandle?: 'top' | 'right' | 'bottom' | 'left'
    type: string
}

export interface Scope {
    users: number
    trafficLevel: number
    dataVolumeGB: number
    regions: number
    availability: number
}

export interface CostBreakdown {
    category: string
    component: string
    componentId: string
    baseCost: number
    scaledCost: number
}

export interface CostEstimate {
    total: number
    breakdown: CostBreakdown[]
}

export interface ArchitectureJson {
    nodes: Node[]
    edges: Edge[]
    scope: Scope
    costEstimate?: CostEstimate
    timestamp?: number
}

// ==================== Chat Types ====================

export interface ChatRequest {
    message: string
    session_id?: string
    architecture_json: ArchitectureJson
    chat_width?: number
}

export interface ChatResponse {
    message: string
    session_id: string
    suggest_implementation: boolean
    updated_architecture?: ArchitectureJson
    canvas_action: 'update' | 'clear' | 'none'
    updated_scope?: Partial<Scope>
}

export interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
}

// ==================== Sandbox Types ====================

export interface SandboxCreate {
    projectName: string
    description?: string
    architectureJson: ArchitectureJson
}

export interface SandboxResponse {
    sandboxId: string
    projectName: string
    description?: string
    architectureJson: ArchitectureJson
    techStack: string[]
    totalCost: number
    createdAt: string
    updatedAt: string
    isPublic: boolean
    views: number
}

// ==================== Component Types ====================

export interface Component {
    id: string
    name: string
    category: string
    pricing_tier: string
    base_cost: number
    description: string
}

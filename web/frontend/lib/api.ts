/**
 * API client for Astra backend
 */
import axios from 'axios'
import type {
    ChatRequest,
    ChatResponse,
    SandboxCreate,
    SandboxResponse,
} from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// ==================== Chat API ====================

export const chatAPI = {
    /**
     * Send message to AI assistant
     */
    sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
        const response = await apiClient.post<ChatResponse>('/api/chat', request)
        return response.data
    },

    /**
     * Get session history
     */
    getSession: async (sessionId: string) => {
        const response = await apiClient.get(`/api/chat/sessions/${sessionId}`)
        return response.data
    },

    /**
     * Delete session
     */
    deleteSession: async (sessionId: string) => {
        const response = await apiClient.delete(`/api/chat/sessions/${sessionId}`)
        return response.data
    },
}

// ==================== Sandboxes API ====================

export const sandboxesAPI = {
    /**
     * Publish architecture to gallery
     */
    publish: async (data: SandboxCreate): Promise<SandboxResponse> => {
        const response = await apiClient.post<SandboxResponse>('/api/sandboxes', data)
        return response.data
    },

    /**
     * Get sandbox by ID
     */
    getById: async (sandboxId: string): Promise<SandboxResponse> => {
        const response = await apiClient.get<SandboxResponse>(`/api/sandboxes/${sandboxId}`)
        return response.data
    },

    /**
     * List sandboxes with filters
     */
    list: async (params?: {
        search?: string
        tech_stack?: string
        min_cost?: number
        max_cost?: number
        limit?: number
        skip?: number
    }): Promise<SandboxResponse[]> => {
        const response = await apiClient.get<SandboxResponse[]>('/api/sandboxes', { params })
        return response.data
    },
}

export default apiClient

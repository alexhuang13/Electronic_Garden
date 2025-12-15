/**
 * API 服务基础配置
 * 所有 HTTP 请求的基础配置和通用方法
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

class ApiService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`)
    const result: ApiResponse<T> = await response.json()

    if (!result.success) {
      throw new Error(result.message || 'API request failed')
    }

    return result.data
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result: ApiResponse<T> = await response.json()

    if (!result.success) {
      throw new Error(result.message || 'API request failed')
    }

    return result.data
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result: ApiResponse<T> = await response.json()

    if (!result.success) {
      throw new Error(result.message || 'API request failed')
    }

    return result.data
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
    })

    const result: ApiResponse<T> = await response.json()

    if (!result.success) {
      throw new Error(result.message || 'API request failed')
    }

    return result.data
  }
}

export const apiService = new ApiService(API_BASE_URL)

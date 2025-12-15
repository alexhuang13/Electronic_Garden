import { Task, ID } from '@core/types'
import { apiService } from './api'

/**
 * 任务相关的数据服务
 */

export const taskService = {
  /**
   * 获取任务列表
   */
  async getTasks(filter?: string): Promise<Task[]> {
    try {
      const endpoint = filter ? `/tasks?filter=${filter}` : '/tasks'
      return await apiService.get<Task[]>(endpoint)
    } catch (error) {
      console.error('获取任务列表失败:', error)
      return []
    }
  },

  /**
   * 获取单个任务详情
   */
  async getTaskById(id: ID): Promise<Task> {
    try {
      return await apiService.get<Task>(`/tasks/${id}`)
    } catch (error) {
      console.error('获取任务详情失败:', error)
      throw error
    }
  },

  /**
   * 创建新任务
   */
  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    try {
      return await apiService.post<Task>('/tasks', task)
    } catch (error) {
      console.error('创建任务失败:', error)
      throw error
    }
  },

  /**
   * 更新任务
   */
  async updateTask(id: ID, data: Partial<Task>): Promise<Task> {
    try {
      return await apiService.put<Task>(`/tasks/${id}`, data)
    } catch (error) {
      console.error('更新任务失败:', error)
      throw error
    }
  },

  /**
   * 完成任务
   */
  async completeTask(id: ID): Promise<void> {
    try {
      await apiService.post<void>(`/tasks/${id}/complete`, {})
    } catch (error) {
      console.error('完成任务失败:', error)
      throw error
    }
  },

  /**
   * 认领任务
   */
  async claimTask(id: ID, userId: ID): Promise<void> {
    try {
      await apiService.post<void>(`/tasks/${id}/claim`, { userId })
    } catch (error) {
      console.error('认领任务失败:', error)
      throw error
    }
  },
}

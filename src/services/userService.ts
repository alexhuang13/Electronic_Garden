import { User, ID } from '@core/types'
import { apiService } from './api'

/**
 * 用户相关的数据服务
 */

export const userService = {
  /**
   * 获取当前用户信息
   */
  async getCurrentUser(): Promise<User> {
    try {
      return await apiService.get<User>('/user/me')
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  },

  /**
   * 获取用户列表
   */
  async getUsers(): Promise<User[]> {
    try {
      return await apiService.get<User[]>('/users')
    } catch (error) {
      console.error('获取用户列表失败:', error)
      return []
    }
  },

  /**
   * 获取单个用户信息
   */
  async getUserById(id: ID): Promise<User> {
    try {
      return await apiService.get<User>(`/users/${id}`)
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  },

  /**
   * 更新用户信息
   */
  async updateUser(id: ID, data: Partial<User>): Promise<User> {
    try {
      return await apiService.put<User>(`/users/${id}`, data)
    } catch (error) {
      console.error('更新用户信息失败:', error)
      throw error
    }
  },
}

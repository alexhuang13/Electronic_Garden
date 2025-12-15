import { Plot, ID } from '@core/types'
import { apiService } from './api'

/**
 * 花园床位相关的数据服务
 */

export const plotService = {
  /**
   * 获取所有床位
   */
  async getPlots(): Promise<Plot[]> {
    try {
      return await apiService.get<Plot[]>('/plots')
    } catch (error) {
      console.error('获取床位列表失败:', error)
      // 返回模拟数据作为后备
      return []
    }
  },

  /**
   * 获取单个床位详情
   */
  async getPlotById(id: ID): Promise<Plot> {
    try {
      return await apiService.get<Plot>(`/plots/${id}`)
    } catch (error) {
      console.error('获取床位详情失败:', error)
      throw error
    }
  },

  /**
   * 更新床位状态
   */
  async updatePlot(id: ID, data: Partial<Plot>): Promise<Plot> {
    try {
      return await apiService.put<Plot>(`/plots/${id}`, data)
    } catch (error) {
      console.error('更新床位失败:', error)
      throw error
    }
  },

  /**
   * 给床位浇水
   */
  async waterPlot(id: ID): Promise<void> {
    try {
      await apiService.post<void>(`/plots/${id}/water`, {})
    } catch (error) {
      console.error('浇水失败:', error)
      throw error
    }
  },
}

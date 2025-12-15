import { Plot, PlotStatus } from '@core/types'

/**
 * 花园地块管理模块
 * 包含地块相关的业务逻辑
 */

export const plotManager = {
  /**
   * 判断地块是否需要紧急照料
   */
  needsUrgentCare(plot: Plot): boolean {
    return plot.status === 'needsWater' || plot.status === 'needsCare'
  },

  /**
   * 判断地块是否可以收获
   */
  isReadyForHarvest(plot: Plot): boolean {
    return plot.status === 'ready'
  },

  /**
   * 计算地块的健康度（0-100）
   */
  calculateHealth(plot: Plot): number {
    if (plot.crops.length === 0) return 100

    const avgHealth = plot.crops.reduce((sum, crop) => {
      let health = 100
      if (crop.healthStatus === 'needsWater') health = 60
      if (crop.healthStatus === 'needsFertilizer') health = 50
      if (crop.healthStatus === 'pest') health = 40
      if (crop.healthStatus === 'disease') health = 30
      return sum + health
    }, 0) / plot.crops.length

    return Math.round(avgHealth)
  },

  /**
   * 获取地块状态的优先级（数字越大越紧急）
   */
  getStatusPriority(status: PlotStatus): number {
    const priorityMap: Record<PlotStatus, number> = {
      needsWater: 5,
      needsCare: 4,
      ready: 3,
      growing: 2,
      planted: 1,
      empty: 0,
    }
    return priorityMap[status] || 0
  },

  /**
   * 对地块列表按优先级排序
   */
  sortByPriority(plots: Plot[]): Plot[] {
    return [...plots].sort((a, b) => {
      return this.getStatusPriority(b.status) - this.getStatusPriority(a.status)
    })
  },
}

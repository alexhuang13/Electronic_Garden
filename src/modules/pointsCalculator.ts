import { Task, TaskType, TaskPriority } from '@core/types'

/**
 * 积分计算模块
 * 计算任务完成后获得的积分
 */

export const pointsCalculator = {
  /**
   * 根据任务类型获取基础积分
   */
  getBasePoints(taskType: TaskType): number {
    const basePointsMap: Record<TaskType, number> = {
      watering: 10,
      weeding: 15,
      fertilizing: 20,
      harvesting: 25,
      maintenance: 30,
      other: 10,
    }
    return basePointsMap[taskType] || 10
  },

  /**
   * 根据任务优先级获取加成系数
   */
  getPriorityMultiplier(priority: TaskPriority): number {
    const multiplierMap: Record<TaskPriority, number> = {
      urgent: 2.0,
      high: 1.5,
      medium: 1.2,
      low: 1.0,
    }
    return multiplierMap[priority] || 1.0
  },

  /**
   * 计算任务完成获得的积分
   */
  calculateTaskPoints(task: Task): number {
    const basePoints = this.getBasePoints(task.type)
    const multiplier = this.getPriorityMultiplier(task.priority)

    let totalPoints = basePoints * multiplier

    // 如果提前完成，额外奖励 20%
    if (task.dueDate && task.completedAt) {
      const dueDate = new Date(task.dueDate)
      const completedDate = new Date(task.completedAt)
      if (completedDate < dueDate) {
        totalPoints *= 1.2
      }
    }

    return Math.round(totalPoints)
  },

  /**
   * 根据积分计算等级
   */
  calculateLevel(totalPoints: number): number {
    // 每 100 积分升一级
    return Math.floor(totalPoints / 100) + 1
  },

  /**
   * 计算到下一级需要的积分
   */
  pointsToNextLevel(currentPoints: number): number {
    const currentLevel = this.calculateLevel(currentPoints)
    const nextLevelPoints = currentLevel * 100
    return nextLevelPoints - currentPoints
  },
}

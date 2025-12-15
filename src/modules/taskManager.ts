import { Task, TaskStatus, TaskPriority } from '@core/types'

/**
 * 任务管理模块
 * 包含任务相关的业务逻辑
 */

export const taskManager = {
  /**
   * 判断任务是否逾期
   */
  isOverdue(task: Task): boolean {
    if (!task.dueDate) return false
    return new Date(task.dueDate) < new Date() && task.status !== 'completed'
  },

  /**
   * 判断任务是否即将到期（24小时内）
   */
  isDueSoon(task: Task): boolean {
    if (!task.dueDate) return false
    const now = new Date()
    const dueDate = new Date(task.dueDate)
    const hoursDiff = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    return hoursDiff > 0 && hoursDiff <= 24 && task.status !== 'completed'
  },

  /**
   * 获取任务优先级的数值（数字越大越紧急）
   */
  getPriorityValue(priority: TaskPriority): number {
    const priorityMap: Record<TaskPriority, number> = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1,
    }
    return priorityMap[priority] || 0
  },

  /**
   * 对任务列表按优先级和截止时间排序
   */
  sortTasks(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      // 首先按是否逾期排序
      const aOverdue = this.isOverdue(a)
      const bOverdue = this.isOverdue(b)
      if (aOverdue && !bOverdue) return -1
      if (!aOverdue && bOverdue) return 1

      // 然后按优先级排序
      const priorityDiff = this.getPriorityValue(b.priority) - this.getPriorityValue(a.priority)
      if (priorityDiff !== 0) return priorityDiff

      // 最后按截止时间排序
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })
  },

  /**
   * 筛选特定状态的任务
   */
  filterByStatus(tasks: Task[], status: TaskStatus): Task[] {
    return tasks.filter((task) => task.status === status)
  },

  /**
   * 筛选我的任务（分配给当前用户的）
   */
  filterMyTasks(tasks: Task[], userId: string | number): Task[] {
    return tasks.filter((task) => task.assignedTo === userId)
  },

  /**
   * 计算任务完成率
   */
  calculateCompletionRate(tasks: Task[]): number {
    if (tasks.length === 0) return 0
    const completed = tasks.filter((task) => task.status === 'completed').length
    return Math.round((completed / tasks.length) * 100)
  },
}

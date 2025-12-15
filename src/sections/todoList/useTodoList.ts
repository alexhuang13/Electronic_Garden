import { useState, useEffect } from 'react'
import { Task, ID } from '@core/types'

/**
 * TodoList 业务逻辑 Hook
 */

interface UseTodoListReturn {
  tasks: Task[]
  handleTaskClick: (taskId: ID) => void
  handleTaskComplete: (taskId: ID) => void
}

export function useTodoList(filter: 'myTasks' | 'needsHelp' | 'overdue' | 'all'): UseTodoListReturn {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    // 模拟数据加载
    const mockTasks: Task[] = [
      {
        id: 1,
        title: '给番茄浇水',
        description: '床位 A1 的番茄需要浇水',
        type: 'watering',
        priority: 'high',
        status: 'pending',
        dueDate: new Date('2025-12-15'),
        relatedPlotId: 1,
      },
      {
        id: 2,
        title: '除草任务',
        description: '床位 B1 周围需要除草',
        type: 'weeding',
        priority: 'medium',
        status: 'inProgress',
        dueDate: new Date('2025-12-16'),
        relatedPlotId: 3,
      },
      {
        id: 3,
        title: '收获萝卜',
        description: '床位 B1 的萝卜已成熟，可以收获',
        type: 'harvesting',
        priority: 'urgent',
        status: 'pending',
        dueDate: new Date('2025-12-14'),
        relatedPlotId: 3,
      },
      {
        id: 4,
        title: '施肥任务',
        description: '床位 A2 需要施肥',
        type: 'fertilizing',
        priority: 'low',
        status: 'needsHelp',
        dueDate: new Date('2025-12-18'),
        relatedPlotId: 2,
      },
    ]

    // 根据筛选条件过滤任务
    let filteredTasks = mockTasks

    switch (filter) {
      case 'myTasks':
        filteredTasks = mockTasks.filter(
          (task) => task.status === 'pending' || task.status === 'inProgress'
        )
        break
      case 'needsHelp':
        filteredTasks = mockTasks.filter((task) => task.status === 'needsHelp')
        break
      case 'overdue':
        filteredTasks = mockTasks.filter(
          (task) =>
            task.dueDate &&
            new Date(task.dueDate) < new Date() &&
            task.status !== 'completed'
        )
        break
      case 'all':
      default:
        filteredTasks = mockTasks
    }

    setTasks(filteredTasks)
  }, [filter])

  const handleTaskClick = (taskId: ID) => {
    console.log('点击了任务:', taskId)
    // 实际使用时，这里可以打开任务详情弹窗
  }

  const handleTaskComplete = (taskId: ID) => {
    console.log('完成任务:', taskId)
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: 'completed' as const, completedAt: new Date() }
          : task
      )
    )
    // 实际使用时，这里应该调用 services 层更新任务状态
  }

  return {
    tasks,
    handleTaskClick,
    handleTaskComplete,
  }
}

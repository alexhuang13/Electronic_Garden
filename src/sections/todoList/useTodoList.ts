import { useState, useEffect } from 'react'
import { Task, ID } from '@core/types'

/**
 * TodoList 业务逻辑 Hook
 */

interface UseTodoListReturn {
  tasks: Task[]
  handleTaskClick: (taskId: ID) => void
  handleTaskComplete: (taskId: ID) => void
  handleCreateTask: (taskData: {
    title: string
    description: string
    dueDate: Date
    reward: number
  }) => boolean
}

// 从localStorage加载任务
const loadTasksFromStorage = (): Task[] => {
  const savedTasks = localStorage.getItem('userTasks')
  if (savedTasks) {
    try {
      const parsed = JSON.parse(savedTasks)
      return parsed.map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      }))
    } catch (e) {
      return []
    }
  }
  return []
}

// 保存任务到localStorage
const saveTasksToStorage = (tasks: Task[]) => {
  localStorage.setItem('userTasks', JSON.stringify(tasks))
}

// 默认任务数据
const getDefaultTasks = (): Task[] => [
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

export function useTodoList(filter: 'myTasks' | 'needsHelp' | 'overdue' | 'all'): UseTodoListReturn {
  const [tasks, setTasks] = useState<Task[]>([])

  const reloadTasks = (currentFilter: typeof filter) => {
    const defaultTasks = getDefaultTasks()
    const userTasks = loadTasksFromStorage()
    const allTasks = [...defaultTasks, ...userTasks]

    let filteredTasks = allTasks
    switch (currentFilter) {
      case 'myTasks':
        filteredTasks = allTasks.filter(
          (task) => task.status === 'pending' || task.status === 'inProgress'
        )
        break
      case 'needsHelp':
        filteredTasks = allTasks.filter((task) => task.status === 'needsHelp')
        break
      case 'overdue':
        filteredTasks = allTasks.filter(
          (task) =>
            task.dueDate &&
            new Date(task.dueDate) < new Date() &&
            task.status !== 'completed'
        )
        break
      case 'all':
      default:
        filteredTasks = allTasks
    }

    setTasks(filteredTasks)
  }

  useEffect(() => {
    reloadTasks(filter)
  }, [filter])

  const handleTaskClick = (taskId: ID) => {
    console.log('点击了任务:', taskId)
    // 实际使用时，这里可以打开任务详情弹窗
  }

  const handleTaskComplete = (taskId: ID) => {
    console.log('完成任务:', taskId)
    
    // 更新任务状态
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: 'completed' as const, completedAt: new Date() }
          : task
      )
    )

    // 获取任务奖励（如果是用户发布的任务，使用任务的reward，否则默认50）
    const task = tasks.find(t => t.id === taskId)
    const rewardStars = (task as any)?.reward || 50
    const rewardExp = 10

    // 获取当前数据
    const currentPoints = parseInt(localStorage.getItem('profilePoints') || '2420', 10)
    const currentLevel = parseInt(localStorage.getItem('profileLevel') || '5', 10)
    const currentExp = parseInt(localStorage.getItem('profileCurrentExp') || '320', 10)
    const maxExp = 500

    // 计算新的积分和经验值
    const newPoints = currentPoints + rewardStars
    let newCurrentExp = currentExp + rewardExp
    let newLevel = currentLevel
    let levelUp = false

    // 检查是否升级（经验值达到500）
    if (newCurrentExp >= maxExp) {
      newLevel += 1
      newCurrentExp = newCurrentExp - maxExp // 保留超出部分
      levelUp = true
    }

    // 更新完成任务次数
    const completedTasks = parseInt(localStorage.getItem('profileCompletedTasks') || '42', 10)
    const newCompletedTasks = completedTasks + 1

    // 保存到localStorage
    localStorage.setItem('profilePoints', newPoints.toString())
    localStorage.setItem('profileLevel', newLevel.toString())
    localStorage.setItem('profileCurrentExp', newCurrentExp.toString())
    localStorage.setItem('profileCompletedTasks', newCompletedTasks.toString())

    // 触发自定义事件，通知其他组件更新
    window.dispatchEvent(new CustomEvent('pointsUpdated', { 
      detail: { newPoints, newLevel, newCurrentExp, levelUp } 
    }))

    // 显示奖励提示
    const rewardMessage = levelUp 
      ? `任务完成！获得 ${rewardStars}⭐ 和 ${rewardExp}EXP\n恭喜升级！Lv.${newLevel}` 
      : `任务完成！获得 ${rewardStars}⭐ 和 ${rewardExp}EXP`
    
    alert(rewardMessage)

    // 实际使用时，这里应该调用 services 层更新任务状态
  }

  const handleCreateTask = (taskData: {
    title: string
    description: string
    dueDate: Date
    reward: number
  }): boolean => {
    // 检查当前积分是否足够
    const currentPoints = parseInt(localStorage.getItem('profilePoints') || '2420', 10)
    if (currentPoints < taskData.reward) {
      alert(`积分不足！当前积分：${currentPoints}⭐，需要：${taskData.reward}⭐`)
      return false
    }

    // 扣除星星
    const newPoints = currentPoints - taskData.reward
    localStorage.setItem('profilePoints', newPoints.toString())

    // 创建新任务
    const userTasks = loadTasksFromStorage()
    const newTask: Task = {
      id: Date.now(), // 使用时间戳作为ID
      title: taskData.title,
      description: taskData.description,
      type: 'other',
      priority: 'medium',
      status: 'needsHelp',
      dueDate: taskData.dueDate,
      reward: taskData.reward, // 存储奖励信息
    }

    // 保存新任务
    const updatedTasks = [...userTasks, newTask]
    saveTasksToStorage(updatedTasks)

    // 触发积分更新事件
    window.dispatchEvent(new CustomEvent('pointsUpdated', { 
      detail: { newPoints } 
    }))

    // 重新加载任务列表
    reloadTasks(filter)

    alert(`任务发布成功！已扣除 ${taskData.reward}⭐`)
    return true
  }

  return {
    tasks,
    handleTaskClick,
    handleTaskComplete,
    handleCreateTask,
  }
}

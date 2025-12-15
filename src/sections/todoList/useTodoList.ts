import { useState, useEffect } from 'react'
import { Task, ID, Plot } from '@core/types'

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

// 从localStorage加载地块数据
const loadPlotsFromStorage = (): Plot[] => {
  const savedPlots = localStorage.getItem('gardenPlots')
  if (savedPlots) {
    try {
      const parsed = JSON.parse(savedPlots)
      return parsed.map((plot: any) => ({
        ...plot,
        crops: (plot.crops || []).map((crop: any) => ({
          ...crop,
          plantedDate: new Date(crop.plantedDate),
          expectedHarvestDate: new Date(crop.expectedHarvestDate),
        })),
      }))
    } catch (e) {
      return []
    }
  }
  return []
}

// 保存地块数据到localStorage
const savePlotsToStorage = (plots: Plot[]) => {
  localStorage.setItem('gardenPlots', JSON.stringify(plots))
}

// 从我的地块生成任务
const generateTasksFromMyPlots = (): Task[] => {
  const currentUserId = 'currentUser'
  const allPlots = loadPlotsFromStorage()
  const myPlots = allPlots.filter(plot => plot.assignedTo === currentUserId)
  
  const tasks: Task[] = []
  
  myPlots.forEach(plot => {
    const crop = plot.crops.length > 0 ? plot.crops[0] : null
    const cropName = crop?.name || '植物'
    
    // 根据地块状态生成任务
    if (plot.status === 'needsWater') {
      tasks.push({
        id: `plot-${plot.id}-watering`,
        title: `给${cropName}浇水`,
        description: `${plot.name} 的${cropName}需要浇水`,
        type: 'watering',
        priority: 'high',
        status: 'pending',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1天后
        relatedPlotId: plot.id,
      })
    } else if (plot.status === 'needsFertilizer') {
      tasks.push({
        id: `plot-${plot.id}-fertilizing`,
        title: `给${cropName}施肥`,
        description: `${plot.name} 的${cropName}需要施肥`,
        type: 'fertilizing',
        priority: 'medium',
        status: 'pending',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2天后
        relatedPlotId: plot.id,
      })
    } else if (plot.status === 'needsWeeding') {
      tasks.push({
        id: `plot-${plot.id}-weeding`,
        title: `给${plot.name}除草`,
        description: `${plot.name} 周围需要除草`,
        type: 'weeding',
        priority: 'medium',
        status: 'pending',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3天后
        relatedPlotId: plot.id,
      })
    }
  })
  
  return tasks
}

// 默认任务数据
const getDefaultTasks = (): Task[] => [
  {
    id: 1,
    title: '给番茄浇水',
    description: '地块 A1 的番茄需要浇水',
    type: 'watering',
    priority: 'high',
    status: 'pending',
    dueDate: new Date('2025-12-15'),
    relatedPlotId: 1,
  },
  {
    id: 2,
    title: '除草任务',
    description: '地块 B1 周围需要除草',
    type: 'weeding',
    priority: 'medium',
    status: 'inProgress',
    dueDate: new Date('2025-12-16'),
    relatedPlotId: 3,
  },
  {
    id: 3,
    title: '收获萝卜',
    description: '地块 B1 的萝卜已成熟，可以收获',
    type: 'harvesting',
    priority: 'urgent',
    status: 'pending',
    dueDate: new Date('2025-12-14'),
    relatedPlotId: 3,
  },
  {
    id: 4,
    title: '施肥任务',
    description: '地块 A2 需要施肥',
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
    // 验证任务是否有效（地块存在且状态匹配）
    const isValidTask = (task: Task): boolean => {
      // 如果没有关联地块，检查是否是用户创建的任务
      if (!task.relatedPlotId) {
        return true // 用户创建的任务始终有效
      }
      
      const allPlots = loadPlotsFromStorage()
      const plot = allPlots.find(p => p.id === task.relatedPlotId)
      
      // 如果地块不存在，任务无效
      if (!plot) {
        return false
      }
      
      // 如果是"我的任务"筛选，检查是否是当前用户的地块
      if (currentFilter === 'myTasks') {
        const currentUserId = 'currentUser'
        if (plot.assignedTo !== currentUserId) {
          return false
        }
      }
      
      // 检查任务类型是否与地块状态匹配
      if (task.type === 'watering' && plot.status !== 'needsWater') {
        return false
      }
      if (task.type === 'fertilizing' && plot.status !== 'needsFertilizer') {
        return false
      }
      if (task.type === 'weeding' && plot.status !== 'needsWeeding') {
        return false
      }
      if (task.type === 'harvesting' && plot.status !== 'ready') {
        return false
      }
      
      return true
    }
    const defaultTasks = getDefaultTasks()
    const userTasks = loadTasksFromStorage()
    
    // 如果是"我的任务"，从我的地块自动生成任务
    let plotTasks: Task[] = []
    if (currentFilter === 'myTasks') {
      plotTasks = generateTasksFromMyPlots()
    }
    
    // 合并所有任务
    let allTasks = [...defaultTasks, ...userTasks, ...plotTasks]
    
    // 验证任务有效性，只保留有效的任务
    allTasks = allTasks.filter(task => isValidTask(task))

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
    
    // 监听地块更新事件，重新加载任务
    const handlePlotUpdate = () => {
      reloadTasks(filter)
    }
    
    window.addEventListener('plotUpdated', handlePlotUpdate)
    return () => {
      window.removeEventListener('plotUpdated', handlePlotUpdate)
    }
  }, [filter])

  const handleTaskClick = (taskId: ID) => {
    console.log('点击了任务:', taskId)
    // 实际使用时，这里可以打开任务详情弹窗
  }

  const handleTaskComplete = (taskId: ID) => {
    console.log('完成任务:', taskId)
    
    // 获取任务信息
    const task = tasks.find(t => t.id === taskId)
    if (!task) return
    
    // 如果任务关联了地块，更新地块状态
    if (task.relatedPlotId) {
      const allPlots = loadPlotsFromStorage()
      const updatedPlots = allPlots.map(plot => {
        if (plot.id === task.relatedPlotId) {
          // 根据任务类型更新地块状态
          let newStatus: Plot['status'] = plot.status
          let updatedCrops = plot.crops
          
          // 根据任务类型更新地块状态（不检查当前状态，直接更新）
          if (task.type === 'watering') {
            if (plot.status === 'needsWater') {
              newStatus = 'growing' // 浇水后改为生长中
            }
          } else if (task.type === 'fertilizing') {
            if (plot.status === 'needsFertilizer') {
              newStatus = 'growing' // 施肥后改为生长中
            }
          } else if (task.type === 'weeding') {
            if (plot.status === 'needsWeeding') {
              newStatus = 'growing' // 除草后改为生长中
            }
          } else if (task.type === 'harvesting') {
            if (plot.status === 'ready') {
              newStatus = 'empty' // 收获后改为空闲
              updatedCrops = [] // 清空作物
            }
          }
          
          // 如果状态改变了，更新地块
          if (newStatus !== plot.status || updatedCrops.length !== plot.crops.length) {
            return {
              ...plot,
              status: newStatus,
              crops: updatedCrops,
            }
          }
        }
        return plot
      })
      
      // 检查是否有变化
      const hasChanges = updatedPlots.some((plot, index) => 
        plot.status !== allPlots[index]?.status ||
        plot.crops.length !== allPlots[index]?.crops.length
      )
      
      if (hasChanges) {
        savePlotsToStorage(updatedPlots)
        // 触发地块更新事件
        window.dispatchEvent(new CustomEvent('plotUpdated'))
      }
    }

    // 如果是用户创建的任务，从localStorage中删除
    const userTasks = loadTasksFromStorage()
    const updatedUserTasks = userTasks.filter(t => t.id !== taskId)
    if (updatedUserTasks.length !== userTasks.length) {
      saveTasksToStorage(updatedUserTasks)
    }

    // 获取任务奖励（如果是用户发布的任务，使用任务的reward，否则默认50）
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

    // 重新加载任务列表（任务会被移除，因为地块状态变化或任务被删除）
    reloadTasks(filter)

    // 显示奖励提示
    const rewardMessage = levelUp 
      ? `任务完成！获得 ${rewardStars}⭐ 和 ${rewardExp}EXP\n恭喜升级！Lv.${newLevel}` 
      : `任务完成！获得 ${rewardStars}⭐ 和 ${rewardExp}EXP`
    
    alert(rewardMessage)
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

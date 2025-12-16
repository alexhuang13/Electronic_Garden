import { useState, useEffect } from 'react'
import { Plot, ID } from '@core/types'
import { incrementAdoptedPlotsCount } from '@modules/badgeManager'

/**
 * PlotCardList 业务逻辑 Hook
 */

interface UsePlotCardListReturn {
  plots: Plot[]
  handlePlotClick: (plotId: ID) => void
  handleApplyResponsibility: (plotId: ID) => void
  handleEditPlot: (plotId: ID, data: { cropName: string; status: Plot['status'] }) => void
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

// 获取默认地块数据
const getDefaultPlots = (): Plot[] => [
  {
    id: 1,
    name: '地块 A1',
    position: { x: 0, y: 0 },
    size: { width: 2, height: 3 },
    status: 'growing',
    crops: [
      {
        id: 101,
        name: '番茄',
        plantedDate: new Date('2025-11-01'),
        expectedHarvestDate: new Date('2025-12-25'),
        growthProgress: 65,
        waterLevel: 80,
        healthStatus: 'healthy',
      },
    ],
    soilCondition: {
      fertility: 75,
      droughtLevel: 25,
    },
    assignedTo: 'user1',
    assignedToName: '张三',
    responsiblePerson: {
      id: 'user1',
      name: '张三',
      level: 12,
      badges: [
        { id: 'b1', name: '种植达人', icon: '🌱', description: '成功种植10种植物', earnedDate: new Date('2025-10-01') },
        { id: 'b2', name: '浇水专家', icon: '💧', description: '累计浇水100次', earnedDate: new Date('2025-10-15') },
        { id: 'b3', name: '收获大师', icon: '🌾', description: '收获50次作物', earnedDate: new Date('2025-11-01') },
      ],
    },
  },
  {
    id: 2,
    name: '地块 A2',
    position: { x: 2, y: 0 },
    size: { width: 2, height: 3 },
    status: 'needsWater',
    crops: [
      {
        id: 102,
        name: '生菜',
        plantedDate: new Date('2025-11-10'),
        expectedHarvestDate: new Date('2025-12-20'),
        growthProgress: 45,
        waterLevel: 30,
        healthStatus: 'needsWater',
      },
    ],
    soilCondition: {
      fertility: 50,
      droughtLevel: 70,
    },
    assignedTo: 'user2',
    assignedToName: '李四',
    responsiblePerson: {
      id: 'user2',
      name: '李四',
      level: 8,
      badges: [
        { id: 'b4', name: '新手园丁', icon: '🌿', description: '完成首次种植', earnedDate: new Date('2025-11-01') },
      ],
    },
  },
  {
    id: 3,
    name: '地块 B1',
    position: { x: 0, y: 3 },
    size: { width: 2, height: 3 },
    status: 'ready',
    crops: [
      {
        id: 103,
        name: '萝卜',
        plantedDate: new Date('2025-10-15'),
        expectedHarvestDate: new Date('2025-12-15'),
        growthProgress: 100,
        waterLevel: 70,
        healthStatus: 'healthy',
      },
    ],
    soilCondition: {
      fertility: 85,
      droughtLevel: 15,
    },
    assignedTo: 'user3',
    assignedToName: '王五',
    responsiblePerson: {
      id: 'user3',
      name: '王五',
      level: 18,
      badges: [
        { id: 'b5', name: '种植达人', icon: '🌱', description: '成功种植10种植物', earnedDate: new Date('2025-09-01') },
        { id: 'b6', name: '浇水专家', icon: '💧', description: '累计浇水100次', earnedDate: new Date('2025-09-15') },
        { id: 'b7', name: '收获大师', icon: '🌾', description: '收获50次作物', earnedDate: new Date('2025-10-01') },
        { id: 'b8', name: '社区贡献者', icon: '🏆', description: '参与10次社区活动', earnedDate: new Date('2025-10-20') },
        { id: 'b9', name: '知识分享', icon: '📚', description: '分享5篇种植经验', earnedDate: new Date('2025-11-01') },
        { id: 'b10', name: '环保先锋', icon: '🌍', description: '使用有机肥料50次', earnedDate: new Date('2025-11-15') },
      ],
    },
  },
  {
    id: 4,
    name: '地块 B2',
    position: { x: 2, y: 3 },
    size: { width: 2, height: 3 },
    status: 'empty',
    crops: [],
    soilCondition: {
      fertility: 40,
      droughtLevel: 60,
    },
  },
]

export function usePlotCardList(filter: 'all' | 'myPlots' = 'all'): UsePlotCardListReturn {
  const [allPlots, setAllPlots] = useState<Plot[]>([])
  const currentUserId = 'currentUser'
  const currentUserName = localStorage.getItem('profileName') || '花园守护者'

  // 检查并更新地块状态：如果进度条满了，自动改为"可收获"
  const checkAndUpdatePlotStatus = (plots: Plot[]): Plot[] => {
    return plots.map(plot => {
      // 如果有作物且进度条达到100%，且状态不是ready，则更新为ready
      if (plot.crops.length > 0) {
        const crop = plot.crops[0]
        if (crop.growthProgress >= 100 && plot.status !== 'ready') {
          return {
            ...plot,
            status: 'ready',
          }
        }
      }
      return plot
    })
  }

  useEffect(() => {
    // 从localStorage加载数据，如果没有则使用默认数据
    const savedPlots = loadPlotsFromStorage()
    let plotsToSet: Plot[] = []
    
    if (savedPlots.length > 0) {
      plotsToSet = savedPlots
    } else {
      plotsToSet = getDefaultPlots()
      savePlotsToStorage(plotsToSet)
    }
    
    // 检查并更新状态
    const updatedPlots = checkAndUpdatePlotStatus(plotsToSet)
    setAllPlots(updatedPlots)
    
    // 如果状态有更新，保存到localStorage
    if (JSON.stringify(plotsToSet) !== JSON.stringify(updatedPlots)) {
      savePlotsToStorage(updatedPlots)
      // 触发地块更新事件
      window.dispatchEvent(new CustomEvent('plotUpdated'))
    }
  }, [])

  // 检查并更新地块状态的辅助函数
  const updatePlotsIfNeeded = (plots: Plot[]): Plot[] => {
    return plots.map(plot => {
      if (plot.crops.length > 0) {
        const crop = plot.crops[0]
        if (crop.growthProgress >= 100 && plot.status !== 'ready') {
          return {
            ...plot,
            status: 'ready' as const,
          }
        }
      }
      return plot
    })
  }

  // 监听进度条变化，如果进度条满了自动改为ready
  useEffect(() => {
    const needsUpdate = allPlots.some(plot => {
      if (plot.crops.length > 0) {
        const crop = plot.crops[0]
        return crop.growthProgress >= 100 && plot.status !== 'ready'
      }
      return false
    })

    if (needsUpdate) {
      const updatedPlots = updatePlotsIfNeeded(allPlots)
      // 检查是否有实际变化
      const hasChanges = updatedPlots.some((plot, index) => 
        plot.status !== allPlots[index]?.status
      )
      if (hasChanges) {
        setAllPlots(updatedPlots)
        savePlotsToStorage(updatedPlots)
        // 触发地块更新事件
        window.dispatchEvent(new CustomEvent('plotUpdated'))
      }
    }
  }, [allPlots.map(p => p.crops[0]?.growthProgress || 0).join(',')]) // 只在进度条变化时检查

  // 根据filter过滤地块
  const plots = filter === 'myPlots' 
    ? allPlots.filter(plot => plot.assignedTo === currentUserId)
    : allPlots

  const handlePlotClick = (plotId: ID) => {
    console.log('点击了地块:', plotId)
    // 实际使用时，这里可以打开地块详情弹窗或跳转到详情页
  }

  const handleApplyResponsibility = (plotId: ID) => {
    const responsibilityCost = 2000
    
    // 检查当前积分是否足够
    const currentPoints = parseInt(localStorage.getItem('profilePoints') || '2420', 10)
    
    if (currentPoints < responsibilityCost) {
      alert(`星星不足！当前：${currentPoints}⭐，需要：${responsibilityCost}⭐`)
      return
    }

    // 扣除星星
    const newPoints = currentPoints - responsibilityCost
    localStorage.setItem('profilePoints', newPoints.toString())

    // 设置负责人
    const updatedPlots = allPlots.map(plot => {
      if (plot.id === plotId) {
        return {
          ...plot,
          assignedTo: currentUserId,
          assignedToName: currentUserName,
        }
      }
      return plot
    })
    
    setAllPlots(updatedPlots)
    savePlotsToStorage(updatedPlots)
    
    // 触发积分更新事件
    window.dispatchEvent(new CustomEvent('pointsUpdated', { 
      detail: { newPoints } 
    }))
    
    // 检查并授予相关徽章
    const badge = incrementAdoptedPlotsCount()
    
    const plotName = updatedPlots.find(p => p.id === plotId)?.name || '地块'
    let message = `您已成为 ${plotName} 的负责人！\n已扣除 ${responsibilityCost}⭐`
    if (badge) {
      message += `\n\n🎉 获得新徽章：${badge.name} ${badge.icon}\n✨ 徽章奖励：500⭐ + 50EXP`
    }
    alert(message)
  }

  const handleEditPlot = (plotId: ID, data: { cropName: string; status: Plot['status'] }) => {
    let updatedPlots = allPlots.map(plot => {
      if (plot.id === plotId) {
        // 更新状态
        const newStatus = data.status
        
        // 更新或创建作物
        const existingCrop = plot.crops.length > 0 ? plot.crops[0] : null
        const newCrop = {
          id: existingCrop?.id || Date.now(),
          name: data.cropName,
          plantedDate: existingCrop?.plantedDate || new Date(),
          expectedHarvestDate: existingCrop?.expectedHarvestDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 默认30天后
          growthProgress: 0, // 修改后进度条重置为0
          waterLevel: existingCrop?.waterLevel || 50,
          healthStatus: newStatus === 'needsWater' ? 'needsWater' as const
            : newStatus === 'needsFertilizer' ? 'needsFertilizer' as const
            : 'healthy' as const,
        }

        return {
          ...plot,
          status: newStatus,
          crops: [newCrop],
        }
      }
      return plot
    })
    
    // 检查是否有地块进度条满了，自动改为ready
    updatedPlots = updatePlotsIfNeeded(updatedPlots)
    
    setAllPlots(updatedPlots)
    savePlotsToStorage(updatedPlots)
    
    // 触发地块更新事件，通知任务列表更新
    window.dispatchEvent(new CustomEvent('plotUpdated'))
    
    alert('地块信息已更新！植物进度条已重置为0。')
  }

  return {
    plots,
    handlePlotClick,
    handleApplyResponsibility,
    handleEditPlot,
  }
}

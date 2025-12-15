import { useState, useEffect } from 'react'
import { Plot, ID } from '@core/types'

/**
 * PlotCardList 业务逻辑 Hook
 */

interface UsePlotCardListReturn {
  plots: Plot[]
  handlePlotClick: (plotId: ID) => void
}

export function usePlotCardList(): UsePlotCardListReturn {
  const [plots, setPlots] = useState<Plot[]>([])

  useEffect(() => {
    // 模拟数据加载
    // 实际使用时，这里应该调用 services 层获取数据
    const mockPlots: Plot[] = [
      {
        id: 1,
        name: '床位 A1',
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
      },
      {
        id: 2,
        name: '床位 A2',
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
      },
      {
        id: 3,
        name: '床位 B1',
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
      },
      {
        id: 4,
        name: '床位 B2',
        position: { x: 2, y: 3 },
        size: { width: 2, height: 3 },
        status: 'empty',
        crops: [],
      },
    ]

    setPlots(mockPlots)
  }, [])

  const handlePlotClick = (plotId: ID) => {
    console.log('点击了床位:', plotId)
    // 实际使用时，这里可以打开床位详情弹窗或跳转到详情页
  }

  return {
    plots,
    handlePlotClick,
  }
}

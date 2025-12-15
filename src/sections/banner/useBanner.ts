import { useState, useEffect } from 'react'

/**
 * Banner 业务逻辑 Hook
 */

interface BannerData {
  content: string
  icon: string
}

export function useBanner(type: 'weather' | 'announcement' | 'suggestion'): BannerData {
  const [bannerData, setBannerData] = useState<BannerData>({
    content: '加载中...',
    icon: '⏳',
  })

  useEffect(() => {
    // 模拟数据加载
    // 实际使用时，这里应该调用 services 层获取数据
    const mockData: Record<string, BannerData> = {
      weather: {
        icon: '☀️',
        content: '今天天气晴朗，温度 18-25°C，适合户外种植活动',
      },
      announcement: {
        icon: '📢',
        content: '本周社区会议将于周六下午 2 点举行，欢迎参加！',
      },
      suggestion: {
        icon: '💡',
        content: '建议：现在是种植番茄的好时节，记得及时浇水',
      },
    }

    setBannerData(mockData[type] || mockData.weather)
  }, [type])

  return bannerData
}

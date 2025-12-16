import { useState, useEffect } from 'react'
import { weatherService } from '@services/weatherService'

/**
 * Banner 业务逻辑 Hook
 */

interface BannerData {
  content: string
  icon: string
}

// 根据天气条件返回对应的图标
function getWeatherIcon(condition: string): string {
  const iconMap: Record<string, string> = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    stormy: '⛈️',
    snowy: '❄️',
  }
  return iconMap[condition] || '☀️'
}

// 格式化天气内容
function formatWeatherContent(weather: {
  temperature: { min: number; max: number }
  condition: string
  gardeningAdvice: string
}): string {
  return `${weather.gardeningAdvice}（温度：${weather.temperature.min}-${weather.temperature.max}°C）`
}

export function useBanner(type: 'weather' | 'announcement' | 'suggestion'): BannerData {
  const [bannerData, setBannerData] = useState<BannerData>({
    content: '加载中...',
    icon: '⏳',
  })

  useEffect(() => {
    if (type === 'weather') {
      // 从localStorage获取用户设置的地点，默认为北京
      const userLocation = localStorage.getItem('userLocation') || '北京'
      
      // 获取真实天气数据
      weatherService
        .getCurrentWeather(userLocation)
        .then((weather) => {
          setBannerData({
            icon: getWeatherIcon(weather.condition),
            content: formatWeatherContent(weather),
          })
        })
        .catch((error) => {
          console.error('获取天气失败:', error)
          // 失败时使用默认数据
          setBannerData({
            icon: '☀️',
            content: '今天天气晴朗，温度 18-25°C，适合户外种植活动',
          })
        })
    } else {
      // 其他类型的Banner使用模拟数据
      const mockData: Record<string, BannerData> = {
        announcement: {
          icon: '📢',
          content: '本周社区会议将于周六下午 2 点举行，欢迎参加！',
        },
        suggestion: {
          icon: '💡',
          content: '建议：现在是种植番茄的好时节，记得及时浇水',
        },
      }

      setBannerData(mockData[type] || mockData.announcement)
    }
  }, [type])

  // 监听地点更新事件
  useEffect(() => {
    if (type === 'weather') {
      const handleLocationUpdate = (event: CustomEvent) => {
        const { location } = event.detail || {}
        if (location) {
          // 重新获取天气数据
          weatherService
            .getCurrentWeather(location)
            .then((weather) => {
              setBannerData({
                icon: getWeatherIcon(weather.condition),
                content: formatWeatherContent(weather),
              })
            })
            .catch((error) => {
              console.error('获取天气失败:', error)
            })
        }
      }

      window.addEventListener('locationUpdated', handleLocationUpdate as EventListener)
      return () => {
        window.removeEventListener('locationUpdated', handleLocationUpdate as EventListener)
      }
    }
  }, [type])

  return bannerData
}

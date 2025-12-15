import { useState, useEffect } from 'react'
import { WeatherInfo } from '@core/types'
import { weatherService } from '@services/weatherService'
import Card from '@components/Card'
import './WeatherCard.css'

/**
 * 天气卡片组件
 * 显示详细的天气信息
 */

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

// 根据天气条件返回对应的背景渐变
function getWeatherGradient(condition: string): string {
  const gradientMap: Record<string, string> = {
    sunny: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    cloudy: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    rainy: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    stormy: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    snowy: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
  }
  return gradientMap[condition] || gradientMap.sunny
}

export default function WeatherCard() {
  const [weather, setWeather] = useState<WeatherInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState(() => localStorage.getItem('userLocation') || '北京')

  useEffect(() => {
    const loadWeather = () => {
      setLoading(true)
      weatherService
        .getCurrentWeather(location)
        .then((data) => {
          setWeather(data)
          setLoading(false)
        })
        .catch((error) => {
          console.error('获取天气失败:', error)
          setLoading(false)
        })
    }

    loadWeather()

    // 监听地点更新事件
    const handleLocationUpdate = (event: CustomEvent) => {
      const { location: newLocation } = event.detail || {}
      if (newLocation) {
        setLocation(newLocation)
        loadWeather()
      }
    }

    window.addEventListener('locationUpdated', handleLocationUpdate as EventListener)
    return () => {
      window.removeEventListener('locationUpdated', handleLocationUpdate as EventListener)
    }
  }, [location])

  if (loading) {
    return (
      <Card className="weather-card weather-card-loading">
        <div className="weather-card-content">
          <div className="weather-loading">加载天气信息中...</div>
        </div>
      </Card>
    )
  }

  if (!weather) {
    return null
  }

  const icon = getWeatherIcon(weather.condition)
  const gradient = getWeatherGradient(weather.condition)

  return (
    <Card className="weather-card" style={{ background: gradient }}>
      <div className="weather-card-content">
        <div className="weather-card-header">
          <div className="weather-card-location">
            <span className="weather-location-text">{location}</span>
          </div>
          <div className="weather-card-date">
            {(() => {
              const date = new Date(weather.date)
              const dateStr = date.toLocaleDateString('zh-CN', {
                month: 'long',
                day: 'numeric',
              })
              const weekdayStr = date.toLocaleDateString('zh-CN', {
                weekday: 'long',
              })
              return `${dateStr} ${weekdayStr}`
            })()}
          </div>
        </div>

        <div className="weather-card-main">
          <div className="weather-card-icon">{icon}</div>
          <div className="weather-card-temp">
            <div className="weather-temp-current">
              {weather.temperature.current !== undefined 
                ? `${weather.temperature.current}°C` 
                : `${Math.round((weather.temperature.min + weather.temperature.max) / 2)}°C`}
            </div>
            <div className="weather-temp-range">
              {weather.temperature.min}°C / {weather.temperature.max}°C
            </div>
          </div>
          <div className="weather-card-details">
            <div className="weather-detail-item">
              <span className="weather-detail-label">天气状况</span>
              <span className="weather-detail-value">
                {weather.condition === 'sunny' && '晴天'}
                {weather.condition === 'cloudy' && '多云'}
                {weather.condition === 'rainy' && '雨天'}
                {weather.condition === 'stormy' && '雷暴'}
                {weather.condition === 'snowy' && '雪天'}
              </span>
            </div>
            <div className="weather-detail-item">
              <span className="weather-detail-label">湿度</span>
              <span className="weather-detail-value">{weather.humidity}%</span>
            </div>
            <div className="weather-card-advice">
              <div className="weather-advice-icon">💡</div>
              <div className="weather-advice-text">{weather.gardeningAdvice}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}


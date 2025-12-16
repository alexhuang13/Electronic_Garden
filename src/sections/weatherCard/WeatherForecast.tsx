import { useState, useEffect } from 'react'
import { WeatherInfo } from '@core/types'
import { weatherService } from '@services/weatherService'
import Card from '@components/Card'
import './WeatherForecast.css'

/**
 * 天气预报组件
 * 显示未来几天的天气预报
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

// 获取日期显示文本
function getDateLabel(date: Date): string {
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}月${day}日`
}

export default function WeatherForecast() {
  const [forecast, setForecast] = useState<WeatherInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState(() => localStorage.getItem('userLocation') || '北京')

  useEffect(() => {
    const loadForecast = () => {
      setLoading(true)
      weatherService
        .getWeatherForecast(7, location)
        .then((data) => {
          setForecast(data)
          setLoading(false)
        })
        .catch((error) => {
          console.error('获取天气预报失败:', error)
          setLoading(false)
        })
    }

    loadForecast()

    // 监听地点更新事件
    const handleLocationUpdate = (event: CustomEvent) => {
      const { location: newLocation } = event.detail || {}
      if (newLocation) {
        setLocation(newLocation)
        loadForecast()
      }
    }

    window.addEventListener('locationUpdated', handleLocationUpdate as EventListener)
    return () => {
      window.removeEventListener('locationUpdated', handleLocationUpdate as EventListener)
    }
  }, [location])

  if (loading) {
    return (
      <Card className="weather-forecast-card">
        <div className="weather-forecast-loading">加载天气预报中...</div>
      </Card>
    )
  }

  if (forecast.length === 0) {
    return null
  }

  // 计算温度范围用于显示温度条
  const allTemps = forecast.flatMap(f => [f.temperature.min, f.temperature.max])
  const minTemp = Math.min(...allTemps)
  const maxTemp = Math.max(...allTemps)
  const tempRange = maxTemp - minTemp

  return (
    <Card className="weather-forecast-card">
      <div className="weather-forecast-header">
        <h3 className="weather-forecast-title">7日天气预报</h3>
      </div>
      <div className="weather-forecast-list">
        {forecast.map((day, index) => {
          const date = new Date(day.date)
          const icon = getWeatherIcon(day.condition)
          const dateLabel = getDateLabel(date)
          
          // 计算温度条的位置和长度
          const barStart = ((day.temperature.min - minTemp) / tempRange) * 100
          const barLength = ((day.temperature.max - day.temperature.min) / tempRange) * 100

          return (
            <div key={index} className="weather-forecast-item">
              <div className="forecast-date">{dateLabel}</div>
              <div className="forecast-icon">{icon}</div>
              <div className="forecast-temp-low">{day.temperature.min}°C</div>
              <div className="forecast-temp-bar-container">
                <div 
                  className="forecast-temp-bar"
                  style={{
                    left: `${barStart}%`,
                    width: `${barLength}%`,
                  }}
                />
              </div>
              <div className="forecast-temp-high">{day.temperature.max}°C</div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}


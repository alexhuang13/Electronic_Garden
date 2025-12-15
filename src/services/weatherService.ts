import { WeatherInfo } from '@core/types'
import { apiService } from './api'

/**
 * 天气相关的数据服务
 */

export const weatherService = {
  /**
   * 获取当前天气信息
   */
  async getCurrentWeather(): Promise<WeatherInfo> {
    try {
      return await apiService.get<WeatherInfo>('/weather/current')
    } catch (error) {
      console.error('获取天气信息失败:', error)
      // 返回模拟数据作为后备
      return {
        date: new Date(),
        temperature: { min: 18, max: 25 },
        condition: 'sunny',
        humidity: 60,
        gardeningAdvice: '天气晴朗，适合户外种植活动',
      }
    }
  },

  /**
   * 获取未来几天的天气预报
   */
  async getWeatherForecast(days: number = 7): Promise<WeatherInfo[]> {
    try {
      return await apiService.get<WeatherInfo[]>(`/weather/forecast?days=${days}`)
    } catch (error) {
      console.error('获取天气预报失败:', error)
      return []
    }
  },
}

import { WeatherInfo } from '@core/types'

/**
 * 天气相关的数据服务
 * 使用 wttr.in API（免费，无需API key）
 */

// 将wttr.in的天气代码转换为我们的天气类型
function mapWeatherCondition(code: string): WeatherInfo['condition'] {
  const codeNum = parseInt(code)
  if (codeNum >= 200 && codeNum < 300) return 'stormy'
  if (codeNum >= 300 && codeNum < 600) return 'rainy'
  if (codeNum >= 600 && codeNum < 700) return 'snowy'
  if (codeNum >= 700 && codeNum < 800) return 'cloudy'
  if (codeNum === 800) return 'sunny'
  if (codeNum > 800) return 'cloudy'
  return 'sunny'
}

// 生成种植建议
function generateGardeningAdvice(
  condition: WeatherInfo['condition'],
  temp: number,
  humidity: number
): string {
  if (condition === 'rainy') {
    return '今天有雨，注意排水，避免积水影响植物生长'
  }
  if (condition === 'stormy') {
    return '今天有雷暴，请避免户外活动，注意保护植物'
  }
  if (condition === 'snowy') {
    return '今天有雪，注意防寒，保护不耐寒的植物'
  }
  if (temp > 30) {
    return '今天温度较高，记得多浇水，避免植物缺水'
  }
  if (temp < 10) {
    return '今天温度较低，注意防寒，可以覆盖保温材料'
  }
  if (humidity < 40) {
    return '今天湿度较低，建议增加浇水频率'
  }
  if (condition === 'sunny') {
    return '今天天气晴朗，温度适宜，适合户外种植活动'
  }
  return '今天天气多云，适合进行日常的植物养护工作'
}

export const weatherService = {
  /**
   * 获取当前天气信息
   * @param city 城市名称，默认为北京
   */
  async getCurrentWeather(city: string = 'Beijing'): Promise<WeatherInfo> {
    try {
      // 使用 wttr.in API，返回JSON格式
      const response = await fetch(`https://wttr.in/${city}?format=j1&lang=zh`)
      
      if (!response.ok) {
        throw new Error('天气API请求失败')
      }

      const data = await response.json()
      const current = data.current_condition[0]
      const today = data.weather[0]

      const temp = parseInt(current.temp_C)
      const humidity = parseInt(current.humidity)
      const condition = mapWeatherCondition(current.weatherCode)

      return {
        date: new Date(),
        temperature: {
          min: parseInt(today.mintempC),
          max: parseInt(today.maxtempC),
          current: temp, // 添加当前实时温度
        },
        condition,
        humidity,
        gardeningAdvice: generateGardeningAdvice(condition, temp, humidity),
      }
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
  async getWeatherForecast(days: number = 7, city: string = 'Beijing'): Promise<WeatherInfo[]> {
    try {
      const response = await fetch(`https://wttr.in/${city}?format=j1&lang=zh`)
      
      if (!response.ok) {
        throw new Error('天气API请求失败')
      }

      const data = await response.json()
      const forecasts: WeatherInfo[] = []

      for (let i = 0; i < Math.min(days, data.weather.length); i++) {
        const day = data.weather[i]
        const condition = mapWeatherCondition(day.hourly[0].weatherCode)
        const temp = parseInt(day.hourly[0].tempC)
        
        // 解析日期，wttr.in返回的日期格式为 "2024-12-15"
        const dateStr = day.date
        const date = dateStr ? new Date(dateStr) : new Date(Date.now() + i * 24 * 60 * 60 * 1000)

        forecasts.push({
          date,
          temperature: {
            min: parseInt(day.mintempC),
            max: parseInt(day.maxtempC),
          },
          condition,
          humidity: parseInt(day.hourly[0].humidity),
          gardeningAdvice: generateGardeningAdvice(
            condition,
            temp,
            parseInt(day.hourly[0].humidity)
          ),
        })
      }

      return forecasts
    } catch (error) {
      console.error('获取天气预报失败:', error)
      return []
    }
  },
}

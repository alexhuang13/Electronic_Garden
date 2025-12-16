import { WeatherInfo } from '@core/types'

/**
 * 天气相关的数据服务
 * 支持多种天气API：
 * 1. OpenWeatherMap API（推荐，需要API key）
 * 2. wttr.in API（免费，无需API key，作为后备）
 */

// 天气API配置
const WEATHER_API_CONFIG = {
  // OpenWeatherMap API配置
  openWeatherMap: {
    apiKey: import.meta.env.VITE_OPENWEATHER_API_KEY || '',
    baseUrl: 'https://api.openweathermap.org/data/2.5',
  },
  // 默认使用OpenWeatherMap，如果没有API key则使用wttr.in
  provider: import.meta.env.VITE_WEATHER_PROVIDER || (import.meta.env.VITE_OPENWEATHER_API_KEY ? 'openweather' : 'wttr'),
}

// 将OpenWeatherMap的天气代码转换为我们的天气类型
function mapOpenWeatherCondition(weatherId: number): WeatherInfo['condition'] {
  // OpenWeatherMap天气代码：https://openweathermap.org/weather-conditions
  if (weatherId >= 200 && weatherId < 300) return 'stormy' // 雷暴
  if (weatherId >= 300 && weatherId < 400) return 'rainy' // 毛毛雨
  if (weatherId >= 500 && weatherId < 600) return 'rainy' // 雨
  if (weatherId >= 600 && weatherId < 700) return 'snowy' // 雪
  if (weatherId >= 700 && weatherId < 800) return 'cloudy' // 大气现象（雾、霾等）
  if (weatherId === 800) return 'sunny' // 晴天
  if (weatherId > 800) return 'cloudy' // 多云
  return 'sunny'
}

// 将wttr.in的天气代码转换为我们的天气类型
function mapWttrCondition(code: string): WeatherInfo['condition'] {
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

// OpenWeatherMap API实现
async function getCurrentWeatherFromOpenWeather(city: string): Promise<WeatherInfo> {
  const apiKey = WEATHER_API_CONFIG.openWeatherMap.apiKey
  if (!apiKey) {
    throw new Error('OpenWeatherMap API key未配置')
  }

  // 支持中文城市名，先尝试直接查询，如果失败则使用城市名
  const encodedCity = encodeURIComponent(city)
  const url = `${WEATHER_API_CONFIG.openWeatherMap.baseUrl}/weather?q=${encodedCity}&appid=${apiKey}&units=metric&lang=zh_cn`

  const response = await fetch(url)
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`未找到城市: ${city}`)
    }
    if (response.status === 401) {
      throw new Error('OpenWeatherMap API key无效')
    }
    throw new Error(`天气API请求失败: ${response.status}`)
  }

  const data = await response.json()
  
  const temp = Math.round(data.main.temp)
  const humidity = data.main.humidity
  const condition = mapOpenWeatherCondition(data.weather[0].id)

  return {
    date: new Date(data.dt * 1000),
    temperature: {
      min: Math.round(data.main.temp_min),
      max: Math.round(data.main.temp_max),
      current: temp,
    },
    condition,
    humidity,
    gardeningAdvice: generateGardeningAdvice(condition, temp, humidity),
  }
}

// wttr.in API实现（后备方案）
async function getCurrentWeatherFromWttr(city: string): Promise<WeatherInfo> {
  const encodedCity = encodeURIComponent(city)
  const response = await fetch(`https://wttr.in/${encodedCity}?format=j1&lang=zh`)
  
  if (!response.ok) {
    throw new Error('天气API请求失败')
  }

  const data = await response.json()
  const current = data.current_condition[0]
  const today = data.weather[0]

  const temp = parseInt(current.temp_C)
  const humidity = parseInt(current.humidity)
  const condition = mapWttrCondition(current.weatherCode)

  return {
    date: new Date(),
    temperature: {
      min: parseInt(today.mintempC),
      max: parseInt(today.maxtempC),
      current: temp,
    },
    condition,
    humidity,
    gardeningAdvice: generateGardeningAdvice(condition, temp, humidity),
  }
}

export const weatherService = {
  /**
   * 获取当前天气信息
   * @param city 城市名称，默认为北京
   */
  async getCurrentWeather(city: string = 'Beijing'): Promise<WeatherInfo> {
    // 如果配置了OpenWeatherMap且provider为openweather，优先使用
    if (WEATHER_API_CONFIG.provider === 'openweather' && WEATHER_API_CONFIG.openWeatherMap.apiKey) {
      try {
        return await getCurrentWeatherFromOpenWeather(city)
      } catch (error) {
        console.warn('OpenWeatherMap API失败，尝试使用wttr.in:', error)
        // 如果OpenWeatherMap失败，降级到wttr.in
        try {
          return await getCurrentWeatherFromWttr(city)
        } catch (wttrError) {
          console.error('wttr.in API也失败:', wttrError)
          throw error // 抛出原始错误
        }
      }
    }

    // 默认使用wttr.in
    try {
      return await getCurrentWeatherFromWttr(city)
    } catch (error) {
      console.error('获取天气信息失败:', error)
      // 返回模拟数据作为后备
      return {
        date: new Date(),
        temperature: { min: 18, max: 25, current: 22 },
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
    // 限制天数范围
    const forecastDays = Math.min(Math.max(days, 1), 16)

    // 如果配置了OpenWeatherMap且provider为openweather，优先使用
    if (WEATHER_API_CONFIG.provider === 'openweather' && WEATHER_API_CONFIG.openWeatherMap.apiKey) {
      try {
        return await getForecastFromOpenWeather(forecastDays, city)
      } catch (error) {
        console.warn('OpenWeatherMap预报API失败，尝试使用wttr.in:', error)
        // 降级到wttr.in
        try {
          return await getForecastFromWttr(forecastDays, city)
        } catch (wttrError) {
          console.error('wttr.in预报API也失败:', wttrError)
          return []
        }
      }
    }

    // 默认使用wttr.in
    try {
      return await getForecastFromWttr(forecastDays, city)
    } catch (error) {
      console.error('获取天气预报失败:', error)
      return []
    }
  },
}

// OpenWeatherMap预报API实现
async function getForecastFromOpenWeather(days: number, city: string): Promise<WeatherInfo[]> {
  const apiKey = WEATHER_API_CONFIG.openWeatherMap.apiKey
  if (!apiKey) {
    throw new Error('OpenWeatherMap API key未配置')
  }

  const encodedCity = encodeURIComponent(city)
  const url = `${WEATHER_API_CONFIG.openWeatherMap.baseUrl}/forecast?q=${encodedCity}&appid=${apiKey}&units=metric&lang=zh_cn&cnt=${days * 8}` // 每3小时一个数据点

  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`天气预报API请求失败: ${response.status}`)
  }

  const data = await response.json()
  const forecasts: WeatherInfo[] = []
  
  // 按天分组数据
  const dailyData: { [key: string]: any[] } = {}
  
  data.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000)
    const dateKey = date.toISOString().split('T')[0]
    
    if (!dailyData[dateKey]) {
      dailyData[dateKey] = []
    }
    dailyData[dateKey].push(item)
  })

  // 转换为每日预报
  Object.keys(dailyData).slice(0, days).forEach((dateKey) => {
    const dayItems = dailyData[dateKey]
    const temps = dayItems.map((item: any) => item.main.temp)
    const humidities = dayItems.map((item: any) => item.main.humidity)
    const weatherIds = dayItems.map((item: any) => item.weather[0].id)
    
    // 使用最常见的天气条件
    const mostCommonWeather = weatherIds.reduce((a: any, b: any) => 
      weatherIds.filter((v: any) => v === a).length >= weatherIds.filter((v: any) => v === b).length ? a : b
    )
    
    const condition = mapOpenWeatherCondition(mostCommonWeather)
    const avgTemp = Math.round(temps.reduce((a: number, b: number) => a + b, 0) / temps.length)
    const avgHumidity = Math.round(humidities.reduce((a: number, b: number) => a + b, 0) / humidities.length)

    forecasts.push({
      date: new Date(dateKey),
      temperature: {
        min: Math.round(Math.min(...temps)),
        max: Math.round(Math.max(...temps)),
        current: avgTemp,
      },
      condition,
      humidity: avgHumidity,
      gardeningAdvice: generateGardeningAdvice(condition, avgTemp, avgHumidity),
    })
  })

  return forecasts
}

// wttr.in预报API实现
async function getForecastFromWttr(days: number, city: string): Promise<WeatherInfo[]> {
  const encodedCity = encodeURIComponent(city)
  const response = await fetch(`https://wttr.in/${encodedCity}?format=j1&lang=zh`)
  
  if (!response.ok) {
    throw new Error('天气API请求失败')
  }

  const data = await response.json()
  const forecasts: WeatherInfo[] = []

  for (let i = 0; i < Math.min(days, data.weather.length); i++) {
    const day = data.weather[i]
    const condition = mapWttrCondition(day.hourly[0].weatherCode)
    const temp = parseInt(day.hourly[0].tempC)
    
    // 解析日期，wttr.in返回的日期格式为 "2024-12-15"
    const dateStr = day.date
    const date = dateStr ? new Date(dateStr) : new Date(Date.now() + i * 24 * 60 * 60 * 1000)

    forecasts.push({
      date,
      temperature: {
        min: parseInt(day.mintempC),
        max: parseInt(day.maxtempC),
        current: temp,
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
}

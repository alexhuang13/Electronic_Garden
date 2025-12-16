# 天气API配置说明

## 概述

天气系统现在支持两种API服务：

1. **OpenWeatherMap API**（推荐）
   - 功能完整，数据准确
   - 免费版每天1000次调用
   - 需要API key

2. **wttr.in API**（后备方案）
   - 完全免费，无需API key
   - 功能相对简单
   - 作为后备方案自动使用

## 配置步骤

### 方式一：使用OpenWeatherMap API（推荐）

1. **获取API Key**
   - 访问 [OpenWeatherMap官网](https://openweathermap.org/api)
   - 注册免费账号
   - 在控制台创建API key
   - 免费版提供：
     - 当前天气数据
     - 5天/3小时预报
     - 每天1000次调用

2. **配置环境变量**
   - 在项目根目录创建 `.env` 文件
   - 添加以下内容：
   ```env
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   VITE_WEATHER_PROVIDER=openweather
   ```

3. **重启开发服务器**
   ```bash
   npm run dev
   ```

### 方式二：使用wttr.in API（默认）

如果不配置OpenWeatherMap API key，系统会自动使用wttr.in API。

**优点：**
- 无需注册和配置
- 完全免费
- 开箱即用

**缺点：**
- 功能相对简单
- 数据更新频率较低

## 环境变量说明

| 变量名 | 说明 | 默认值 | 必需 |
|--------|------|--------|------|
| `VITE_OPENWEATHER_API_KEY` | OpenWeatherMap API密钥 | - | 使用OpenWeatherMap时必需 |
| `VITE_WEATHER_PROVIDER` | 天气服务提供商 | `wttr` 或 `openweather` | 可选 |

## 功能对比

| 功能 | OpenWeatherMap | wttr.in |
|------|----------------|---------|
| 当前天气 | ✅ | ✅ |
| 天气预报 | ✅ (5天) | ✅ (7天) |
| 实时温度 | ✅ | ✅ |
| 湿度信息 | ✅ | ✅ |
| 天气图标 | ✅ | ✅ |
| 中文支持 | ✅ | ✅ |
| 数据准确性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| API调用限制 | 1000次/天 | 无限制 |

## 故障排查

### 问题1：OpenWeatherMap API返回401错误

**原因：** API key无效或未配置

**解决方案：**
1. 检查 `.env` 文件中的API key是否正确
2. 确认API key在OpenWeatherMap控制台中已激活
3. 检查API key是否有调用限制

### 问题2：找不到城市

**原因：** 城市名称不正确或API不支持该城市

**解决方案：**
1. 尝试使用英文城市名（如：Beijing, Shanghai）
2. 使用城市ID（OpenWeatherMap支持）
3. 检查城市名称拼写

### 问题3：API调用失败，自动降级

**原因：** 主API服务不可用

**解决方案：**
- 系统会自动降级到wttr.in API
- 检查网络连接
- 查看浏览器控制台的错误信息

## 测试API配置

配置完成后，可以通过以下方式测试：

1. 打开浏览器开发者工具（F12）
2. 查看控制台是否有错误
3. 检查天气卡片是否正常显示
4. 尝试切换不同城市名称

## 推荐配置

对于生产环境，建议：

1. 使用OpenWeatherMap API（更稳定、更准确）
2. 配置API key在环境变量中
3. 监控API调用次数，避免超出限制
4. 实现API调用缓存，减少请求次数

## 更多信息

- [OpenWeatherMap API文档](https://openweathermap.org/api)
- [wttr.in API文档](https://github.com/chubin/wttr.in)


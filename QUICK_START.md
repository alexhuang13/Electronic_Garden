# 快速上手指南

## 立即开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 在浏览器中打开 http://localhost:5173
```

## 项目概览

这是一个基于 **React + TypeScript + Vite** 的现代化 Web 应用框架，用于构建电子花园社区管理系统。

### 核心技术栈

- **React 18**: UI 框架
- **TypeScript**: 类型安全
- **Vite**: 快速构建工具
- **React Router**: 路由管理

### 4 个主要页面

1. 🌿 **我的花园** (`/garden`) - 查看花园地图和床位状态
2. 📋 **任务与协作** (`/tasks`) - 管理任务和协作
3. 🏆 **社区与激励** (`/community`) - 积分、排行榜、奖励
4. ⚖️ **治理与台账** (`/governance`) - 提案、财务、培训

## 代码组织方式

### 页面（Pages）

负责决定显示哪些模块，非常轻量。

```typescript
// src/pages/Garden.tsx
export default function Garden() {
  return (
    <div className="page garden-page">
      <Banner type="weather" />
      <PlotCardList />
      <QuickActions actions={['water', 'weed']} />
    </div>
  )
}
```

### 模块（Sections）

**最常修改的地方**，每个模块是一个独立文件夹。

```
sections/
├── banner/              # 顶部横幅
├── plotCardList/        # 床位列表
├── todoList/            # 任务列表
└── quickActions/        # 快捷操作
```

每个模块包含：
- `*.tsx` - 组件文件
- `*.css` - 样式文件
- `use*.ts` - 业务逻辑 Hook

### 数据服务（Services）

负责所有 API 调用。

```typescript
// src/services/plotService.ts
export const plotService = {
  async getPlots(): Promise<Plot[]> { ... },
  async updatePlot(id, data): Promise<Plot> { ... },
}
```

### 业务逻辑（Modules）

不直接关联 UI 的纯逻辑。

```typescript
// src/modules/taskManager.ts
export const taskManager = {
  isOverdue(task: Task): boolean { ... },
  sortTasks(tasks: Task[]): Task[] { ... },
}
```

## 路径别名

使用简洁的导入路径：

```typescript
import { Plot } from '@core/types'
import Garden from '@pages/Garden'
import Banner from '@sections/banner/Banner'
import { plotService } from '@services/plotService'
import { taskManager } from '@modules/taskManager'
import Button from '@components/Button'
```

## 如何添加新功能

### 示例：添加一个"天气预报"模块

1. **创建模块目录**
   ```
   src/sections/weatherForecast/
   ```

2. **创建组件文件** `WeatherForecast.tsx`
   ```typescript
   import { useWeatherForecast } from './useWeatherForecast'
   import './WeatherForecast.css'

   export default function WeatherForecast() {
     const { forecast } = useWeatherForecast()

     return (
       <div className="weather-forecast">
         {/* 你的 UI 代码 */}
       </div>
     )
   }
   ```

3. **创建逻辑 Hook** `useWeatherForecast.ts`
   ```typescript
   import { useState, useEffect } from 'react'
   import { weatherService } from '@services/weatherService'

   export function useWeatherForecast() {
     const [forecast, setForecast] = useState([])

     useEffect(() => {
       weatherService.getWeatherForecast()
         .then(setForecast)
     }, [])

     return { forecast }
   }
   ```

4. **创建样式文件** `WeatherForecast.css`
   ```css
   .weather-forecast {
     /* 你的样式 */
   }
   ```

5. **在页面中使用**
   ```typescript
   // src/pages/Garden.tsx
   import WeatherForecast from '@sections/weatherForecast/WeatherForecast'

   export default function Garden() {
     return (
       <div>
         <WeatherForecast />
         {/* 其他模块 */}
       </div>
     )
   }
   ```

## 环境变量配置

1. 复制 `.env.example` 为 `.env`
2. 修改配置项：
   ```
   VITE_API_BASE_URL=http://your-api-url.com/api
   ```

## 常用命令

```bash
# 开发
npm run dev          # 启动开发服务器

# 构建
npm run build        # 构建生产版本
npm run preview      # 预览生产构建

# 代码检查
npm run lint         # 运行 ESLint
```

## 项目特点

✅ **清晰的代码组织** - 页面、模块、服务、逻辑分离
✅ **TypeScript 类型安全** - 完整的类型定义
✅ **模块化设计** - 功能模块独立，易于维护
✅ **路径别名** - 简洁的导入路径
✅ **可扩展架构** - 新增功能只需添加文件

## 需要帮助？

- 查看 `README.md` 了解项目概述
- 查看 `PROJECT_STRUCTURE.md` 了解详细结构
- 查看 `src/core/types.ts` 了解所有类型定义

开始构建你的电子花园吧！🌱

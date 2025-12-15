# 电子花园项目结构说明

本文档详细说明了项目的完整结构和各个文件的作用。

## 项目整体结构

```
Electronic_Garden/
├── public/              # 静态资源
│   └── vite.svg        # 网站图标
├── src/                # 源代码目录
│   ├── assets/         # 图片、插画、图标等静态资源
│   ├── components/     # 通用 UI 组件
│   ├── core/           # 核心框架代码
│   ├── modules/        # 业务逻辑模块
│   ├── pages/          # 页面组件
│   ├── sections/       # 页面功能模块
│   ├── services/       # 数据服务层
│   ├── styles/         # 全局样式
│   ├── main.tsx        # 应用入口
│   └── vite-env.d.ts   # TypeScript 类型声明
├── .env.example        # 环境变量示例
├── .gitignore          # Git 忽略文件配置
├── index.html          # HTML 入口文件
├── package.json        # 项目依赖配置
├── tsconfig.json       # TypeScript 配置
├── tsconfig.node.json  # Node 环境 TypeScript 配置
├── vite.config.ts      # Vite 构建配置
└── README.md           # 项目说明文档
```

## 详细说明

### 1. 核心配置文件

- **package.json**: 项目依赖和脚本配置
- **tsconfig.json**: TypeScript 编译配置，包含路径别名设置
- **vite.config.ts**: Vite 构建工具配置，包含路径别名解析
- **index.html**: HTML 入口文件，引用 src/main.tsx

### 2. src/ 目录结构

#### 2.1 core/ - 核心框架

负责应用的整体架构和基础设施。

- **App.tsx**: 应用根组件
- **Router.tsx**: 路由配置，定义所有页面路由
- **Layout.tsx**: 主布局组件，包含头部、导航和页脚
- **types.ts**: 全局类型定义（Plot、Task、User 等）

#### 2.2 pages/ - 页面组件

每个文件对应一个主要页面（Tab）。页面组件只负责组织 sections，不包含复杂逻辑。

- **Garden.tsx**: 🌿 我的花园页面
- **Tasks.tsx**: 📋 任务与协作页面
- **Community.tsx**: 🏆 社区与激励页面
- **Governance.tsx**: ⚖️ 治理与台账页面

#### 2.3 sections/ - 功能模块

这是项目中**最重要、最常修改**的目录。每个子目录代表一个可复用的功能模块。

```
sections/
├── banner/              # 顶部横幅模块
│   ├── Banner.tsx       # 组件主文件
│   ├── Banner.css       # 组件样式
│   └── useBanner.ts     # 业务逻辑 Hook
├── plotCardList/        # 床位列表模块
│   ├── PlotCardList.tsx # 列表组件
│   ├── PlotCard.tsx     # 单个卡片组件
│   ├── PlotCardList.css
│   ├── PlotCard.css
│   └── usePlotCardList.ts
├── todoList/            # 任务列表模块
│   ├── TodoList.tsx
│   ├── TodoItem.tsx
│   ├── TodoList.css
│   ├── TodoItem.css
│   └── useTodoList.ts
└── quickActions/        # 快捷操作模块
    ├── QuickActions.tsx
    ├── QuickActions.css
    └── useQuickActions.ts
```

**模块设计原则**:
- 每个模块是一个独立的文件夹
- 包含组件文件 (.tsx)、样式文件 (.css) 和逻辑 Hook (.ts)
- 模块之间低耦合，可独立开发和测试

#### 2.4 components/ - 通用组件

可在多个地方复用的 UI 组件。

- **Navigation.tsx**: 导航栏组件（4 个主标签）
- **Button.tsx**: 通用按钮组件
- **Card.tsx**: 通用卡片组件

#### 2.5 services/ - 数据服务层

负责所有数据获取和 API 调用。

- **api.ts**: API 基础配置和通用请求方法
- **plotService.ts**: 花园床位相关 API
- **taskService.ts**: 任务相关 API
- **userService.ts**: 用户相关 API
- **weatherService.ts**: 天气相关 API

#### 2.6 modules/ - 业务逻辑模块

包含不直接关联 UI 的纯业务逻辑。

- **plotManager.ts**: 床位管理逻辑（健康度计算、优先级排序等）
- **taskManager.ts**: 任务管理逻辑（逾期判断、任务排序等）
- **pointsCalculator.ts**: 积分计算逻辑
- **dateFormatter.ts**: 日期格式化工具

#### 2.7 styles/ - 全局样式

- **index.css**: 全局样式、CSS 变量、重置样式
- **layout.css**: 布局相关样式
- **pages.css**: 页面通用样式

## 路径别名配置

项目配置了以下路径别名，可以更简洁地导入模块：

```typescript
import App from '@core/App'
import Garden from '@pages/Garden'
import Banner from '@sections/banner/Banner'
import { plotService } from '@services/plotService'
import { taskManager } from '@modules/taskManager'
import Button from '@components/Button'
```

## 开发流程

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 构建生产版本

```bash
npm run build
```

### 4. 预览生产构建

```bash
npm run preview
```

## 如何添加新功能

### 添加新的功能模块（Section）

1. 在 `src/sections/` 下创建新文件夹，如 `myFeature/`
2. 创建主组件文件 `MyFeature.tsx`
3. 创建样式文件 `MyFeature.css`
4. 创建业务逻辑 Hook `useMyFeature.ts`
5. 在需要的页面中导入并使用

### 添加新的 API 服务

1. 在 `src/services/` 下创建新文件，如 `myService.ts`
2. 使用 `apiService` 封装 API 调用
3. 在需要的地方导入使用

### 添加新的业务逻辑模块

1. 在 `src/modules/` 下创建新文件，如 `myLogic.ts`
2. 导出包含业务逻辑的对象或函数
3. 在组件或 Hook 中导入使用

## 设计原则

1. **关注点分离**: 页面、模块、业务逻辑、数据服务各司其职
2. **可扩展性**: 新增功能尽量只添加文件，不修改已有文件
3. **模块化**: 每个功能模块独立，便于维护和测试
4. **类型安全**: 使用 TypeScript 确保类型安全
5. **代码复用**: 通用组件和工具函数集中管理

## 下一步

目前框架已经搭建完成，包括：

✅ 4 个主要页面的基础结构
✅ 4 个示例功能模块（banner、plotCardList、todoList、quickActions）
✅ 完整的类型定义系统
✅ 服务层架构
✅ 业务逻辑模块
✅ 通用组件库

接下来可以：

1. 实现后端 API 服务
2. 完善各个功能模块的详细逻辑
3. 添加更多功能模块（社区、治理相关）
4. 实现用户认证和授权
5. 添加状态管理（如需要）
6. 优化移动端体验
7. 添加单元测试

项目采用渐进式开发策略，可以逐步完善各个功能模块。

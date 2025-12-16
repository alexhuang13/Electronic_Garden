/**
 * 核心类型定义
 * 这里定义项目中使用的通用类型和接口
 */

// ========== 通用类型 ==========

export type ID = string | number

export interface BaseEntity {
  id: ID
  createdAt?: Date
  updatedAt?: Date
}

// ========== 花园相关类型 ==========

export interface Plot extends BaseEntity {
  name: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  crops: Crop[]
  status: PlotStatus
  assignedTo?: ID // 负责人 ID
  assignedToName?: string // 负责人名称
  // 土地情况
  soilCondition?: {
    fertility: number // 肥力 0-100
    droughtLevel: number // 干旱程度 0-100 (0=湿润, 100=极度干旱)
  }
  // 负责人详细信息（用于显示）
  responsiblePerson?: {
    id: ID
    name: string
    level: number
    badges: Badge[]
    avatar?: string
  }
}

export type PlotStatus = 'empty' | 'planted' | 'growing' | 'ready' | 'needsWater' | 'needsFertilizer' | 'needsWeeding' | 'needsCare'

export interface Crop extends BaseEntity {
  name: string
  plantedDate: Date
  expectedHarvestDate: Date
  growthProgress: number // 0-100
  waterLevel: number // 0-100
  healthStatus: CropHealthStatus
}

export type CropHealthStatus = 'healthy' | 'needsWater' | 'needsFertilizer' | 'pest' | 'disease'

// ========== 任务相关类型 ==========

export interface Task extends BaseEntity {
  title: string
  description: string
  type: TaskType
  priority: TaskPriority
  status: TaskStatus
  assignedTo?: ID
  dueDate?: Date
  relatedPlotId?: ID
  completedAt?: Date
  reward?: number // 任务奖励（星星）
}

export type TaskType = 'watering' | 'weeding' | 'fertilizing' | 'harvesting' | 'maintenance' | 'other'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export type TaskStatus = 'pending' | 'inProgress' | 'completed' | 'overdue' | 'needsHelp'

export interface Shift extends BaseEntity {
  date: Date
  timeSlot: string
  assignedTo: ID
  tasks: ID[] // Task IDs
  status: ShiftStatus
}

export type ShiftStatus = 'upcoming' | 'current' | 'completed' | 'missed'

// ========== 用户相关类型 ==========

export interface User extends BaseEntity {
  name: string
  avatar?: string
  email: string
  role: UserRole
  points: number
  level: number
  joinDate: Date
  badges: Badge[]
}

export type UserRole = 'admin' | 'member' | 'volunteer' | 'guest'

export interface Badge extends BaseEntity {
  name: string
  icon: string
  description: string
  earnedDate: Date
}

// ========== 社区相关类型 ==========

export interface Leaderboard {
  period: 'week' | 'month' | 'allTime'
  entries: LeaderboardEntry[]
}

export interface LeaderboardEntry {
  rank: number
  userId: ID
  userName: string
  avatar?: string
  points: number
  level: number
}

export interface Reward extends BaseEntity {
  name: string
  description: string
  icon: string
  cost: number // 积分成本
  category: RewardCategory
  available: boolean
}

export type RewardCategory = 'tool' | 'seed' | 'decoration' | 'privilege' | 'gift'

// ========== 治理相关类型 ==========

// 公告栏条目类型
export type BulletinItemType = 'announcement' | 'proposal'

// 公告接口
export interface Announcement extends BaseEntity {
  title: string
  content: string
  publishedBy: ID
  publishedByName?: string
  type: 'announcement'
  priority?: 'normal' | 'important' | 'urgent' // 优先级
  isPinned?: boolean // 是否置顶
}

// 提案接口（保留原有功能）
export interface Proposal extends BaseEntity {
  title: string
  description: string
  proposedBy: ID
  category: ProposalCategory
  status: ProposalStatus
  votingDeadline: Date
  votes: Vote[]
  requiredVotes: number
  type: 'proposal'
}

export type ProposalCategory = 'rule' | 'budget' | 'event' | 'improvement' | 'other'

export type ProposalStatus = 'draft' | 'voting' | 'approved' | 'rejected' | 'implemented'

export interface Vote {
  userId: ID
  choice: 'approve' | 'reject' | 'abstain'
  votedAt: Date
  comment?: string
}

// 公告栏条目联合类型
export type BulletinItem = Announcement | Proposal

export interface FinancialRecord extends BaseEntity {
  date: Date
  type: 'income' | 'expense'
  category: string
  amount: number
  description: string
  approvedBy?: ID
}

export interface Training extends BaseEntity {
  title: string
  description: string
  instructor: ID
  date: Date
  capacity: number
  enrolled: ID[]
  status: TrainingStatus
  certification?: string
}

export type TrainingStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled'

// ========== 经验分享相关类型 ==========

export interface ExperienceShare extends BaseEntity {
  title: string
  content: string
  authorId: ID
  authorName: string
  comments: Comment[]
  likes?: number
}

export interface Comment extends BaseEntity {
  experienceId: ID
  userId: ID
  userName: string
  content: string
  replyTo?: ID // 回复的评论ID
}

// ========== 通知类型 ==========

export interface Notification extends BaseEntity {
  userId: ID
  type: NotificationType
  title: string
  message: string
  read: boolean
  link?: string
}

export type NotificationType = 'task' | 'announcement' | 'achievement' | 'reminder' | 'system'

// ========== 天气和建议 ==========

export interface WeatherInfo {
  date: Date
  temperature: { min: number; max: number; current?: number }
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy'
  humidity: number
  gardeningAdvice: string
}

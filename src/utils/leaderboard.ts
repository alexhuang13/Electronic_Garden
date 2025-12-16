/**
 * 排行榜工具函数
 * 用于获取排行榜数据
 */

export interface LeaderboardEntry {
  rank: number
  name: string
  level: number
  points: number
  isCurrentUser: boolean
}

/**
 * 获取排行榜数据（按等级排序）
 */
export function getLeaderboardByLevel(): LeaderboardEntry[] {
  // 获取当前用户数据
  const currentUserPoints = parseInt(localStorage.getItem('profilePoints') || '2420', 10)
  const currentUserLevel = parseInt(localStorage.getItem('profileLevel') || '5', 10)

  // 模拟其他用户数据
  const mockUsers: LeaderboardEntry[] = [
    { rank: 0, name: '花园守护者', level: currentUserLevel, points: currentUserPoints, isCurrentUser: true },
    { rank: 0, name: '绿手指', level: 8, points: 3500, isCurrentUser: false },
    { rank: 0, name: '植物专家', level: 7, points: 3200, isCurrentUser: false },
    { rank: 0, name: '园艺大师', level: 6, points: 2800, isCurrentUser: false },
    { rank: 0, name: '新手园丁', level: 4, points: 1800, isCurrentUser: false },
    { rank: 0, name: '勤劳小蜜蜂', level: 5, points: 2200, isCurrentUser: false },
    { rank: 0, name: '刘浩然', level: 9, points: 4200, isCurrentUser: false },
    { rank: 0, name: '花园新手', level: 3, points: 1200, isCurrentUser: false },
  ]

  // 按等级排序（等级相同时按星星排序）
  const sorted = [...mockUsers].sort((a, b) => {
    if (b.level !== a.level) {
      return b.level - a.level
    }
    return b.points - a.points
  })

  // 设置排名
  return sorted.map((user, index) => ({
    ...user,
    rank: index + 1,
  }))
}

/**
 * 获取排行榜前三名
 */
export function getTopThreeUsers(): LeaderboardEntry[] {
  const leaderboard = getLeaderboardByLevel()
  return leaderboard.slice(0, 3)
}


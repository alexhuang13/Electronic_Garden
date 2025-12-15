import { useState, useEffect } from 'react'
import './Leaderboard.css'

/**
 * 排行榜组件
 * 显示等级和星星数量的排名
 */

interface LeaderboardEntry {
  rank: number
  name: string
  level: number
  points: number
  isCurrentUser: boolean
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [sortBy, setSortBy] = useState<'level' | 'points'>('level')

  useEffect(() => {
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

    // 根据排序方式排序
    const sorted = [...mockUsers].sort((a, b) => {
      if (sortBy === 'level') {
        if (b.level !== a.level) {
          return b.level - a.level
        }
        return b.points - a.points // 等级相同时按星星排序
      } else {
        if (b.points !== a.points) {
          return b.points - a.points
        }
        return b.level - a.level // 星星相同时按等级排序
      }
    })

    // 设置排名
    const ranked = sorted.map((user, index) => ({
      ...user,
      rank: index + 1,
    }))

    setLeaderboard(ranked)
  }, [sortBy])

  // 监听积分和等级变化
  useEffect(() => {
    const handleUpdate = () => {
      const currentUserPoints = parseInt(localStorage.getItem('profilePoints') || '2420', 10)
      const currentUserLevel = parseInt(localStorage.getItem('profileLevel') || '5', 10)
      
      setLeaderboard(prev => {
        const updated = prev.map(user => 
          user.isCurrentUser 
            ? { ...user, level: currentUserLevel, points: currentUserPoints }
            : user
        )
        
        // 重新排序
        const sorted = [...updated].sort((a, b) => {
          if (sortBy === 'level') {
            if (b.level !== a.level) {
              return b.level - a.level
            }
            return b.points - a.points
          } else {
            if (b.points !== a.points) {
              return b.points - a.points
            }
            return b.level - a.level
          }
        })

        return sorted.map((user, index) => ({
          ...user,
          rank: index + 1,
        }))
      })
    }

    window.addEventListener('pointsUpdated', handleUpdate as EventListener)
    return () => {
      window.removeEventListener('pointsUpdated', handleUpdate as EventListener)
    }
  }, [sortBy])

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h3 className="leaderboard-title">排行榜</h3>
        <div className="leaderboard-sort">
          <button
            className={`leaderboard-sort-btn ${sortBy === 'level' ? 'active' : ''}`}
            onClick={() => setSortBy('level')}
          >
            按等级
          </button>
          <button
            className={`leaderboard-sort-btn ${sortBy === 'points' ? 'active' : ''}`}
            onClick={() => setSortBy('points')}
          >
            按星星
          </button>
        </div>
      </div>

      <div className="leaderboard-list">
        {leaderboard.map((entry) => (
          <div
            key={entry.name}
            className={`leaderboard-item ${entry.isCurrentUser ? 'leaderboard-item-current' : ''}`}
          >
            <div className="leaderboard-rank">
              {entry.rank <= 3 ? (
                <span className="leaderboard-rank-medal">
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                </span>
              ) : (
                <span className="leaderboard-rank-number">{entry.rank}</span>
              )}
            </div>

            <div className="leaderboard-info">
              <div className="leaderboard-name">
                {entry.name}
                {entry.isCurrentUser && <span className="leaderboard-you">（我）</span>}
              </div>
              <div className="leaderboard-stats">
                <span className="leaderboard-stat">
                  <span className="leaderboard-stat-label">等级：</span>
                  <span className="leaderboard-stat-value">Lv.{entry.level}</span>
                </span>
                <span className="leaderboard-stat leaderboard-stat-stars">
                  <span className="leaderboard-stat-label">星星：</span>
                  <span className="leaderboard-stat-value">⭐ {entry.points.toLocaleString()}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


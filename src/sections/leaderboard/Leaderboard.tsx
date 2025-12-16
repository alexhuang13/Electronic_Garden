import { useState, useEffect } from 'react'
import { getLeaderboardByLevel } from '../../utils/leaderboard'
import type { LeaderboardEntry } from '../../utils/leaderboard'
import './Leaderboard.css'

/**
 * 排行榜组件
 * 显示等级和星星数量的排名
 */

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [sortBy, setSortBy] = useState<'level' | 'points'>('level')

  useEffect(() => {
    // 使用工具函数获取排行榜数据
    let ranked: LeaderboardEntry[] = []
    
    if (sortBy === 'level') {
      ranked = getLeaderboardByLevel()
    } else {
      // 按星星排序
      const allUsers = getLeaderboardByLevel()
      const sorted = [...allUsers].sort((a, b) => {
        if (b.points !== a.points) {
          return b.points - a.points
        }
        return b.level - a.level
      })
      ranked = sorted.map((user, index) => ({
        ...user,
        rank: index + 1,
      }))
    }

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


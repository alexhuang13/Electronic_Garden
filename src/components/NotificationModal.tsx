import { useEffect, useState } from 'react'
import './NotificationModal.css'

export interface RewardInfo {
  stars?: number
  exp?: number
  badge?: {
    name: string
    icon: string
  }
  levelUp?: {
    level: number
    title: string
  }
}

interface NotificationModalProps {
  type: 'success' | 'reward' | 'info' | 'error' | 'warning'
  title?: string
  message: string
  reward?: RewardInfo
  onClose: () => void
  autoClose?: number // 自动关闭时间（毫秒），0 表示不自动关闭
}

export default function NotificationModal({
  type,
  title,
  message,
  reward,
  onClose,
  autoClose = 3000,
}: NotificationModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // 触发进入动画
    setTimeout(() => setIsVisible(true), 10)
    
    // 自动关闭
    if (autoClose > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, autoClose)
      return () => clearTimeout(timer)
    }
  }, [autoClose])

  const handleClose = () => {
    setIsAnimating(true)
    setTimeout(() => {
      onClose()
    }, 300) // 等待退出动画完成
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅'
      case 'reward':
        return '🎉'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return '✨'
    }
  }

  const getTypeClass = () => {
    return `notification-modal-${type}`
  }

  return (
    <div 
      className={`notification-modal-overlay ${isVisible && !isAnimating ? 'visible' : ''} ${isAnimating ? 'closing' : ''}`}
      onClick={handleClose}
    >
      <div 
        className={`notification-modal ${getTypeClass()} ${isVisible && !isAnimating ? 'visible' : ''} ${isAnimating ? 'closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 装饰性背景元素 */}
        <div className="notification-modal-bg-decoration"></div>
        
        {/* 主要内容 */}
        <div className="notification-modal-content">
          {/* 图标 */}
          <div className="notification-modal-icon">
            <span className="notification-icon-emoji">{getIcon()}</span>
            {type === 'reward' && (
              <div className="notification-sparkles">
                <span className="sparkle sparkle-1">✨</span>
                <span className="sparkle sparkle-2">⭐</span>
                <span className="sparkle sparkle-3">💫</span>
                <span className="sparkle sparkle-4">🌟</span>
              </div>
            )}
          </div>

          {/* 标题 - 如果没有传入title，使用默认标题 */}
          <h3 className="notification-modal-title">
            {title || (type === 'reward' ? '🎉 恭喜获得奖励！' : type === 'success' ? '✅ 操作成功' : type === 'error' ? '❌ 操作失败' : type === 'warning' ? '⚠️ 温馨提示' : 'ℹ️ 提示信息')}
          </h3>

          {/* 消息 */}
          <p className="notification-modal-message">{message}</p>

          {/* 奖励信息 */}
          {reward && (
            <div className="notification-rewards">
              {/* 徽章 */}
              {reward.badge && (
                <div className="notification-badge-item">
                  <div className="badge-icon-large">{reward.badge.icon}</div>
                  <div className="badge-info">
                    <div className="badge-label">获得新徽章</div>
                    <div className="badge-name">{reward.badge.name}</div>
                  </div>
                </div>
              )}

              {/* 星星和经验 */}
              {(reward.stars !== undefined || reward.exp !== undefined) && (
                <div className="notification-reward-items">
                  {reward.stars !== undefined && (
                    <div className="reward-item">
                      <span className="reward-icon">⭐</span>
                      <span className="reward-value">{reward.stars}</span>
                    </div>
                  )}
                  {reward.exp !== undefined && (
                    <div className="reward-item">
                      <span className="reward-icon">⚡</span>
                      <span className="reward-value">{reward.exp} EXP</span>
                    </div>
                  )}
                </div>
              )}

              {/* 升级提示 */}
              {reward.levelUp && (
                <div className="notification-levelup">
                  <div className="levelup-icon">🎊</div>
                  <div className="levelup-content">
                    <div className="levelup-label">恭喜升级！</div>
                    <div className="levelup-info">
                      <span className="levelup-level">Lv.{reward.levelUp.level}</span>
                      <span className="levelup-title">{reward.levelUp.title}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 关闭按钮 */}
          <button 
            className="notification-modal-close-btn"
            onClick={handleClose}
          >
            确定
          </button>
        </div>
      </div>
    </div>
  )
}


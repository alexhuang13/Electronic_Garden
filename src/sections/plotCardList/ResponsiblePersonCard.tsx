import { Plot, Badge } from '@core/types'
import { getAllBadges } from '@modules/badgeManager'
import './ResponsiblePersonCard.css'

interface ResponsiblePersonCardProps {
  plot: Plot
}

/**
 * 负责人信息卡片
 * 显示负责人的等级和徽章
 */
export default function ResponsiblePersonCard({ plot }: ResponsiblePersonCardProps) {
  const currentUserId = 'currentUser'
  const currentUserName = localStorage.getItem('profileName') || '花园守护者'
  const currentUserLevel = parseInt(localStorage.getItem('profileLevel') || '5', 10)
  
  // 判断是否是当前用户负责的地块
  const isCurrentUserResponsible = plot.assignedTo === currentUserId
  
  // 如果是当前用户负责，使用当前用户信息；否则使用地块的负责人信息
  let responsiblePerson = plot.responsiblePerson
  
  if (isCurrentUserResponsible) {
    // 获取当前用户的徽章
    const allBadges = getAllBadges()
    const currentUserBadges = allBadges
      .filter(badge => badge.earned)
      .map(badge => {
        // badgeManager 中的 Badge 使用 earnedDate?: string
        // 但 core/types 中的 Badge 使用 earnedDate: Date
        const earnedDate = badge.earnedDate 
          ? (typeof badge.earnedDate === 'string' ? new Date(badge.earnedDate) : badge.earnedDate)
          : new Date()
        return {
          id: badge.id,
          name: badge.name,
          icon: badge.icon,
          description: badge.description,
          earned: badge.earned,
          earnedDate: earnedDate,
        } as Badge
      })
    
    // 使用当前用户信息
    responsiblePerson = {
      id: currentUserId,
      name: currentUserName,
      level: currentUserLevel,
      badges: currentUserBadges,
      avatar: undefined,
    }
  }
  
  // 如果仍然没有负责人信息，提前返回
  if (!responsiblePerson) {
    return (
      <div className="responsible-person-card empty">
        <div className="responsible-card-header">
          <span className="responsible-card-icon">👤</span>
          <h4 className="responsible-card-title">负责人信息</h4>
        </div>
        <div className="responsible-empty">
          <span className="responsible-empty-icon">👤</span>
          <span className="responsible-empty-text">暂无负责人</span>
        </div>
      </div>
    )
  }

  // 获取等级显示信息
  const getLevelInfo = (level: number) => {
    if (level >= 20) return { label: '大师', color: '#dc2626', icon: '👑' }
    if (level >= 15) return { label: '专家', color: '#f59e0b', icon: '⭐' }
    if (level >= 10) return { label: '高级', color: '#10b981', icon: '🌟' }
    if (level >= 5) return { label: '中级', color: '#3b82f6', icon: '🌱' }
    return { label: '初级', color: '#6b7280', icon: '🌿' }
  }

  const levelInfo = getLevelInfo(responsiblePerson.level)
  const badges = responsiblePerson.badges || []

  return (
    <div className="responsible-person-card">
      <div className="responsible-card-header">
        <span className="responsible-card-icon">👤</span>
        <h4 className="responsible-card-title">负责人信息</h4>
      </div>

      <div className="responsible-card-content">
        {/* 负责人基本信息 */}
        <div className="responsible-person-info">
          {responsiblePerson.avatar ? (
            <img
              src={responsiblePerson.avatar}
              alt={responsiblePerson.name}
              className="responsible-avatar"
            />
          ) : (
            <div className="responsible-avatar-placeholder">
              {responsiblePerson.name.charAt(0)}
            </div>
          )}
          <div className="responsible-name-section">
            <div className="responsible-name">{responsiblePerson.name}</div>
            <div className="responsible-level-badge" style={{ backgroundColor: levelInfo.color }}>
              <span className="responsible-level-icon">{levelInfo.icon}</span>
              <span className="responsible-level-text">
                Lv.{responsiblePerson.level} {levelInfo.label}
              </span>
            </div>
          </div>
        </div>

        {/* 徽章展示 */}
        {badges.length > 0 ? (
          <div className="responsible-badges-section">
            <div className="responsible-badges-title">徽章 ({badges.length})</div>
            <div className="responsible-badges-list">
              {badges.slice(0, 6).map((badge: Badge) => (
                <div key={badge.id} className="responsible-badge-item" title={badge.description}>
                  <span className="responsible-badge-icon">{badge.icon}</span>
                  <span className="responsible-badge-name">{badge.name}</span>
                </div>
              ))}
              {badges.length > 6 && (
                <div className="responsible-badge-more">+{badges.length - 6}</div>
              )}
            </div>
          </div>
        ) : (
          <div className="responsible-no-badges">
            <span className="responsible-no-badges-icon">🏅</span>
            <span className="responsible-no-badges-text">暂无徽章</span>
          </div>
        )}
      </div>
    </div>
  )
}


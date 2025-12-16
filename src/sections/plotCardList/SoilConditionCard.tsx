import { Plot, ID } from '@core/types'
import './SoilConditionCard.css'

interface SoilConditionCardProps {
  plot: Plot
  onSoilAction?: (plotId: ID, action: 'water' | 'fertilize' | 'weed') => void
}

/**
 * 土地情况卡片
 * 显示肥力和干旱情况
 */
export default function SoilConditionCard({ plot, onSoilAction }: SoilConditionCardProps) {
  const fertility = plot.soilCondition?.fertility ?? 50
  const droughtLevel = plot.soilCondition?.droughtLevel ?? 50

  // 获取肥力等级
  const getFertilityLevel = (value: number) => {
    if (value >= 80) return { label: '肥沃', color: '#10b981', icon: '🌿' }
    if (value >= 60) return { label: '良好', color: '#84cc16', icon: '🌱' }
    if (value >= 40) return { label: '一般', color: '#f59e0b', icon: '🌾' }
    if (value >= 20) return { label: '贫瘠', color: '#ef4444', icon: '🍂' }
    return { label: '极贫', color: '#dc2626', icon: '💀' }
  }

  // 获取干旱等级
  const getDroughtLevel = (value: number) => {
    if (value >= 80) return { label: '极度干旱', color: '#dc2626', icon: '🔥' }
    if (value >= 60) return { label: '干旱', color: '#f59e0b', icon: '☀️' }
    if (value >= 40) return { label: '偏干', color: '#fbbf24', icon: '🌤️' }
    if (value >= 20) return { label: '湿润', color: '#60a5fa', icon: '💧' }
    return { label: '很湿润', color: '#3b82f6', icon: '🌊' }
  }

  const fertilityInfo = getFertilityLevel(fertility)
  const droughtInfo = getDroughtLevel(droughtLevel)

  return (
    <div className="soil-condition-card">
      <div className="soil-card-header">
        <span className="soil-card-icon">🌍</span>
        <h4 className="soil-card-title">土地情况</h4>
      </div>

      <div className="soil-card-content">
        {/* 肥力 */}
        <div className="soil-item">
          <div className="soil-item-header">
            <span className="soil-item-icon">{fertilityInfo.icon}</span>
            <span className="soil-item-label">肥力</span>
            <span className="soil-item-value" style={{ color: fertilityInfo.color }}>
              {fertilityInfo.label}
            </span>
          </div>
          <div className="soil-progress-bar">
            <div
              className="soil-progress-fill"
              style={{
                width: `${fertility}%`,
                backgroundColor: fertilityInfo.color,
              }}
            />
          </div>
          <div className="soil-progress-text">{fertility}%</div>
        </div>

        {/* 干旱情况 */}
        <div className="soil-item">
          <div className="soil-item-header">
            <span className="soil-item-icon">{droughtInfo.icon}</span>
            <span className="soil-item-label">干旱程度</span>
            <span className="soil-item-value" style={{ color: droughtInfo.color }}>
              {droughtInfo.label}
            </span>
          </div>
          <div className="soil-progress-bar">
            <div
              className="soil-progress-fill"
              style={{
                width: `${droughtLevel}%`,
                backgroundColor: droughtInfo.color,
              }}
            />
          </div>
          <div className="soil-progress-text">{droughtLevel}%</div>
        </div>

        {/* 操作按钮 */}
        {onSoilAction && (
          <div className="soil-actions">
            <button
              className="soil-action-btn soil-action-water"
              onClick={() => onSoilAction(plot.id, 'water')}
              title="浇水：降低干旱程度，增加植物水分"
            >
              💧 浇水
            </button>
            <button
              className="soil-action-btn soil-action-fertilize"
              onClick={() => onSoilAction(plot.id, 'fertilize')}
              title="施肥：增加土地肥力"
            >
              🌿 施肥
            </button>
            <button
              className="soil-action-btn soil-action-weed"
              onClick={() => onSoilAction(plot.id, 'weed')}
              title="除草：清除杂草"
            >
              🌱 除草
            </button>
          </div>
        )}
      </div>
    </div>
  )
}


import { Plot } from '@core/types'
import './PlotCard.css'

/**
 * 单个床位卡片组件
 */

interface PlotCardProps {
  plot: Plot
  onClick: () => void
}

export default function PlotCard({ plot, onClick }: PlotCardProps) {
  const getStatusEmoji = (status: Plot['status']) => {
    const emojiMap = {
      empty: '🌱',
      planted: '🌿',
      growing: '🌾',
      ready: '🌻',
      needsWater: '💧',
      needsCare: '🔧',
    }
    return emojiMap[status] || '🌱'
  }

  const getStatusText = (status: Plot['status']) => {
    const textMap = {
      empty: '空闲',
      planted: '已种植',
      growing: '生长中',
      ready: '可收获',
      needsWater: '需要浇水',
      needsCare: '需要照料',
    }
    return textMap[status] || '未知'
  }

  return (
    <div
      className={`plot-card plot-card-${plot.status}`}
      onClick={onClick}
    >
      <div className="plot-card-header">
        <span className="plot-card-emoji">{getStatusEmoji(plot.status)}</span>
        <h3 className="plot-card-name">{plot.name}</h3>
      </div>

      <div className="plot-card-body">
        <p className="plot-card-status">{getStatusText(plot.status)}</p>
        {plot.crops.length > 0 && (
          <div className="plot-card-crops">
            {plot.crops.map((crop) => (
              <div key={crop.id} className="crop-info">
                <span className="crop-name">{crop.name}</span>
                <div className="crop-progress">
                  <div
                    className="crop-progress-bar"
                    style={{ width: `${crop.growthProgress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

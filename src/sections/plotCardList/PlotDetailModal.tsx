import { Plot } from '@core/types'
import SoilConditionCard from './SoilConditionCard'
import PlantStatusCard from './PlantStatusCard'
import ResponsiblePersonCard from './ResponsiblePersonCard'
import './PlotDetailModal.css'

interface PlotDetailModalProps {
  plot: Plot | null
  onClose: () => void
}

/**
 * 地块详情模态框
 * 显示土地情况、植物情况和负责人信息三张卡片
 */
export default function PlotDetailModal({ plot, onClose }: PlotDetailModalProps) {
  if (!plot) return null

  const getStatusEmoji = (status: Plot['status']) => {
    const emojiMap = {
      empty: '🌱',
      planted: '🌿',
      growing: '🌾',
      ready: '🌻',
      needsWater: '💧',
      needsFertilizer: '🌿',
      needsWeeding: '🌱',
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
      needsFertilizer: '需要施肥',
      needsWeeding: '需要除草',
      needsCare: '需要照料',
    }
    return textMap[status] || '未知'
  }

  return (
    <div className="plot-detail-modal-overlay" onClick={onClose}>
      <div className="plot-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* 模态框头部 */}
        <div className="plot-detail-modal-header">
          <div className="plot-detail-modal-title-section">
            <span className="plot-detail-modal-emoji">{getStatusEmoji(plot.status)}</span>
            <div>
              <h2 className="plot-detail-modal-title">{plot.name}</h2>
              <p className="plot-detail-modal-status">{getStatusText(plot.status)}</p>
            </div>
          </div>
          <button className="plot-detail-modal-close" onClick={onClose} title="关闭">
            ✕
          </button>
        </div>

        {/* 三张详细信息卡片 */}
        <div className="plot-detail-modal-content">
          <SoilConditionCard plot={plot} />
          <PlantStatusCard plot={plot} />
          <ResponsiblePersonCard plot={plot} />
        </div>
      </div>
    </div>
  )
}


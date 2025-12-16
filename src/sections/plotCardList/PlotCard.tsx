import { useState } from 'react'
import { Plot, ID } from '@core/types'
import EditPlotForm from './EditPlotForm'
import PlotDetailModal from './PlotDetailModal'
import './PlotCard.css'

/**
 * 单个地块卡片组件
 */

interface PlotCardProps {
  plot: Plot
  onClick: () => void
  onApplyResponsibility?: () => void
  onEdit?: (plotId: number, data: { cropName: string; status: Plot['status'] }) => void
  onSoilAction?: (plotId: ID, action: 'water' | 'fertilize' | 'weed') => void
  showEditButton?: boolean
}

export default function PlotCard({ plot, onClick, onApplyResponsibility, onEdit, onSoilAction, showEditButton = false }: PlotCardProps) {
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const currentUserId = 'currentUser'
  
  // 获取负责人名称
  const getResponsiblePersonName = () => {
    if (!plot.assignedTo) return null
    // 如果是当前用户，显示"我"
    if (plot.assignedTo === currentUserId) {
      return '我'
    }
    // 返回存储的负责人名称
    return plot.assignedToName || '其他用户'
  }

  const responsiblePersonName = getResponsiblePersonName()
  const isCurrentUserResponsible = plot.assignedTo === currentUserId
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

  const handleEditSubmit = (data: { cropName: string; status: Plot['status'] }) => {
    if (onEdit) {
      onEdit(plot.id as number, data)
    }
    setShowEditForm(false)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // 如果点击的是编辑按钮或申请负责按钮，不打开详情模态框
    if ((e.target as HTMLElement).closest('.plot-edit-btn, .plot-apply-responsible-btn')) {
      return
    }
    setShowDetailModal(true)
    onClick()
  }

  return (
    <>
      <div
        className={`plot-card plot-card-${plot.status}`}
        onClick={handleCardClick}
      >
        <div className="plot-card-header">
          <span className="plot-card-emoji">{getStatusEmoji(plot.status)}</span>
          <h3 className="plot-card-name">{plot.name}</h3>
          {showEditButton && isCurrentUserResponsible && (
            <button
              className="plot-edit-btn"
              onClick={(e) => {
                e.stopPropagation()
                setShowEditForm(true)
              }}
              title="编辑地块"
            >
              编辑
            </button>
          )}
        </div>

        <div className="plot-card-body">
          <p className="plot-card-status">{getStatusText(plot.status)}</p>
          
          {/* 负责人信息 */}
          <div className="plot-card-responsible">
            {responsiblePersonName ? (
              <div className="plot-responsible-info">
                <span className="plot-responsible-label">负责人：</span>
                <span className="plot-responsible-name">{responsiblePersonName}</span>
              </div>
            ) : (
              <div className="plot-responsible-empty">
                <span className="plot-responsible-label">负责人：</span>
                <span className="plot-responsible-none">暂无</span>
                {onApplyResponsibility && (
                  <button
                    className="plot-apply-responsible-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      onApplyResponsibility()
                    }}
                    title="申请负责需要2000⭐"
                  >
                    申请负责 (2000⭐)
                  </button>
                )}
              </div>
            )}
          </div>

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

      {/* 地块详情模态框 */}
      {showDetailModal && (
        <PlotDetailModal
          plot={plot}
          onClose={() => setShowDetailModal(false)}
          onSoilAction={onSoilAction}
        />
      )}

      {showEditForm && (
        <EditPlotForm
          plot={plot}
          onClose={() => setShowEditForm(false)}
          onSubmit={handleEditSubmit}
        />
      )}
    </>
  )
}

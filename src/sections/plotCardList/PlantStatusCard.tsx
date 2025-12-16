import { Plot, CropHealthStatus } from '@core/types'
import './PlantStatusCard.css'

interface PlantStatusCardProps {
  plot: Plot
}

/**
 * 植物情况卡片
 * 显示植物特点和五种健康状态
 */
export default function PlantStatusCard({ plot }: PlantStatusCardProps) {
  const crops = plot.crops || []
  const hasPlants = crops.length > 0

  // 五种植物状态
  const healthStatuses: CropHealthStatus[] = [
    'healthy',
    'needsWater',
    'needsFertilizer',
    'pest',
    'disease',
  ]

  const statusConfig: Record<CropHealthStatus, { label: string; icon: string; color: string }> = {
    healthy: { label: '健康', icon: '✅', color: '#10b981' },
    needsWater: { label: '需浇水', icon: '💧', color: '#3b82f6' },
    needsFertilizer: { label: '需施肥', icon: '🌿', color: '#f59e0b' },
    pest: { label: '有虫害', icon: '🐛', color: '#ef4444' },
    disease: { label: '有病害', icon: '🦠', color: '#dc2626' },
  }

  // 获取所有作物的健康状态
  const getCropHealthStatuses = () => {
    if (!hasPlants) return []
    
    const statuses = new Set<CropHealthStatus>()
    crops.forEach((crop) => {
      statuses.add(crop.healthStatus)
    })
    return Array.from(statuses)
  }

  const activeStatuses = getCropHealthStatuses()

  return (
    <div className="plant-status-card">
      <div className="plant-card-header">
        <span className="plant-card-icon">🌱</span>
        <h4 className="plant-card-title">植物情况</h4>
      </div>

      <div className="plant-card-content">
        {hasPlants ? (
          <>
            {/* 植物特点 */}
            <div className="plant-features">
              {crops.map((crop) => (
                <div key={crop.id} className="plant-feature-item">
                  <span className="plant-feature-name">{crop.name}</span>
                  <div className="plant-growth-info">
                    <span className="plant-growth-label">生长进度：</span>
                    <div className="plant-growth-bar">
                      <div
                        className="plant-growth-fill"
                        style={{ width: `${crop.growthProgress}%` }}
                      />
                    </div>
                    <span className="plant-growth-percent">{crop.growthProgress}%</span>
                  </div>
                  <div className="plant-water-info">
                    <span className="plant-water-label">水分：</span>
                    <div className="plant-water-bar">
                      <div
                        className="plant-water-fill"
                        style={{
                          width: `${crop.waterLevel}%`,
                          backgroundColor: crop.waterLevel < 30 ? '#ef4444' : crop.waterLevel < 60 ? '#f59e0b' : '#10b981',
                        }}
                      />
                    </div>
                    <span className="plant-water-percent">{crop.waterLevel}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 五种状态指示器 */}
            <div className="plant-status-indicators">
              <div className="plant-status-title">健康状态：</div>
              <div className="plant-status-list">
                {healthStatuses.map((status) => {
                  const config = statusConfig[status]
                  const isActive = activeStatuses.includes(status)
                  return (
                    <div
                      key={status}
                      className={`plant-status-item ${isActive ? 'active' : 'inactive'}`}
                      style={{
                        backgroundColor: isActive ? config.color : '#f3f4f6',
                        color: isActive ? 'white' : '#9ca3af',
                        borderColor: isActive ? config.color : '#e5e7eb',
                      }}
                    >
                      <span className="plant-status-icon">{config.icon}</span>
                      <span className="plant-status-label">{config.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="plant-empty">
            <span className="plant-empty-icon">🌱</span>
            <span className="plant-empty-text">暂无植物</span>
          </div>
        )}
      </div>
    </div>
  )
}


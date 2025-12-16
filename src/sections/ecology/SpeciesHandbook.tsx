import React, { useState } from 'react'
import Card from '@components/Card'
import { checkLittleDarwin } from '@modules/badgeManager'
import './SpeciesHandbook.css'

/**
 * 生物图鉴组件
 * 显示所有生物，已收集的会点亮
 */

interface Species {
  id: string
  name: string
  icon: string
  category: 'insect' | 'bird' | 'plant' | 'animal' | 'other'
  description: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  discoveredDate?: Date
  photo?: string // 照片（base64 格式）
}

interface DiscoveredSpeciesData {
  id: string
  discoveredDate: string
  photo?: string
}

// 默认生物列表
const defaultSpecies: Species[] = [
  { id: 'butterfly', name: '蝴蝶', icon: '🦋', category: 'insect', description: '美丽的蝴蝶，常见于花园中', rarity: 'common' },
  { id: 'bee', name: '蜜蜂', icon: '🐝', category: 'insect', description: '勤劳的蜜蜂，帮助植物授粉', rarity: 'common' },
  { id: 'ladybug', name: '瓢虫', icon: '🐞', category: 'insect', description: '可爱的瓢虫，花园的守护者', rarity: 'common' },
  { id: 'sparrow', name: '麻雀', icon: '🐦', category: 'bird', description: '活泼的小鸟，常在花园觅食', rarity: 'common' },
  { id: 'robin', name: '知更鸟', icon: '🐦', category: 'bird', description: '美丽的知更鸟，歌声动听', rarity: 'rare' },
  { id: 'sunflower', name: '向日葵', icon: '🌻', category: 'plant', description: '向阳而生的向日葵', rarity: 'common' },
  { id: 'rose', name: '玫瑰', icon: '🌹', category: 'plant', description: '优雅的玫瑰花', rarity: 'common' },
  { id: 'tulip', name: '郁金香', icon: '🌷', category: 'plant', description: '多彩的郁金香', rarity: 'rare' },
  { id: 'cat', name: '猫咪', icon: '🐱', category: 'animal', description: '可爱的小猫咪', rarity: 'rare' },
  { id: 'rabbit', name: '兔子', icon: '🐰', category: 'animal', description: '活泼的小兔子', rarity: 'rare' },
  { id: 'dragonfly', name: '蜻蜓', icon: '🦟', category: 'insect', description: '优雅的蜻蜓', rarity: 'common' },
  { id: 'hummingbird', name: '蜂鸟', icon: '🐦', category: 'bird', description: '小巧的蜂鸟，飞行速度极快', rarity: 'epic' },
]

export default function SpeciesHandbook() {
  // 从localStorage加载已收集的生物数据
  const loadDiscoveredSpecies = (): Record<string, DiscoveredSpeciesData> => {
    const saved = localStorage.getItem('discoveredSpeciesData')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return {}
      }
    }
    return {}
  }

  const [discoveredSpeciesData, setDiscoveredSpeciesData] = useState<Record<string, DiscoveredSpeciesData>>(loadDiscoveredSpecies())
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null)
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)
  const [speciesToUpload, setSpeciesToUpload] = useState<Species | null>(null)
  const [uploadedPhoto, setUploadedPhoto] = useState<string>('')

  // 保存已收集的生物数据
  const saveDiscoveredSpecies = (data: Record<string, DiscoveredSpeciesData>) => {
    localStorage.setItem('discoveredSpeciesData', JSON.stringify(data))
  }

  // 获取已收集的生物ID列表
  const discoveredIds = Object.keys(discoveredSpeciesData)

  // 处理照片上传
  const handlePhotoUpload = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setUploadedPhoto(base64String)
    }
    reader.readAsDataURL(file)
  }

  // 确认上传照片并记录生物
  const handleConfirmPhoto = () => {
    if (!speciesToUpload || !uploadedPhoto) {
      alert('请先上传照片！')
      return
    }

    // 记录新生物
    const newData = {
      ...discoveredSpeciesData,
      [speciesToUpload.id]: {
        id: speciesToUpload.id,
        discoveredDate: new Date().toISOString(),
        photo: uploadedPhoto,
      },
    }
    setDiscoveredSpeciesData(newData)
    saveDiscoveredSpecies(newData)

    // 更新生物的发现日期和照片
    const updatedSpecies = {
      ...speciesToUpload,
      discoveredDate: new Date(),
      photo: uploadedPhoto,
    }
    setSelectedSpecies(updatedSpecies)

    // 生态记录奖励：50星星和10EXP
    const rewardStars = 50
    const rewardExp = 10

    // 获取当前数据
    const currentPoints = parseInt(localStorage.getItem('profilePoints') || '2420', 10)
    const currentLevel = parseInt(localStorage.getItem('profileLevel') || '5', 10)
    const currentExp = parseInt(localStorage.getItem('profileCurrentExp') || '320', 10)
    const maxExp = 500

    // 计算新的积分和经验值
    const newPoints = currentPoints + rewardStars
    let newCurrentExp = currentExp + rewardExp
    let newLevel = currentLevel
    let levelUp = false

    // 检查是否升级（经验值达到500）
    if (newCurrentExp >= maxExp) {
      newLevel += 1
      newCurrentExp = newCurrentExp - maxExp // 保留超出部分
      levelUp = true
    }

    // 保存到localStorage
    localStorage.setItem('profilePoints', newPoints.toString())
    localStorage.setItem('profileLevel', newLevel.toString())
    localStorage.setItem('profileCurrentExp', newCurrentExp.toString())

    // 触发自定义事件，通知其他组件更新
    window.dispatchEvent(new CustomEvent('pointsUpdated', { 
      detail: { newPoints, newLevel, newCurrentExp, levelUp } 
    }))

    // 检查小达尔文徽章（发现三种生物）
    const badge = checkLittleDarwin()

    // 关闭上传表单
    setShowPhotoUpload(false)
    setSpeciesToUpload(null)
    setUploadedPhoto('')

    // 显示发现提示和奖励信息
    let rewardMessage = `🎉 发现新生物：${speciesToUpload.name}！\n${speciesToUpload.description}\n\n✨ 获得奖励：${rewardStars}星星 + ${rewardExp}EXP`
    if (levelUp) {
      rewardMessage += `\n🎊 恭喜升级！当前等级：Lv.${newLevel}`
    }
    if (badge) {
      rewardMessage += `\n\n🎉 获得新徽章：${badge.name} ${badge.icon}\n✨ 徽章奖励：500⭐ + 50EXP`
    }
    alert(rewardMessage)
  }

  // 取消上传
  const handleCancelUpload = () => {
    setShowPhotoUpload(false)
    setSpeciesToUpload(null)
    setUploadedPhoto('')
  }

  // 拍照/记录生物
  const handlePhotograph = (species: Species) => {
    if (discoveredIds.includes(species.id)) {
      // 如果已经收集过，显示详情（包含照片）
      const speciesData = discoveredSpeciesData[species.id]
      const speciesWithData = {
        ...species,
        discoveredDate: new Date(speciesData.discoveredDate),
        photo: speciesData.photo,
      }
      setSelectedSpecies(speciesWithData)
      return
    }

    // 如果是新生物，要求上传照片
    setSpeciesToUpload(species)
    setShowPhotoUpload(true)
  }

  // 获取稀有度颜色
  const getRarityColor = (rarity: Species['rarity']) => {
    const colorMap = {
      common: '#6b7280',
      rare: '#3b82f6',
      epic: '#8b5cf6',
      legendary: '#f59e0b',
    }
    return colorMap[rarity]
  }

  // 获取稀有度文本
  const getRarityText = (rarity: Species['rarity']) => {
    const textMap = {
      common: '普通',
      rare: '稀有',
      epic: '史诗',
      legendary: '传说',
    }
    return textMap[rarity]
  }

  // 按类别分组
  const groupedSpecies = defaultSpecies.reduce((acc, species) => {
    if (!acc[species.category]) {
      acc[species.category] = []
    }
    acc[species.category].push(species)
    return acc
  }, {} as Record<string, Species[]>)

  const categoryNames: Record<string, string> = {
    insect: '昆虫',
    bird: '鸟类',
    plant: '植物',
    animal: '动物',
    other: '其他',
  }

  return (
    <div className="species-handbook">
      <div className="species-handbook-stats">
        <div className="species-stat-item">
          <div className="species-stat-number">{discoveredIds.length}</div>
          <div className="species-stat-label">已收集</div>
        </div>
        <div className="species-stat-item">
          <div className="species-stat-number">{defaultSpecies.length}</div>
          <div className="species-stat-label">总数</div>
        </div>
        <div className="species-stat-item">
          <div className="species-stat-number">
            {Math.round((discoveredIds.length / defaultSpecies.length) * 100)}%
          </div>
          <div className="species-stat-label">完成度</div>
        </div>
      </div>

      {Object.entries(groupedSpecies).map(([category, speciesList]) => (
        <div key={category} className="species-category">
          <h3 className="species-category-title">{categoryNames[category] || category}</h3>
          <div className="species-grid">
            {speciesList.map((species) => {
              const isDiscovered = discoveredIds.includes(species.id)
              return (
                <Card
                  key={species.id}
                  className={`species-card ${isDiscovered ? 'species-discovered' : 'species-undiscovered'}`}
                  onClick={() => handlePhotograph(species)}
                >
                  <div className="species-card-content">
                    <div className={`species-icon ${isDiscovered ? '' : 'species-icon-gray'}`}>
                      {species.icon}
                    </div>
                    <div className="species-name">{species.name}</div>
                    <div 
                      className="species-rarity"
                      style={{ color: getRarityColor(species.rarity) }}
                    >
                      {getRarityText(species.rarity)}
                    </div>
                    {isDiscovered && discoveredSpeciesData[species.id]?.discoveredDate && (
                      <div className="species-date">
                        {new Date(discoveredSpeciesData[species.id].discoveredDate).toLocaleDateString('zh-CN')}
                      </div>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      ))}

      {/* 照片上传弹窗 */}
      {showPhotoUpload && speciesToUpload && (
        <div className="species-detail-overlay" onClick={handleCancelUpload}>
          <Card className="species-photo-upload-modal" onClick={(e?: React.MouseEvent<HTMLDivElement>) => e?.stopPropagation()}>
            <div className="species-photo-upload-header">
              <h3 className="species-photo-upload-title">上传照片记录</h3>
              <button 
                className="species-detail-close"
                onClick={handleCancelUpload}
              >
                ×
              </button>
            </div>
            <div className="species-photo-upload-content">
              <div className="species-photo-upload-info">
                <div className="species-photo-upload-icon">{speciesToUpload.icon}</div>
                <div>
                  <h4>{speciesToUpload.name}</h4>
                  <p className="species-photo-upload-description">{speciesToUpload.description}</p>
                </div>
              </div>
              
              <div className="species-photo-upload-area">
                {uploadedPhoto ? (
                  <div className="species-photo-preview">
                    <img src={uploadedPhoto} alt="预览" />
                    <button 
                      className="species-photo-remove"
                      onClick={() => setUploadedPhoto('')}
                    >
                      重新选择
                    </button>
                  </div>
                ) : (
                  <label className="species-photo-upload-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handlePhotoUpload(file)
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                    <div className="species-photo-upload-placeholder">
                      <div className="species-photo-upload-icon-large">📷</div>
                      <p>点击选择照片</p>
                      <p className="species-photo-upload-hint">支持 JPG、PNG 等格式</p>
                    </div>
                  </label>
                )}
              </div>

              <div className="species-photo-upload-actions">
                <button 
                  className="species-photo-upload-cancel"
                  onClick={handleCancelUpload}
                >
                  取消
                </button>
                <button 
                  className="species-photo-upload-confirm"
                  onClick={handleConfirmPhoto}
                  disabled={!uploadedPhoto}
                >
                  确认记录
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 生物详情弹窗 */}
      {selectedSpecies && !showPhotoUpload && (
        <div className="species-detail-overlay" onClick={() => setSelectedSpecies(null)}>
          <Card className="species-detail-modal" onClick={(e?: React.MouseEvent<HTMLDivElement>) => e?.stopPropagation()}>
            <div className="species-detail-header">
              <div className="species-detail-icon">{selectedSpecies.icon}</div>
              <div className="species-detail-info">
                <h3 className="species-detail-name">{selectedSpecies.name}</h3>
                <div 
                  className="species-detail-rarity"
                  style={{ color: getRarityColor(selectedSpecies.rarity) }}
                >
                  {getRarityText(selectedSpecies.rarity)}
                </div>
              </div>
              <button 
                className="species-detail-close"
                onClick={() => setSelectedSpecies(null)}
              >
                ×
              </button>
            </div>
            <div className="species-detail-content">
              {selectedSpecies.photo && (
                <div className="species-detail-photo">
                  <img src={selectedSpecies.photo} alt={selectedSpecies.name} />
                </div>
              )}
              <p className="species-detail-description">{selectedSpecies.description}</p>
              {selectedSpecies.discoveredDate && (
                <div className="species-detail-date">
                  <span>发现时间：</span>
                  <span>{new Date(selectedSpecies.discoveredDate).toLocaleString('zh-CN')}</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}


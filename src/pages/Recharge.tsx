import { useState } from 'react'
import Card from '@components/Card'
import '@styles/pages.css'
import './Recharge.css'

/**
 * 💰 充值中心页面
 *
 * 功能：
 * - 显示充值档位
 * - 充值获得星星奖励
 */

export default function Recharge() {
  // 充值档位配置
  const rechargeTiers = [
    { id: 1, price: 6, stars: 60 },
    { id: 2, price: 30, stars: 300 },
    { id: 3, price: 68, stars: 680 },
    { id: 4, price: 128, stars: 1280 },
    { id: 5, price: 328, stars: 3280 },
    { id: 6, price: 648, stars: 6480 },
  ]

  const [selectedTier, setSelectedTier] = useState<number | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  // 处理充值
  const handleRecharge = (tier: typeof rechargeTiers[0]) => {
    // 获取当前积分
    const currentPoints = parseInt(localStorage.getItem('profilePoints') || '2420', 10)
    const newPoints = currentPoints + tier.stars

    // 更新积分
    localStorage.setItem('profilePoints', newPoints.toString())

    // 显示成功提示
    setSelectedTier(tier.id)
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setSelectedTier(null)
    }, 2000)

    // 触发自定义事件，通知其他组件积分已更新
    window.dispatchEvent(new CustomEvent('pointsUpdated', { 
      detail: { newPoints } 
    }))
  }

  return (
    <div className="page recharge-page">
      <section className="page-section">
        <h2 className="section-title">充值中心</h2>
        <p className="recharge-description">选择充值档位，获得对应数量的星星奖励</p>
        
        <div className="recharge-grid">
          {rechargeTiers.map((tier) => (
            <Card 
              key={tier.id} 
              className={`recharge-card ${selectedTier === tier.id ? 'recharge-card-selected' : ''}`}
              onClick={() => handleRecharge(tier)}
            >
              <div className="recharge-card-content">
                <div className="recharge-price">
                  <span className="recharge-price-symbol">¥</span>
                  <span className="recharge-price-value">{tier.price}</span>
                </div>
                <div className="recharge-divider"></div>
                <div className="recharge-reward">
                  <span className="recharge-stars-icon">⭐</span>
                  <span className="recharge-stars-value">{tier.stars.toLocaleString()}</span>
                  <span className="recharge-stars-label">星星</span>
                </div>
                {showSuccess && selectedTier === tier.id && (
                  <div className="recharge-success-overlay">
                    <div className="recharge-success-message">充值成功！</div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}


import { useState } from 'react'
import Card from '@components/Card'
import { addRechargeAmount } from '@modules/badgeManager'
import '@styles/pages.css'
import './Recharge.css'

/**
 * 💰 商城页面
 *
 * 功能：
 * - 显示商品档位
 * - 购买获得星星奖励
 * - 购买改名卡
 */

export default function Recharge() {
  // 商品档位配置
  const rechargeTiers = [
    { id: 1, price: 6, stars: 60 },
    { id: 2, price: 30, stars: 300 },
    { id: 3, price: 68, stars: 680 },
    { id: 4, price: 128, stars: 1280 },
    { id: 5, price: 328, stars: 3280 },
    { id: 6, price: 648, stars: 6480 },
  ]

  // 道具商品配置
  const shopItems = [
    { id: 'seed', name: '种子包', icon: '🌱', cost: 50 },
    { id: 'fertilizer', name: '肥料包', icon: '🌿', cost: 50 },
    { id: 'coffee', name: '咖啡兑换券', icon: '☕', cost: 50 },
    { id: 'fountain', name: '花园装饰-小喷泉', icon: '⛲', cost: 100 },
    { id: 'bench', name: '花园装饰-长椅', icon: '🪑', cost: 150 },
    { id: 'watering_upgrade', name: '浇水工具升级', icon: '🔧', cost: 80 },
  ]

  const [selectedTier, setSelectedTier] = useState<number | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showNameCardSuccess, setShowNameCardSuccess] = useState(false)
  const [showItemSuccess, setShowItemSuccess] = useState<string | null>(null)

  // 处理购买
  const handleRecharge = (tier: typeof rechargeTiers[0]) => {
    // 获取当前积分
    const currentPoints = parseInt(localStorage.getItem('profilePoints') || '2420', 10)
    const newPoints = currentPoints + tier.stars

    // 更新积分
    localStorage.setItem('profilePoints', newPoints.toString())

    // 检查并授予充值相关徽章（tier.price 是人民币金额）
    const badge = addRechargeAmount(tier.price)

    // 显示成功提示
    setSelectedTier(tier.id)
    setShowSuccess(true)
    
    // 如果有新徽章，显示徽章提示
    if (badge) {
      setTimeout(() => {
        alert(`🎉 获得新徽章：${badge.name} ${badge.icon}\n✨ 徽章奖励：500⭐ + 50EXP`)
      }, 500)
    }
    
    setTimeout(() => {
      setShowSuccess(false)
      setSelectedTier(null)
    }, 2000)

    // 触发自定义事件，通知其他组件积分已更新
    window.dispatchEvent(new CustomEvent('pointsUpdated', { 
      detail: { newPoints } 
    }))
  }

  // 处理购买改名卡
  const handleBuyNameCard = () => {
    const currentPoints = parseInt(localStorage.getItem('profilePoints') || '2420', 10)
    const nameCardCost = 50

    if (currentPoints < nameCardCost) {
      alert(`星星不足！当前：${currentPoints}⭐，需要：${nameCardCost}⭐`)
      return
    }

    // 扣除星星
    const newPoints = currentPoints - nameCardCost
    localStorage.setItem('profilePoints', newPoints.toString())

    // 获取当前改名卡数量
    const currentNameCards = parseInt(localStorage.getItem('nameCards') || '0', 10)
    const newNameCards = currentNameCards + 1
    localStorage.setItem('nameCards', newNameCards.toString())

    // 显示成功提示
    setShowNameCardSuccess(true)
    setTimeout(() => {
      setShowNameCardSuccess(false)
    }, 2000)

    // 触发自定义事件，通知其他组件积分已更新
    window.dispatchEvent(new CustomEvent('pointsUpdated', { 
      detail: { newPoints } 
    }))
    
    // 触发改名卡更新事件
    window.dispatchEvent(new CustomEvent('nameCardsUpdated'))
    
    // 触发背包更新事件（改名卡也在背包中）
    window.dispatchEvent(new CustomEvent('inventoryUpdated'))
  }

  // 处理购买道具商品
  const handleBuyItem = (item: typeof shopItems[0]) => {
    const currentPoints = parseInt(localStorage.getItem('profilePoints') || '2420', 10)

    if (currentPoints < item.cost) {
      alert(`星星不足！当前：${currentPoints}⭐，需要：${item.cost}⭐`)
      return
    }

    // 扣除星星
    const newPoints = currentPoints - item.cost
    localStorage.setItem('profilePoints', newPoints.toString())

    // 获取当前道具数量
    const currentCount = parseInt(localStorage.getItem(`shopItem_${item.id}`) || '0', 10)
    const newCount = currentCount + 1
    localStorage.setItem(`shopItem_${item.id}`, newCount.toString())

    // 显示成功提示
    setShowItemSuccess(item.id)
    setTimeout(() => {
      setShowItemSuccess(null)
    }, 2000)

    // 触发自定义事件，通知其他组件积分已更新
    window.dispatchEvent(new CustomEvent('pointsUpdated', { 
      detail: { newPoints } 
    }))
    
    // 触发背包更新事件
    window.dispatchEvent(new CustomEvent('inventoryUpdated'))
  }

  return (
    <div className="page recharge-page">
      <section className="page-section">
        <h2 className="section-title">商城</h2>
        <p className="recharge-description">选择商品档位，获得对应数量的星星奖励</p>
        
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
                    <div className="recharge-success-message">购买成功！</div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="page-section">
        <h2 className="section-title">道具商店</h2>
        <div className="recharge-grid">
          <Card 
            className={`recharge-card recharge-card-item ${showNameCardSuccess ? 'recharge-card-selected' : ''}`}
            onClick={handleBuyNameCard}
          >
            <div className="recharge-card-content">
              <div className="recharge-item-icon">✏️</div>
              <div className="recharge-item-name">改名卡</div>
              <div className="recharge-divider"></div>
              <div className="recharge-reward">
                <span className="recharge-stars-icon">⭐</span>
                <span className="recharge-stars-value">50</span>
                <span className="recharge-stars-label">星星</span>
              </div>
              {showNameCardSuccess && (
                <div className="recharge-success-overlay">
                  <div className="recharge-success-message">购买成功！</div>
                </div>
              )}
            </div>
          </Card>

          {shopItems.map((item) => (
            <Card 
              key={item.id}
              className={`recharge-card recharge-card-item ${showItemSuccess === item.id ? 'recharge-card-selected' : ''}`}
              onClick={() => handleBuyItem(item)}
            >
              <div className="recharge-card-content">
                <div className="recharge-item-icon">{item.icon}</div>
                <div className="recharge-item-name">{item.name}</div>
                <div className="recharge-divider"></div>
                <div className="recharge-reward">
                  <span className="recharge-stars-icon">⭐</span>
                  <span className="recharge-stars-value">{item.cost}</span>
                  <span className="recharge-stars-label">星星</span>
                </div>
                {showItemSuccess === item.id && (
                  <div className="recharge-success-overlay">
                    <div className="recharge-success-message">购买成功！</div>
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


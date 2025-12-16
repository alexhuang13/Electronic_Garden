import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '@components/Card'
import InventoryItem from '@sections/inventory/InventoryItem'
import FriendSelectModal from '@sections/inventory/FriendSelectModal'
import { getAllBadges, incrementGiftCount } from '@modules/badgeManager'
import '@styles/pages.css'
import './Profile.css'

/**
 * 👤 个人中心页面
 *
 * 功能：
 * - 用户信息卡片（头像、等级、积分、经验值）
 * - 统计数据（完成任务、分享经验次数、发布提案次数、连续打卡）
 * - 我的徽章
 * - 每日签到功能
 */

export default function Profile() {
  const navigate = useNavigate()

  // 获取今天的日期字符串（用于检查是否已签到）
  const getTodayString = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  // 从localStorage获取签到状态
  const getCheckInStatus = () => {
    const lastCheckInDate = localStorage.getItem('lastCheckInDate')
    return lastCheckInDate === getTodayString()
  }

  // 初始数据
  const initialData = {
    name: '花园守护者',
    title: '高级园丁',
    joinDate: '2024-01-01',
    level: 5,
    currentExp: 320,
    maxExp: 500,
    points: 2420,
    completedTasks: 42,
    experienceShareTimes: 0,
    proposalTimes: 0,
    checkInDays: 129,
    badges: getAllBadges(),
  }

  // 从localStorage加载数据，如果没有则使用初始数据
  const loadData = () => {
    const savedPoints = localStorage.getItem('profilePoints')
    const savedCheckInDays = localStorage.getItem('profileCheckInDays')
    const savedLevel = localStorage.getItem('profileLevel')
    const savedCurrentExp = localStorage.getItem('profileCurrentExp')
    const savedCompletedTasks = localStorage.getItem('profileCompletedTasks')
    const savedExperienceShareTimes = localStorage.getItem('profileExperienceShareTimes')
    const savedProposalTimes = localStorage.getItem('profileProposalTimes')
    const savedName = localStorage.getItem('profileName')
    return {
      ...initialData,
      name: savedName || initialData.name,
      points: savedPoints ? parseInt(savedPoints, 10) : initialData.points,
      checkInDays: savedCheckInDays ? parseInt(savedCheckInDays, 10) : initialData.checkInDays,
      level: savedLevel ? parseInt(savedLevel, 10) : initialData.level,
      currentExp: savedCurrentExp ? parseInt(savedCurrentExp, 10) : initialData.currentExp,
      completedTasks: savedCompletedTasks ? parseInt(savedCompletedTasks, 10) : initialData.completedTasks,
      experienceShareTimes: savedExperienceShareTimes ? parseInt(savedExperienceShareTimes, 10) : initialData.experienceShareTimes,
      proposalTimes: savedProposalTimes ? parseInt(savedProposalTimes, 10) : initialData.proposalTimes,
    }
  }

  const [profileData, setProfileData] = useState(loadData())
  const [isCheckedIn, setIsCheckedIn] = useState(getCheckInStatus())
  const [showCheckInSuccess, setShowCheckInSuccess] = useState(false)
  const [levelUpMessage, setLevelUpMessage] = useState('')
  const [nameCards, setNameCards] = useState(() => parseInt(localStorage.getItem('nameCards') || '0', 10))
  const [location, setLocation] = useState(() => localStorage.getItem('userLocation') || '北京')
  const [badges, setBadges] = useState(() => getAllBadges())
  
  // 获取我的地块数量
  const getMyPlotsCount = (): number => {
    const savedPlots = localStorage.getItem('gardenPlots')
    if (!savedPlots) return 0
    try {
      const plots = JSON.parse(savedPlots)
      const currentUserId = 'currentUser'
      return plots.filter((plot: any) => plot.assignedTo === currentUserId).length
    } catch (e) {
      return 0
    }
  }
  
  // 初始化信誉积分（如果不存在则设为100）
  const initializeReputation = () => {
    const savedReputation = localStorage.getItem('userReputation')
    if (savedReputation === null) {
      localStorage.setItem('userReputation', '100')
      return 100
    }
    return parseInt(savedReputation, 10)
  }
  
  const [myPlotsCount, setMyPlotsCount] = useState(() => getMyPlotsCount())
  const [reputation, setReputation] = useState(() => initializeReputation())
  
  // 背包物品数据
  const [inventory, setInventory] = useState(() => ({
    seed: parseInt(localStorage.getItem('shopItem_seed') || '0', 10),
    fertilizer: parseInt(localStorage.getItem('shopItem_fertilizer') || '0', 10),
    coffee: parseInt(localStorage.getItem('shopItem_coffee') || '0', 10),
    fountain: parseInt(localStorage.getItem('shopItem_fountain') || '0', 10),
    bench: parseInt(localStorage.getItem('shopItem_bench') || '0', 10),
    watering_upgrade: parseInt(localStorage.getItem('shopItem_watering_upgrade') || '0', 10),
    nameCard: parseInt(localStorage.getItem('nameCards') || '0', 10),
  }))
  
  // 好友选择弹窗状态
  const [showFriendSelect, setShowFriendSelect] = useState(false)
  const [giftingItem, setGiftingItem] = useState<{ id: string; name: string } | null>(null)

  // 监听积分和经验值更新事件（充值后或完成任务后）
  useEffect(() => {
    const handlePointsUpdate = (event: CustomEvent) => {
      const { newPoints, newLevel, newCurrentExp, levelUp } = event.detail || {}
      
      if (newPoints !== undefined || newLevel !== undefined || newCurrentExp !== undefined) {
        setProfileData(prev => ({
          ...prev,
          ...(newPoints !== undefined && { points: newPoints }),
          ...(newLevel !== undefined && { level: newLevel }),
          ...(newCurrentExp !== undefined && { currentExp: newCurrentExp }),
        }))

        // 如果升级了，显示升级提示
        if (levelUp && newLevel !== undefined) {
          setLevelUpMessage(`恭喜升级！Lv.${newLevel}`)
          setTimeout(() => {
            setLevelUpMessage('')
          }, 3000)
        }
      }

      // 更新完成任务次数
      const savedCompletedTasks = localStorage.getItem('profileCompletedTasks')
      if (savedCompletedTasks) {
        setProfileData(prev => ({
          ...prev,
          completedTasks: parseInt(savedCompletedTasks, 10),
        }))
      }

      // 更新分享经验次数
      const savedExperienceShareTimes = localStorage.getItem('profileExperienceShareTimes')
      if (savedExperienceShareTimes) {
        setProfileData(prev => ({
          ...prev,
          experienceShareTimes: parseInt(savedExperienceShareTimes, 10),
        }))
      }

      // 更新发布提案次数
      const savedProposalTimes = localStorage.getItem('profileProposalTimes')
      if (savedProposalTimes) {
        setProfileData(prev => ({
          ...prev,
          proposalTimes: parseInt(savedProposalTimes, 10),
        }))
      }
    }

    // 监听自定义事件
    window.addEventListener('pointsUpdated', handlePointsUpdate as EventListener)
    
    // 监听分享经验次数更新事件
    const handleExperienceShareTimesUpdate = (event: CustomEvent) => {
      const { newExperienceShareTimes } = event.detail || {}
      if (newExperienceShareTimes !== undefined) {
        setProfileData(prev => ({
          ...prev,
          experienceShareTimes: newExperienceShareTimes,
        }))
      }
    }
    window.addEventListener('experienceShareTimesUpdated', handleExperienceShareTimesUpdate as EventListener)

    // 监听发布提案次数更新事件
    const handleProposalTimesUpdate = (event: CustomEvent) => {
      const { newProposalTimes } = event.detail || {}
      if (newProposalTimes !== undefined) {
        setProfileData(prev => ({
          ...prev,
          proposalTimes: newProposalTimes,
        }))
      }
    }
    window.addEventListener('proposalTimesUpdated', handleProposalTimesUpdate as EventListener)

    // 监听徽章更新事件
    const handleBadgeUpdate = () => {
      setBadges(getAllBadges())
    }
    window.addEventListener('badgeUpdated', handleBadgeUpdate as EventListener)
    
    // 监听storage事件（跨标签页）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'profilePoints' && e.newValue) {
        setProfileData(prev => ({
          ...prev,
          points: parseInt(e.newValue || '0', 10),
        }))
      }
      if (e.key === 'profileLevel' && e.newValue) {
        setProfileData(prev => ({
          ...prev,
          level: parseInt(e.newValue || '5', 10),
        }))
      }
      if (e.key === 'profileCurrentExp' && e.newValue) {
        setProfileData(prev => ({
          ...prev,
          currentExp: parseInt(e.newValue || '0', 10),
        }))
      }
      if (e.key === 'profileCompletedTasks' && e.newValue) {
        setProfileData(prev => ({
          ...prev,
          completedTasks: parseInt(e.newValue || '0', 10),
        }))
      }
      if (e.key === 'profileExperienceShareTimes' && e.newValue) {
        setProfileData(prev => ({
          ...prev,
          experienceShareTimes: parseInt(e.newValue || '0', 10),
        }))
      }
      if (e.key === 'profileProposalTimes' && e.newValue) {
        setProfileData(prev => ({
          ...prev,
          proposalTimes: parseInt(e.newValue || '0', 10),
        }))
      }
      if (e.key === 'gardenPlots') {
        setMyPlotsCount(getMyPlotsCount())
      }
      if (e.key === 'userReputation' && e.newValue) {
        setReputation(parseInt(e.newValue || '100', 10))
      }
    }
    window.addEventListener('storage', handleStorageChange)

    // 监听改名卡更新
    const handleNameCardsUpdate = () => {
      const savedNameCards = localStorage.getItem('nameCards')
      if (savedNameCards) {
        setNameCards(parseInt(savedNameCards, 10))
      }
    }
    window.addEventListener('nameCardsUpdated', handleNameCardsUpdate as EventListener)
    
    // 监听背包更新事件
    const handleInventoryUpdate = () => {
      setInventory({
        seed: parseInt(localStorage.getItem('shopItem_seed') || '0', 10),
        fertilizer: parseInt(localStorage.getItem('shopItem_fertilizer') || '0', 10),
        coffee: parseInt(localStorage.getItem('shopItem_coffee') || '0', 10),
        fountain: parseInt(localStorage.getItem('shopItem_fountain') || '0', 10),
        bench: parseInt(localStorage.getItem('shopItem_bench') || '0', 10),
        watering_upgrade: parseInt(localStorage.getItem('shopItem_watering_upgrade') || '0', 10),
        nameCard: parseInt(localStorage.getItem('nameCards') || '0', 10),
      })
    }
    window.addEventListener('inventoryUpdated', handleInventoryUpdate as EventListener)
    
    // 监听改名卡更新事件（更新背包中的改名卡数量）
    const handleNameCardsUpdateForInventory = () => {
      setInventory(prev => ({
        ...prev,
        nameCard: parseInt(localStorage.getItem('nameCards') || '0', 10),
      }))
    }
    window.addEventListener('nameCardsUpdated', handleNameCardsUpdateForInventory as EventListener)
    
    // 监听地块更新事件
    const handlePlotUpdate = () => {
      setMyPlotsCount(getMyPlotsCount())
    }
    window.addEventListener('plotUpdated', handlePlotUpdate as EventListener)

    return () => {
      window.removeEventListener('pointsUpdated', handlePointsUpdate as EventListener)
      window.removeEventListener('experienceShareTimesUpdated', handleExperienceShareTimesUpdate as EventListener)
      window.removeEventListener('proposalTimesUpdated', handleProposalTimesUpdate as EventListener)
      window.removeEventListener('badgeUpdated', handleBadgeUpdate as EventListener)
      window.removeEventListener('nameCardsUpdated', handleNameCardsUpdate as EventListener)
      window.removeEventListener('inventoryUpdated', handleInventoryUpdate as EventListener)
      window.removeEventListener('nameCardsUpdated', handleNameCardsUpdateForInventory as EventListener)
      window.removeEventListener('plotUpdated', handlePlotUpdate as EventListener)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // 签到处理函数
  const handleCheckIn = () => {
    if (isCheckedIn) {
      alert('今天已经签到过了，明天再来吧！')
      return
    }

    // 更新积分和打卡天数
    const newPoints = profileData.points + 10
    const newCheckInDays = profileData.checkInDays + 1
    
    // 更新经验值
    let newCurrentExp = profileData.currentExp + 10
    let newLevel = profileData.level
    let levelUpText = ''

    // 检查是否升级（经验值达到500）
    if (newCurrentExp >= profileData.maxExp) {
      newLevel += 1
      newCurrentExp = newCurrentExp - profileData.maxExp // 保留超出部分
      levelUpText = `恭喜升级！Lv.${newLevel}`
      setLevelUpMessage(levelUpText)
      // 3秒后清除升级提示
      setTimeout(() => {
        setLevelUpMessage('')
      }, 3000)
    }

    setProfileData({
      ...profileData,
      points: newPoints,
      checkInDays: newCheckInDays,
      level: newLevel,
      currentExp: newCurrentExp,
    })

    // 保存到localStorage
    localStorage.setItem('profilePoints', newPoints.toString())
    localStorage.setItem('profileCheckInDays', newCheckInDays.toString())
    localStorage.setItem('profileLevel', newLevel.toString())
    localStorage.setItem('profileCurrentExp', newCurrentExp.toString())
    localStorage.setItem('lastCheckInDate', getTodayString())

    // 更新签到状态
    setIsCheckedIn(true)

    // 显示签到成功提示
    setShowCheckInSuccess(true)
    setTimeout(() => {
      setShowCheckInSuccess(false)
    }, 2000)
  }

  // 处理改名
  const handleChangeName = () => {
    const currentNameCards = parseInt(localStorage.getItem('nameCards') || '0', 10)
    
    if (currentNameCards <= 0) {
      alert('您没有改名卡！前往商城购买改名卡（1000⭐）')
      navigate('/recharge')
      return
    }

    const newName = prompt('请输入新名字（最多20个字符）：', profileData.name)
    
    if (!newName) {
      return
    }

    const trimmedName = newName.trim()
    if (!trimmedName) {
      alert('名字不能为空！')
      return
    }

    if (trimmedName.length > 20) {
      alert('名字不能超过20个字符！')
      return
    }

    // 扣除一张改名卡
    const newNameCards = currentNameCards - 1
    localStorage.setItem('nameCards', newNameCards.toString())
    localStorage.setItem('profileName', trimmedName)
    
    setNameCards(newNameCards)
    setProfileData(prev => ({
      ...prev,
      name: trimmedName,
    }))

    alert('改名成功！')
  }

  // 处理修改地点
  const handleChangeLocation = () => {
    const newLocation = prompt('请输入地点（城市名称）：', location)
    
    if (!newLocation) {
      return
    }

    const trimmedLocation = newLocation.trim()
    if (!trimmedLocation) {
      alert('地点不能为空！')
      return
    }

    localStorage.setItem('userLocation', trimmedLocation)
    setLocation(trimmedLocation)
    
    // 触发地点更新事件，通知天气组件更新
    window.dispatchEvent(new CustomEvent('locationUpdated', { 
      detail: { location: trimmedLocation } 
    }))

    alert('地点已更新！天气信息将刷新')
  }

  // 处理使用物品
  const handleUseItem = (itemId: string, itemName: string) => {
    // 改名卡使用特殊处理
    if (itemId === 'nameCard') {
      const currentCount = parseInt(localStorage.getItem('nameCards') || '0', 10)
      if (currentCount <= 0) {
        alert('改名卡数量不足！')
        return
      }
      // 改名卡的使用逻辑已经在 handleChangeName 中处理
      handleChangeName()
      return
    }

    const currentCount = parseInt(localStorage.getItem(`shopItem_${itemId}`) || '0', 10)
    if (currentCount <= 0) {
      alert('物品数量不足！')
      return
    }

    // 扣除物品
    const newCount = currentCount - 1
    localStorage.setItem(`shopItem_${itemId}`, newCount.toString())
    
    // 更新状态
    setInventory(prev => ({
      ...prev,
      [itemId]: newCount,
    }))

    // 触发背包更新事件
    window.dispatchEvent(new CustomEvent('inventoryUpdated'))

    // 根据物品类型执行不同效果
    if (itemId === 'seed') {
      // 种子包：只显示文字提示
      alert(`使用了${itemName}！获得随机种子奖励。`)
      
    } else if (itemId === 'fertilizer') {
      // 肥料包：只显示文字提示
      alert(`使用了${itemName}！所有地块的植物生长速度加快。`)
      
    } else if (itemId === 'coffee') {
      // 咖啡兑换券：只显示文字提示
      alert(`使用了${itemName}！精神焕发，干劲十足！`)
      
    } else if (itemId === 'fountain') {
      // 小喷泉：只显示文字提示
      alert(`使用了${itemName}！花园变得更加美丽，所有地块的水分增加了！`)
      
    } else if (itemId === 'bench') {
      // 长椅：只显示文字提示
      alert(`使用了${itemName}！在长椅上休息，心情愉悦！`)
      
    } else if (itemId === 'watering_upgrade') {
      // 浇水工具升级：永久提升浇水效果（标记已升级）
      const hasUpgrade = localStorage.getItem('wateringToolUpgraded')
      if (hasUpgrade === 'true') {
        alert(`您已经升级过浇水工具了！`)
        // 退回道具
        const currentCount = parseInt(localStorage.getItem(`shopItem_${itemId}`) || '0', 10) + 1
        localStorage.setItem(`shopItem_${itemId}`, currentCount.toString())
        setInventory(prev => ({
          ...prev,
          [itemId]: currentCount,
        }))
        return
      }
      
      localStorage.setItem('wateringToolUpgraded', 'true')
      alert(`使用了${itemName}！浇水工具已升级，以后完成浇水任务将获得双倍奖励！`)
    }
  }

  // 处理赠送物品（打开好友选择弹窗）
  const handleGiftItem = (itemId: string, itemName: string) => {
    // 改名卡赠送特殊处理
    let currentCount: number
    if (itemId === 'nameCard') {
      currentCount = parseInt(localStorage.getItem('nameCards') || '0', 10)
    } else {
      currentCount = parseInt(localStorage.getItem(`shopItem_${itemId}`) || '0', 10)
    }
    
    if (currentCount <= 0) {
      alert('物品数量不足！')
      return
    }

    // 检查是否有好友
    const savedFriends = localStorage.getItem('friends')
    if (!savedFriends) {
      alert('您还没有好友，先去添加好友吧！')
      return
    }

    try {
      const friends = JSON.parse(savedFriends)
      if (friends.length === 0) {
        alert('您还没有好友，先去添加好友吧！')
        return
      }
    } catch (e) {
      alert('您还没有好友，先去添加好友吧！')
      return
    }

    // 打开好友选择弹窗
    setGiftingItem({ id: itemId, name: itemName })
    setShowFriendSelect(true)
  }

  // 确认赠送给选中的好友
  const handleConfirmGift = (friendName: string) => {
    if (!giftingItem) return

    const { id: itemId, name: itemName } = giftingItem
    
    // 改名卡赠送特殊处理
    let currentCount: number
    if (itemId === 'nameCard') {
      currentCount = parseInt(localStorage.getItem('nameCards') || '0', 10)
    } else {
      currentCount = parseInt(localStorage.getItem(`shopItem_${itemId}`) || '0', 10)
    }
    
    if (currentCount <= 0) {
      alert('物品数量不足！')
      return
    }

    // 扣除物品
    const newCount = currentCount - 1
    if (itemId === 'nameCard') {
      localStorage.setItem('nameCards', newCount.toString())
    } else {
      localStorage.setItem(`shopItem_${itemId}`, newCount.toString())
    }
    
    // 更新状态
    setInventory(prev => ({
      ...prev,
      [itemId]: newCount,
    }))

    // 触发背包更新事件
    window.dispatchEvent(new CustomEvent('inventoryUpdated'))

    // 检查赠人玫瑰徽章
    const newBadge = incrementGiftCount()
    if (newBadge) {
      alert(`已将${itemName}赠送给 ${friendName}！\n\n🎉 获得新徽章：${newBadge.name} ${newBadge.icon}\n✨ 徽章奖励：500⭐ + 50EXP`)
    } else {
      alert(`已将${itemName}赠送给 ${friendName}！`)
    }
    
    setGiftingItem(null)
    setShowFriendSelect(false)
  }

  const expPercentage = (profileData.currentExp / profileData.maxExp) * 100

  return (
    <div className="page profile-page">
      {/* 用户信息卡片 */}
      <section className="page-section">
        <div className="profile-header-card">
          <div className="profile-header-left">
            <div className="profile-avatar">
              <div className="profile-avatar-placeholder"></div>
            </div>
            <div className="profile-header-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h2 className="profile-name">{profileData.name}</h2>
                {nameCards > 0 && (
                  <button 
                    className="profile-change-name-btn"
                    onClick={handleChangeName}
                    title={`使用改名卡（剩余：${nameCards}张）`}
                  >
                    ✏️
                  </button>
                )}
              </div>
              <div className="profile-title-tag">
                <span className="profile-title">{profileData.title}</span>
                <span className="profile-join-date">加入于 {profileData.joinDate}</span>
              </div>
              <div className="profile-location">
                <span className="profile-location-label">地点：</span>
                <span className="profile-location-value">{location}</span>
                <button 
                  className="profile-location-edit-btn"
                  onClick={handleChangeLocation}
                  title="修改地点"
                >
                  ✏️
                </button>
              </div>
            </div>
          </div>
          
          <div className="profile-header-bottom">
            <div className="profile-level-section">
              <div className="profile-level">
                Lv.{profileData.level}
                {levelUpMessage && (
                  <span className="profile-level-up-badge">↑</span>
                )}
              </div>
              <div className="profile-exp-bar">
                <div className="profile-exp-bar-fill" style={{ width: `${expPercentage}%` }}></div>
              </div>
              <div className="profile-exp-text">{profileData.currentExp}/{profileData.maxExp} EXP</div>
              {levelUpMessage && (
                <div className="profile-level-up-message">{levelUpMessage}</div>
              )}
            </div>
            
            <div className="profile-points-section">
              <span className="profile-points-icon">⭐</span>
              <span className="profile-points-value">{profileData.points.toLocaleString()}</span>
              <button 
                className="profile-recharge-btn"
                onClick={() => navigate('/recharge')}
                title="前往商城"
              >
                商城
              </button>
            </div>
            
            <div className="profile-checkin-wrapper">
              <button 
                className={`profile-checkin-btn ${isCheckedIn ? 'profile-checkin-btn-disabled' : ''}`}
                onClick={handleCheckIn}
                disabled={isCheckedIn}
              >
                {isCheckedIn ? '今日已签到' : '每日签到'}
              </button>
              {showCheckInSuccess && (
                <div className="profile-checkin-success">
                  <span>签到成功！+10⭐ +10EXP</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 统计数据 */}
      <section className="page-section">
        <div className="profile-stats-grid">
          <Card className="profile-stat-card">
            <div className="profile-stat-number">{profileData.completedTasks}</div>
            <div className="profile-stat-label">完成任务</div>
          </Card>

          <Card className="profile-stat-card">
            <div className="profile-stat-number">{profileData.experienceShareTimes}</div>
            <div className="profile-stat-label">分享经验</div>
          </Card>

          <Card className="profile-stat-card">
            <div className="profile-stat-number">{profileData.proposalTimes}</div>
            <div className="profile-stat-label">发布提案</div>
          </Card>

          <Card className="profile-stat-card">
            <div className="profile-stat-number">{profileData.checkInDays}天</div>
            <div className="profile-stat-label">连续打卡</div>
          </Card>

          <Card className="profile-stat-card">
            <div className="profile-stat-number">{myPlotsCount}</div>
            <div className="profile-stat-label">我的地块</div>
          </Card>

          <Card className="profile-stat-card">
            <div className="profile-stat-number">{reputation}</div>
            <div className="profile-stat-label">信誉积分</div>
          </Card>
        </div>
      </section>

      {/* 我的背包 */}
      <section className="page-section">
        <div className="inventory-header">
          <h2 className="section-title">我的背包</h2>
          <button 
            className="inventory-shop-btn"
            onClick={() => navigate('/recharge')}
          >
            <span className="inventory-shop-icon">🛒</span>
            <span>前往商城购买</span>
          </button>
        </div>
        <div className="inventory-grid">
          <InventoryItem
            id="seed"
            name="种子包"
            icon="🌱"
            count={inventory.seed}
            onUse={() => handleUseItem('seed', '种子包')}
            onGift={() => handleGiftItem('seed', '种子包')}
          />
          <InventoryItem
            id="fertilizer"
            name="肥料包"
            icon="🌿"
            count={inventory.fertilizer}
            onUse={() => handleUseItem('fertilizer', '肥料包')}
            onGift={() => handleGiftItem('fertilizer', '肥料包')}
          />
          <InventoryItem
            id="coffee"
            name="咖啡兑换券"
            icon="☕"
            count={inventory.coffee}
            onUse={() => handleUseItem('coffee', '咖啡兑换券')}
            onGift={() => handleGiftItem('coffee', '咖啡兑换券')}
          />
          <InventoryItem
            id="fountain"
            name="花园装饰-小喷泉"
            icon="⛲"
            count={inventory.fountain}
            onUse={() => handleUseItem('fountain', '花园装饰-小喷泉')}
            onGift={() => handleGiftItem('fountain', '花园装饰-小喷泉')}
          />
          <InventoryItem
            id="bench"
            name="花园装饰-长椅"
            icon="🪑"
            count={inventory.bench}
            onUse={() => handleUseItem('bench', '花园装饰-长椅')}
            onGift={() => handleGiftItem('bench', '花园装饰-长椅')}
          />
          <InventoryItem
            id="watering_upgrade"
            name="浇水工具升级"
            icon="🔧"
            count={inventory.watering_upgrade}
            onUse={() => handleUseItem('watering_upgrade', '浇水工具升级')}
            onGift={() => handleGiftItem('watering_upgrade', '浇水工具升级')}
          />
          <InventoryItem
            id="nameCard"
            name="改名卡"
            icon="✏️"
            count={inventory.nameCard}
            onUse={() => handleUseItem('nameCard', '改名卡')}
            onGift={() => handleGiftItem('nameCard', '改名卡')}
          />
        </div>
        {Object.values(inventory).every(count => count === 0) && (
          <div className="inventory-empty">
            <p>背包为空，前往商城购买商品吧！</p>
          </div>
        )}
      </section>

      {/* 我的徽章 */}
      <section className="page-section">
        <div className="profile-badges-header">
          <h2 className="section-title">我的徽章</h2>
          <span className="profile-badges-view-all">查看全部</span>
        </div>
        
        <div className="profile-badges-list">
          {badges.map((badge) => (
            <Card 
              key={badge.id} 
              className={`profile-badge-card ${!badge.earned ? 'profile-badge-unearned' : ''}`}
            >
              <div className="profile-badge-icon">{badge.icon}</div>
              <div className="profile-badge-name">{badge.name}</div>
              <div className="profile-badge-description">{badge.description}</div>
              <div className="profile-badge-date">
                {badge.earned ? (badge.earnedDate || '已获得') : '未获得'}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 好友选择弹窗 */}
      {showFriendSelect && giftingItem && (
        <FriendSelectModal
          itemName={giftingItem.name}
          onSelect={handleConfirmGift}
          onClose={() => {
            setShowFriendSelect(false)
            setGiftingItem(null)
          }}
        />
      )}
    </div>
  )
}


import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '@components/Card'
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
    badges: [
      { name: '新芽园丁', icon: '🌱', date: '2024-01-05', earned: true },
      { name: '浇水达人', icon: '💧', date: '2024-01-15', earned: true },
      { name: '除草专家', icon: '🌿', date: '', earned: false },
    ],
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

    return () => {
      window.removeEventListener('pointsUpdated', handlePointsUpdate as EventListener)
      window.removeEventListener('experienceShareTimesUpdated', handleExperienceShareTimesUpdate as EventListener)
      window.removeEventListener('proposalTimesUpdated', handleProposalTimesUpdate as EventListener)
      window.removeEventListener('nameCardsUpdated', handleNameCardsUpdate as EventListener)
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
        </div>
      </section>

      {/* 改名卡 */}
      <section className="page-section">
        <Card className="profile-namecard-section">
          <div className="profile-namecard-header">
            <div className="profile-namecard-info">
              <div className="profile-namecard-icon">✏️</div>
              <div>
                <div className="profile-namecard-title">改名卡</div>
                <div className="profile-namecard-count">剩余：{nameCards}张</div>
              </div>
            </div>
            {nameCards > 0 ? (
              <button 
                className="profile-namecard-btn"
                onClick={handleChangeName}
              >
                修改名字
              </button>
            ) : (
              <button 
                className="profile-namecard-btn profile-namecard-btn-disabled"
                onClick={() => navigate('/recharge')}
              >
                前往商城购买
              </button>
            )}
          </div>
          <div className="profile-namecard-current">
            <span className="profile-namecard-label">当前名字：</span>
            <span className="profile-namecard-name">{profileData.name}</span>
          </div>
        </Card>
      </section>

      {/* 我的徽章 */}
      <section className="page-section">
        <div className="profile-badges-header">
          <h2 className="section-title">我的徽章</h2>
          <span className="profile-badges-view-all">查看全部</span>
        </div>
        
        <div className="profile-badges-list">
          {profileData.badges.map((badge, index) => (
            <Card 
              key={index} 
              className={`profile-badge-card ${!badge.earned ? 'profile-badge-unearned' : ''}`}
            >
              <div className="profile-badge-icon">{badge.icon}</div>
              <div className="profile-badge-name">{badge.name}</div>
              <div className="profile-badge-date">
                {badge.earned ? badge.date : '未获得'}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}


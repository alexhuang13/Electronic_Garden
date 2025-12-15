/**
 * 徽章管理模块
 * 负责徽章的检查、授予和管理
 */

export interface Badge {
  id: string
  name: string
  icon: string
  description: string
  earned: boolean
  earnedDate?: string
}

// 所有徽章定义
export const ALL_BADGES: Badge[] = [
  { id: 'watering_master', name: '浇水达人', icon: '💧', description: '浇水三次', earned: false },
  { id: 'fertilizing_master', name: '肥料达人', icon: '🌿', description: '施肥三次', earned: false },
  { id: 'weeding_master', name: '除草达人', icon: '🌱', description: '除草三次', earned: false },
  { id: 'new_gardener', name: '新芽园丁', icon: '🌱', description: '认养第一块地', earned: false },
  { id: 'expert_gardener', name: '园艺专家', icon: '🌳', description: '认养五块地', earned: false },
  { id: 'helpful', name: '乐于助人', icon: '🤝', description: '发布三条经验', earned: false },
  { id: 'rich', name: '我是土豪', icon: '💰', description: '充值100元', earned: false },
  { id: 'very_rich', name: '我是大土豪', icon: '💎', description: '充值1000元', earned: false },
  { id: 'gift_giver', name: '赠人玫瑰', icon: '🌹', description: '送好友三次礼物', earned: false },
  { id: 'little_darwin', name: '小达尔文', icon: '🔬', description: '发现三种生物', earned: false },
]

// 从localStorage加载徽章数据
export const loadBadges = (): Record<string, Badge> => {
  const saved = localStorage.getItem('userBadges')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      return {}
    }
  }
  return {}
}

// 保存徽章数据到localStorage
export const saveBadges = (badges: Record<string, Badge>) => {
  localStorage.setItem('userBadges', JSON.stringify(badges))
}

// 获取所有徽章（合并默认定义和已获得的数据）
export const getAllBadges = (): Badge[] => {
  const savedBadges = loadBadges()
  return ALL_BADGES.map(badge => {
    const saved = savedBadges[badge.id]
    if (saved) {
      return { ...badge, ...saved }
    }
    return badge
  })
}

// 检查并授予徽章
export const checkAndAwardBadge = (badgeId: string): Badge | null => {
  const badges = loadBadges()
  const badge = ALL_BADGES.find(b => b.id === badgeId)
  
  if (!badge) {
    return null
  }

  // 如果已经获得，不重复授予
  if (badges[badgeId]?.earned) {
    return null
  }

  // 授予徽章
  const awardedBadge: Badge = {
    ...badge,
    earned: true,
    earnedDate: new Date().toISOString().split('T')[0],
  }

  badges[badgeId] = awardedBadge
  saveBadges(badges)

  // 徽章奖励：500星星和50EXP
  const rewardStars = 500
  const rewardExp = 50

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

  // 触发积分更新事件
  window.dispatchEvent(new CustomEvent('pointsUpdated', { 
    detail: { newPoints, newLevel, newCurrentExp, levelUp } 
  }))

  // 触发徽章更新事件
  window.dispatchEvent(new CustomEvent('badgeUpdated', { 
    detail: { badge: awardedBadge, rewardStars, rewardExp, levelUp } 
  }))

  return awardedBadge
}

// 检查浇水达人徽章
export const checkWateringMaster = () => {
  const count = parseInt(localStorage.getItem('wateringCount') || '0', 10)
  if (count >= 3) {
    return checkAndAwardBadge('watering_master')
  }
  return null
}

// 检查肥料达人徽章
export const checkFertilizingMaster = () => {
  const count = parseInt(localStorage.getItem('fertilizingCount') || '0', 10)
  if (count >= 3) {
    return checkAndAwardBadge('fertilizing_master')
  }
  return null
}

// 检查除草达人徽章
export const checkWeedingMaster = () => {
  const count = parseInt(localStorage.getItem('weedingCount') || '0', 10)
  if (count >= 3) {
    return checkAndAwardBadge('weeding_master')
  }
  return null
}

// 增加浇水次数
export const incrementWateringCount = () => {
  const count = parseInt(localStorage.getItem('wateringCount') || '0', 10) + 1
  localStorage.setItem('wateringCount', count.toString())
  return checkWateringMaster()
}

// 增加施肥次数
export const incrementFertilizingCount = () => {
  const count = parseInt(localStorage.getItem('fertilizingCount') || '0', 10) + 1
  localStorage.setItem('fertilizingCount', count.toString())
  return checkFertilizingMaster()
}

// 增加除草次数
export const incrementWeedingCount = () => {
  const count = parseInt(localStorage.getItem('weedingCount') || '0', 10) + 1
  localStorage.setItem('weedingCount', count.toString())
  return checkWeedingMaster()
}

// 检查新芽园丁徽章（认养第一块地）
export const checkNewGardener = () => {
  const count = parseInt(localStorage.getItem('adoptedPlotsCount') || '0', 10)
  if (count >= 1) {
    return checkAndAwardBadge('new_gardener')
  }
  return null
}

// 检查园艺专家徽章（认养五块地）
export const checkExpertGardener = () => {
  const count = parseInt(localStorage.getItem('adoptedPlotsCount') || '0', 10)
  if (count >= 5) {
    return checkAndAwardBadge('expert_gardener')
  }
  return null
}

// 增加认养地块次数
export const incrementAdoptedPlotsCount = () => {
  const count = parseInt(localStorage.getItem('adoptedPlotsCount') || '0', 10) + 1
  localStorage.setItem('adoptedPlotsCount', count.toString())
  
  // 检查两个徽章
  const newGardener = checkNewGardener()
  const expertGardener = checkExpertGardener()
  
  return newGardener || expertGardener
}

// 检查乐于助人徽章（发布三条经验）
export const checkHelpful = () => {
  const count = parseInt(localStorage.getItem('experienceShareTimes') || '0', 10)
  if (count >= 3) {
    return checkAndAwardBadge('helpful')
  }
  return null
}

// 检查我是土豪徽章（充值100元）
export const checkRich = () => {
  const totalRecharge = parseFloat(localStorage.getItem('totalRecharge') || '0')
  if (totalRecharge >= 100) {
    return checkAndAwardBadge('rich')
  }
  return null
}

// 检查我是大土豪徽章（充值1000元）
export const checkVeryRich = () => {
  const totalRecharge = parseFloat(localStorage.getItem('totalRecharge') || '0')
  if (totalRecharge >= 1000) {
    return checkAndAwardBadge('very_rich')
  }
  return null
}

// 增加充值金额
export const addRechargeAmount = (amount: number) => {
  const total = parseFloat(localStorage.getItem('totalRecharge') || '0') + amount
  localStorage.setItem('totalRecharge', total.toString())
  
  // 检查两个徽章
  const rich = checkRich()
  const veryRich = checkVeryRich()
  
  return rich || veryRich
}

// 检查赠人玫瑰徽章（送好友三次礼物）
export const checkGiftGiver = () => {
  const count = parseInt(localStorage.getItem('giftCount') || '0', 10)
  if (count >= 3) {
    return checkAndAwardBadge('gift_giver')
  }
  return null
}

// 增加赠送礼物次数
export const incrementGiftCount = () => {
  const count = parseInt(localStorage.getItem('giftCount') || '0', 10) + 1
  localStorage.setItem('giftCount', count.toString())
  return checkGiftGiver()
}

// 检查小达尔文徽章（发现三种生物）
export const checkLittleDarwin = () => {
  // 从localStorage加载已发现的生物数据
  const saved = localStorage.getItem('discoveredSpeciesData')
  if (saved) {
    try {
      const discoveredData = JSON.parse(saved)
      const discoveredCount = Object.keys(discoveredData).length
      if (discoveredCount >= 3) {
        return checkAndAwardBadge('little_darwin')
      }
    } catch (e) {
      return null
    }
  }
  return null
}


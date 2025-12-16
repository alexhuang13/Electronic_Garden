import React from 'react'
import { createRoot } from 'react-dom/client'
import NotificationModal, { RewardInfo } from '../components/NotificationModal'

/**
 * 显示通知弹窗的工具函数
 */

interface ShowNotificationOptions {
  title?: string
  autoClose?: number
}

/**
 * 显示奖励通知
 */
export function showReward(
  message: string,
  reward?: RewardInfo,
  title?: string,
  autoClose: number = 4000
) {
  showNotification('reward', message, { title, autoClose, reward })
}

/**
 * 显示成功通知
 */
export function showSuccess(
  message: string,
  title?: string,
  autoClose: number = 3000
) {
  showNotification('success', message, { title, autoClose })
}

/**
 * 显示错误通知
 */
export function showError(
  message: string,
  title?: string,
  autoClose: number = 4000
) {
  showNotification('error', message, { title, autoClose })
}

/**
 * 显示警告通知
 */
export function showWarning(
  message: string,
  title?: string,
  autoClose: number = 3000
) {
  showNotification('warning', message, { title, autoClose })
}

/**
 * 显示信息通知
 */
export function showInfo(
  message: string,
  title?: string,
  autoClose: number = 3000
) {
  showNotification('info', message, { title, autoClose })
}

/**
 * 从消息字符串中解析奖励信息并显示
 */
export function showRewardFromMessage(message: string, title?: string) {
  // 解析星星
  const starsMatch = message.match(/(\d+)\s*⭐|星星[：:]\s*(\d+)/i)
  const stars = starsMatch ? parseInt(starsMatch[1] || starsMatch[2] || '0', 10) : undefined

  // 解析经验
  const expMatch = message.match(/(\d+)\s*EXP|经验[：:]\s*(\d+)/i)
  const exp = expMatch ? parseInt(expMatch[1] || expMatch[2] || '0', 10) : undefined

  // 解析徽章
  const badgeMatch = message.match(/获得新徽章[：:]\s*([^🎉✨\n]+)\s*([🌱💧🌾🎖️🏆⭐🌟💎👑🎯🔥💪🌿🎨🎪🎭🎬🎤🎧🎮🎰🎲🎳]+)/)
  const badge = badgeMatch ? {
    name: badgeMatch[1].trim(),
    icon: badgeMatch[2].trim(),
  } : undefined

  // 解析升级信息
  const levelUpMatch = message.match(/升级[！!]?\s*Lv\.?(\d+)/i)
  const levelUp = levelUpMatch ? {
    level: parseInt(levelUpMatch[1], 10),
    title: '', // 需要从其他地方获取
  } : undefined

  // 清理消息（移除奖励信息）
  const cleanMessage = message
    .replace(/获得\s*\d+\s*⭐[^⭐]*/g, '')
    .replace(/获得\s*\d+\s*EXP[^E]*/g, '')
    .replace(/🎉\s*获得新徽章[：:][^\n]+/g, '')
    .replace(/✨\s*徽章奖励[：:][^\n]+/g, '')
    .trim()

  const reward: RewardInfo | undefined = (stars !== undefined || exp !== undefined || badge || levelUp) ? {
    stars,
    exp,
    badge,
    levelUp,
  } : undefined

  showReward(cleanMessage || message, reward, title)
}

/**
 * 内部函数：显示通知
 */
function showNotification(
  type: 'success' | 'reward' | 'info' | 'error' | 'warning',
  message: string,
  options: ShowNotificationOptions & { reward?: RewardInfo } = {}
) {
  // 创建容器
  const container = document.createElement('div')
  container.id = `notification-${Date.now()}`
  document.body.appendChild(container)

  const root = createRoot(container)

  const handleClose = () => {
    // 延迟移除 DOM，等待动画完成
    setTimeout(() => {
      root.unmount()
      if (container.parentNode) {
        container.parentNode.removeChild(container)
      }
    }, 300)
  }

  root.render(
    React.createElement(NotificationModal, {
      type,
      message,
      title: options.title,
      reward: options.reward,
      onClose: handleClose,
      autoClose: options.autoClose || 3000,
    })
  )
}


/**
 * 日期格式化工具模块
 */

export const dateFormatter = {
  /**
   * 格式化日期为 YYYY-MM-DD
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  },

  /**
   * 格式化日期时间为 YYYY-MM-DD HH:mm
   */
  formatDateTime(date: Date): string {
    return new Date(date).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  },

  /**
   * 计算相对时间（例如：3天前、2小时后）
   */
  getRelativeTime(date: Date): string {
    const now = new Date()
    const targetDate = new Date(date)
    const diffMs = targetDate.getTime() - now.getTime()
    const diffSec = Math.abs(Math.floor(diffMs / 1000))
    const isPast = diffMs < 0

    if (diffSec < 60) {
      return isPast ? '刚刚' : '马上'
    }

    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) {
      return isPast ? `${diffMin}分钟前` : `${diffMin}分钟后`
    }

    const diffHour = Math.floor(diffMin / 60)
    if (diffHour < 24) {
      return isPast ? `${diffHour}小时前` : `${diffHour}小时后`
    }

    const diffDay = Math.floor(diffHour / 24)
    if (diffDay < 30) {
      return isPast ? `${diffDay}天前` : `${diffDay}天后`
    }

    const diffMonth = Math.floor(diffDay / 30)
    if (diffMonth < 12) {
      return isPast ? `${diffMonth}个月前` : `${diffMonth}个月后`
    }

    const diffYear = Math.floor(diffMonth / 12)
    return isPast ? `${diffYear}年前` : `${diffYear}年后`
  },

  /**
   * 判断是否是今天
   */
  isToday(date: Date): boolean {
    const today = new Date()
    const targetDate = new Date(date)
    return (
      targetDate.getDate() === today.getDate() &&
      targetDate.getMonth() === today.getMonth() &&
      targetDate.getFullYear() === today.getFullYear()
    )
  },

  /**
   * 判断是否是本周
   */
  isThisWeek(date: Date): boolean {
    const now = new Date()
    const targetDate = new Date(date)
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 7)

    return targetDate >= startOfWeek && targetDate < endOfWeek
  },
}

import { useBanner } from './useBanner'
import './Banner.css'

/**
 * 顶部横幅模块
 * 显示天气、公告或建议
 */

interface BannerProps {
  type: 'weather' | 'announcement' | 'suggestion'
}

export default function Banner({ type }: BannerProps) {
  const { content, icon } = useBanner(type)

  return (
    <div className={`banner banner-${type}`}>
      <span className="banner-icon">{icon}</span>
      <p className="banner-content">{content}</p>
    </div>
  )
}

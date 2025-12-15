import Leaderboard from '@sections/leaderboard/Leaderboard'
import '@styles/pages.css'

/**
 * 🏆 社区页面
 *
 * 功能：
 * - 排行榜
 * - 礼物 / 奖励 / 成就
 */
export default function Community() {
  return (
    <div className="page community-page">
      <section className="page-section">
        <h2 className="section-title">排行榜</h2>
        <Leaderboard />
      </section>

      <section className="page-section">
        <h2 className="section-title">奖励商店</h2>
        <div className="placeholder">
          奖励与成就模块 - 待实现
        </div>
      </section>
    </div>
  )
}

import Leaderboard from '@sections/leaderboard/Leaderboard'
import '@styles/pages.css'

/**
 * 🏆 社区页面
 *
 * 功能：
 * - 排行榜
 */
export default function Community() {
  return (
    <div className="page community-page">
      <section className="page-section">
        <h2 className="section-title">排行榜</h2>
        <Leaderboard />
      </section>
    </div>
  )
}

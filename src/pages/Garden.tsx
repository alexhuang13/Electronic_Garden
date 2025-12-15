import Banner from '@sections/banner/Banner'
import PlotCardList from '@sections/plotCardList/PlotCardList'
import '@styles/pages.css'

/**
 * 🌿 我的花园页面
 *
 * 功能：
 * - 显示花园地图和床位状态
 * - 作物生长进度、缺水状态、成熟度
 * - 点击床位进行管理或发起求助
 */
export default function Garden() {
  return (
    <div className="page garden-page">
      <Banner type="weather" />

      <section className="page-section">
        <h2 className="section-title">花园地图</h2>
        <PlotCardList />
      </section>
    </div>
  )
}

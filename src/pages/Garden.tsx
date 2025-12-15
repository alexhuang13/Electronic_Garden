import WeatherCard from '@sections/weatherCard/WeatherCard'
import PlotCardList from '@sections/plotCardList/PlotCardList'
import '@styles/pages.css'

/**
 * 🌿 我的花园页面
 *
 * 功能：
 * - 显示花园地图和地块状态
 * - 作物生长进度、缺水状态、成熟度
 * - 点击地块进行管理或发起求助
 */
export default function Garden() {
  return (
    <div className="page garden-page">
      <WeatherCard />

      <section className="page-section">
        <h2 className="section-title">花园地图</h2>
        <PlotCardList />
      </section>

      <section className="page-section">
        <h2 className="section-title">我的地块</h2>
        <PlotCardList filter="myPlots" />
      </section>
    </div>
  )
}

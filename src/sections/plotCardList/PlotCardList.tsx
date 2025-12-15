import { usePlotCardList } from './usePlotCardList'
import PlotCard from './PlotCard'
import './PlotCardList.css'

/**
 * 花园床位列表模块
 * 显示所有花园床位的状态
 */

export default function PlotCardList() {
  const { plots, handlePlotClick } = usePlotCardList()

  return (
    <div className="plot-card-list">
      {plots.map((plot) => (
        <PlotCard
          key={plot.id}
          plot={plot}
          onClick={() => handlePlotClick(plot.id)}
        />
      ))}
    </div>
  )
}

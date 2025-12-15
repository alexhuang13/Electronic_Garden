import { usePlotCardList } from './usePlotCardList'
import PlotCard from './PlotCard'
import './PlotCardList.css'

/**
 * 花园地块列表模块
 * 显示所有花园地块的状态
 */

interface PlotCardListProps {
  filter?: 'all' | 'myPlots'
}

export default function PlotCardList({ filter = 'all' }: PlotCardListProps) {
  const { plots, handlePlotClick, handleApplyResponsibility, handleEditPlot } = usePlotCardList(filter)
  const showEditButton = filter === 'myPlots' // 只在"我的地块"部分显示编辑按钮

  return (
    <div className="plot-card-list">
      {plots.length > 0 ? (
        plots.map((plot) => (
          <PlotCard
            key={plot.id}
            plot={plot}
            onClick={() => handlePlotClick(plot.id)}
            onApplyResponsibility={() => handleApplyResponsibility(plot.id)}
            onEdit={handleEditPlot}
            showEditButton={showEditButton}
          />
        ))
      ) : (
        <div className="plot-card-list-empty">
          {filter === 'myPlots' ? '您还没有负责的地块' : '暂无地块'}
        </div>
      )}
    </div>
  )
}

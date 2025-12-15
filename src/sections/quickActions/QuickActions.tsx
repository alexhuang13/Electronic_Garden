import { useQuickActions } from './useQuickActions'
import './QuickActions.css'

/**
 * 快捷操作模块
 * 提供常用的快捷操作按钮
 */

interface QuickActionsProps {
  actions: Array<'water' | 'weed' | 'harvest' | 'help' | 'report'>
}

export default function QuickActions({ actions }: QuickActionsProps) {
  const { handleAction } = useQuickActions()

  const actionConfig = {
    water: { icon: '💧', label: '快速浇水' },
    weed: { icon: '🌿', label: '快速除草' },
    harvest: { icon: '🌾', label: '快速收获' },
    help: { icon: '🆘', label: '请求帮助' },
    report: { icon: '📝', label: '提交报告' },
  }

  return (
    <div className="quick-actions">
      <h3 className="quick-actions-title">快捷操作</h3>
      <div className="quick-actions-buttons">
        {actions.map((action) => {
          const config = actionConfig[action]
          return (
            <button
              key={action}
              className="quick-action-btn"
              onClick={() => handleAction(action)}
            >
              <span className="quick-action-icon">{config.icon}</span>
              <span className="quick-action-label">{config.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

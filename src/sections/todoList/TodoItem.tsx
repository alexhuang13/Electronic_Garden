import { Task } from '@core/types'
import './TodoItem.css'

/**
 * 单个任务项组件
 */

interface TodoItemProps {
  task: Task
  onClick: () => void
  onComplete: () => void
}

export default function TodoItem({ task, onClick, onComplete }: TodoItemProps) {
  const getTypeEmoji = (type: Task['type']) => {
    const emojiMap = {
      watering: '💧',
      weeding: '🌿',
      fertilizing: '🌱',
      harvesting: '🌾',
      maintenance: '🔧',
      other: '📋',
    }
    return emojiMap[type] || '📋'
  }

  const getPriorityClass = (priority: Task['priority']) => {
    return `priority-${priority}`
  }

  return (
    <div
      className={`todo-item ${getPriorityClass(task.priority)} status-${task.status}`}
      onClick={onClick}
    >
      <div className="todo-item-header">
        <span className="todo-item-emoji">{getTypeEmoji(task.type)}</span>
        <h4 className="todo-item-title">{task.title}</h4>
        <span className={`todo-item-priority ${getPriorityClass(task.priority)}`}>
          {task.priority}
        </span>
      </div>

      <p className="todo-item-description">{task.description}</p>

      {task.dueDate && (
        <p className="todo-item-due-date">
          截止时间: {new Date(task.dueDate).toLocaleDateString('zh-CN')}
        </p>
      )}

      {task.status !== 'completed' && (
        <>
          <div className="todo-item-reward">
            <span className="todo-item-reward-label">完成任务奖励：</span>
            <span className="todo-item-reward-stars">
              ⭐ {(task as any)?.reward || 50}
            </span>
            <span className="todo-item-reward-exp">⚡ +10EXP</span>
          </div>
          <button
            className="todo-item-complete-btn"
            onClick={(e) => {
              e.stopPropagation()
              onComplete()
            }}
          >
            标记完成
          </button>
        </>
      )}
    </div>
  )
}

import { useTodoList } from './useTodoList'
import TodoItem from './TodoItem'
import './TodoList.css'

/**
 * 任务列表模块
 * 显示不同筛选条件下的任务
 */

interface TodoListProps {
  filter: 'myTasks' | 'needsHelp' | 'overdue' | 'all'
}

export default function TodoList({ filter }: TodoListProps) {
  const { tasks, handleTaskClick, handleTaskComplete } = useTodoList(filter)

  if (tasks.length === 0) {
    return (
      <div className="todo-list-empty">
        <p>暂无任务</p>
      </div>
    )
  }

  return (
    <div className="todo-list">
      {tasks.map((task) => (
        <TodoItem
          key={task.id}
          task={task}
          onClick={() => handleTaskClick(task.id)}
          onComplete={() => handleTaskComplete(task.id)}
        />
      ))}
    </div>
  )
}

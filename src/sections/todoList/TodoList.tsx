import { useState } from 'react'
import { useTodoList } from './useTodoList'
import TodoItem from './TodoItem'
import CreateTaskForm from './CreateTaskForm'
import './TodoList.css'

/**
 * 任务列表模块
 * 显示不同筛选条件下的任务
 */

interface TodoListProps {
  filter: 'myTasks' | 'needsHelp' | 'overdue' | 'all'
}

export default function TodoList({ filter }: TodoListProps) {
  const { tasks, handleTaskClick, handleTaskComplete, handleCreateTask } = useTodoList(filter)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const handleFormSubmit = (taskData: {
    title: string
    description: string
    dueDate: Date
    reward: number
  }) => {
    if (handleCreateTask(taskData)) {
      setShowCreateForm(false)
    }
  }

  return (
    <>
      {filter === 'needsHelp' && (
        <div className="todo-list-header">
          <button className="todo-list-create-btn" onClick={() => setShowCreateForm(true)}>
            <span className="todo-list-create-icon">➕</span>
            <span>发布任务</span>
          </button>
        </div>
      )}

      {showCreateForm && (
        <CreateTaskForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {tasks.length === 0 ? (
        <div className="todo-list-empty">
          <p>暂无任务</p>
        </div>
      ) : (
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
      )}
    </>
  )
}

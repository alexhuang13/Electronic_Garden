import { useState } from 'react'
import Card from '@components/Card'
import './CreateTaskForm.css'

interface CreateTaskFormProps {
  onClose: () => void
  onSubmit: (taskData: {
    title: string
    description: string
    dueDate: Date
    reward: number
  }) => void
}

export default function CreateTaskForm({ onClose, onSubmit }: CreateTaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [reward, setReward] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = '请输入任务标题'
    }

    if (!description.trim()) {
      newErrors.description = '请输入任务描述'
    }

    if (!dueDate) {
      newErrors.dueDate = '请选择截止日期'
    } else {
      const selectedDate = new Date(dueDate)
      if (selectedDate < new Date()) {
        newErrors.dueDate = '截止日期不能早于今天'
      }
    }

    if (!reward || parseInt(reward, 10) <= 0) {
      newErrors.reward = '请输入有效的奖励金额（大于0）'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate: new Date(dueDate),
      reward: parseInt(reward, 10),
    })
  }

  return (
    <div className="create-task-overlay" onClick={onClose}>
      <Card 
        className="create-task-form-card" 
        onClick={(e?: React.MouseEvent) => e?.stopPropagation()}
      >
        <div className="create-task-form-header">
          <h3 className="create-task-form-title">发布任务</h3>
          <button className="create-task-form-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="create-task-form">
          <div className="create-task-form-group">
            <label className="create-task-form-label">
              任务标题 <span className="required">*</span>
            </label>
            <input
              type="text"
              className={`create-task-form-input ${errors.title ? 'error' : ''}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入任务标题"
            />
            {errors.title && (
              <span className="create-task-form-error">{errors.title}</span>
            )}
          </div>

          <div className="create-task-form-group">
            <label className="create-task-form-label">
              任务描述 <span className="required">*</span>
            </label>
            <textarea
              className={`create-task-form-textarea ${errors.description ? 'error' : ''}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请输入任务描述"
              rows={4}
            />
            {errors.description && (
              <span className="create-task-form-error">{errors.description}</span>
            )}
          </div>

          <div className="create-task-form-group">
            <label className="create-task-form-label">
              截止日期 <span className="required">*</span>
            </label>
            <input
              type="date"
              className={`create-task-form-input ${errors.dueDate ? 'error' : ''}`}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.dueDate && (
              <span className="create-task-form-error">{errors.dueDate}</span>
            )}
          </div>

          <div className="create-task-form-group">
            <label className="create-task-form-label">
              奖励（星星） <span className="required">*</span>
            </label>
            <input
              type="number"
              className={`create-task-form-input ${errors.reward ? 'error' : ''}`}
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              placeholder="请输入奖励金额"
              min="1"
            />
            {errors.reward && (
              <span className="create-task-form-error">{errors.reward}</span>
            )}
          </div>

          <div className="create-task-form-actions">
            <button type="button" className="create-task-form-cancel" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="create-task-form-submit">
              发布任务
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}

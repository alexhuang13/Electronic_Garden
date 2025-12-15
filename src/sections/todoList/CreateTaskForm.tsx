import { useState } from 'react'
import Card from '@components/Card'
import './CreateTaskForm.css'

/**
 * 发布任务表单组件
 */

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
      newErrors.title = '请输入任务名称'
    }

    if (!description.trim()) {
      newErrors.description = '请输入任务描述'
    }

    if (!dueDate) {
      newErrors.dueDate = '请选择截止时间'
    } else if (new Date(dueDate) < new Date()) {
      newErrors.dueDate = '截止时间不能早于当前时间'
    }

    if (!reward || parseInt(reward) <= 0) {
      newErrors.reward = '请输入有效的报酬数量（大于0）'
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
      reward: parseInt(reward),
    })
  }

  return (
    <div className="create-task-overlay" onClick={onClose}>
      <Card className="create-task-form-card" onClick={(e) => e.stopPropagation()}>
        <div className="create-task-form-header">
          <h3 className="create-task-form-title">发布任务</h3>
          <button className="create-task-form-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="create-task-form">
          <div className="create-task-form-group">
            <label className="create-task-form-label">
              任务名称 <span className="required">*</span>
            </label>
            <input
              type="text"
              className={`create-task-form-input ${errors.title ? 'error' : ''}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入任务名称"
            />
            {errors.title && <span className="create-task-form-error">{errors.title}</span>}
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
              截止时间 <span className="required">*</span>
            </label>
            <input
              type="datetime-local"
              className={`create-task-form-input ${errors.dueDate ? 'error' : ''}`}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            {errors.dueDate && (
              <span className="create-task-form-error">{errors.dueDate}</span>
            )}
          </div>

          <div className="create-task-form-group">
            <label className="create-task-form-label">
              报酬（星星） <span className="required">*</span>
            </label>
            <div className="create-task-form-reward-input">
              <input
                type="number"
                className={`create-task-form-input ${errors.reward ? 'error' : ''}`}
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                placeholder="0"
                min="1"
              />
              <span className="create-task-form-reward-unit">⭐</span>
            </div>
            <div className="create-task-form-reward-hint">
              完成任务将获得 {reward || '0'}⭐ 和 10EXP
            </div>
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




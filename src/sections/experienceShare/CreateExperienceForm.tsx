import { useState } from 'react'
import Card from '@components/Card'
import './CreateExperienceForm.css'

/**
 * 发布经验分享表单组件
 */

interface CreateExperienceFormProps {
  onClose: () => void
  onSubmit: (experienceData: {
    title: string
    content: string
  }) => void
}

export default function CreateExperienceForm({ onClose, onSubmit }: CreateExperienceFormProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = '请输入经验标题'
    }

    if (!content.trim()) {
      newErrors.content = '请输入经验内容'
    } else if (content.trim().length < 10) {
      newErrors.content = '经验内容至少需要10个字符'
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
      content: content.trim(),
    })
  }

  return (
    <div className="create-experience-overlay" onClick={onClose}>
      <Card className="create-experience-form-card" onClick={(e) => e.stopPropagation()}>
        <div className="create-experience-form-header">
          <h3 className="create-experience-form-title">发布经验分享</h3>
          <button className="create-experience-form-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="create-experience-form">
          <div className="create-experience-form-group">
            <label className="create-experience-form-label">
              经验标题 <span className="required">*</span>
            </label>
            <input
              type="text"
              className={`create-experience-form-input ${errors.title ? 'error' : ''}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入经验标题"
            />
            {errors.title && (
              <span className="create-experience-form-error">{errors.title}</span>
            )}
          </div>

          <div className="create-experience-form-group">
            <label className="create-experience-form-label">
              经验内容 <span className="required">*</span>
            </label>
            <textarea
              className={`create-experience-form-textarea ${errors.content ? 'error' : ''}`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请详细分享您的种植经验..."
              rows={8}
            />
            {errors.content && (
              <span className="create-experience-form-error">{errors.content}</span>
            )}
          </div>

          <div className="create-experience-form-reward">
            <div className="create-experience-form-reward-icon">🎁</div>
            <div className="create-experience-form-reward-content">
              <div className="create-experience-form-reward-title">发布奖励</div>
              <div className="create-experience-form-reward-desc">
                发布经验分享将获得 <span className="create-experience-form-reward-stars">200⭐</span> 和 <span className="create-experience-form-reward-exp">10EXP</span>
              </div>
            </div>
          </div>

          <div className="create-experience-form-actions">
            <button type="button" className="create-experience-form-cancel" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="create-experience-form-submit">
              发布经验
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}




import { useState } from 'react'
import Card from '@components/Card'
import { ProposalCategory, BulletinItemType } from '@core/types'
import './CreateBulletinForm.css'

/**
 * 发布公告栏表单组件
 * 支持发布公告或提案
 */

interface CreateBulletinFormProps {
  onClose: () => void
  onSubmit: (data: {
    type: BulletinItemType
    title: string
    content: string
    category?: ProposalCategory
    votingDeadline?: Date
    priority?: 'normal' | 'important' | 'urgent'
  }) => void
}

const categoryOptions: { value: ProposalCategory; label: string }[] = [
  { value: 'rule', label: '规则制定' },
  { value: 'budget', label: '预算管理' },
  { value: 'event', label: '活动策划' },
  { value: 'improvement', label: '改进建议' },
  { value: 'other', label: '其他' },
]

const priorityOptions: { value: 'normal' | 'important' | 'urgent'; label: string; icon: string }[] = [
  { value: 'normal', label: '普通', icon: '📌' },
  { value: 'important', label: '重要', icon: '⚠️' },
  { value: 'urgent', label: '紧急', icon: '🚨' },
]

export default function CreateBulletinForm({ onClose, onSubmit }: CreateBulletinFormProps) {
  const [type, setType] = useState<BulletinItemType>('announcement')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<ProposalCategory>('other')
  const [votingDeadline, setVotingDeadline] = useState('')
  const [priority, setPriority] = useState<'normal' | 'important' | 'urgent'>('normal')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = `请输入${type === 'announcement' ? '公告' : '提案'}标题`
    }

    if (!content.trim()) {
      newErrors.content = `请输入${type === 'announcement' ? '公告' : '提案'}内容`
    }

    if (type === 'proposal') {
      if (!votingDeadline) {
        newErrors.votingDeadline = '请选择投票截止时间'
      } else if (new Date(votingDeadline) < new Date()) {
        newErrors.votingDeadline = '投票截止时间不能早于当前时间'
      }
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
      type,
      title: title.trim(),
      content: content.trim(),
      category: type === 'proposal' ? category : undefined,
      votingDeadline: type === 'proposal' && votingDeadline ? new Date(votingDeadline) : undefined,
      priority: type === 'announcement' ? priority : undefined,
    })
  }

  return (
    <div className="create-bulletin-overlay" onClick={onClose}>
      <Card className="create-bulletin-form-card" onClick={(e) => e.stopPropagation()}>
        <div className="create-bulletin-form-header">
          <h3 className="create-bulletin-form-title">发布内容</h3>
          <button className="create-bulletin-form-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="create-bulletin-form">
          {/* 类型选择 */}
          <div className="create-bulletin-form-group">
            <label className="create-bulletin-form-label">
              发布类型 <span className="required">*</span>
            </label>
            <div className="create-bulletin-type-selector">
              <button
                type="button"
                className={`create-bulletin-type-btn ${type === 'announcement' ? 'active' : ''}`}
                onClick={() => setType('announcement')}
              >
                <span className="create-bulletin-type-icon">📢</span>
                <span>公告</span>
              </button>
              <button
                type="button"
                className={`create-bulletin-type-btn ${type === 'proposal' ? 'active' : ''}`}
                onClick={() => setType('proposal')}
              >
                <span className="create-bulletin-type-icon">📋</span>
                <span>提案</span>
              </button>
            </div>
          </div>

          {/* 标题 */}
          <div className="create-bulletin-form-group">
            <label className="create-bulletin-form-label">
              {type === 'announcement' ? '公告' : '提案'}标题 <span className="required">*</span>
            </label>
            <input
              type="text"
              className={`create-bulletin-form-input ${errors.title ? 'error' : ''}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`请输入${type === 'announcement' ? '公告' : '提案'}标题`}
            />
            {errors.title && (
              <span className="create-bulletin-form-error">{errors.title}</span>
            )}
          </div>

          {/* 公告优先级或提案类别 */}
          {type === 'announcement' ? (
            <div className="create-bulletin-form-group">
              <label className="create-bulletin-form-label">优先级</label>
              <div className="create-bulletin-priority-selector">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`create-bulletin-priority-btn ${priority === option.value ? 'active' : ''}`}
                    onClick={() => setPriority(option.value)}
                  >
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="create-bulletin-form-group">
              <label className="create-bulletin-form-label">
                提案类别 <span className="required">*</span>
              </label>
              <select
                className="create-bulletin-form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as ProposalCategory)}
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 内容 */}
          <div className="create-bulletin-form-group">
            <label className="create-bulletin-form-label">
              {type === 'announcement' ? '公告' : '提案'}内容 <span className="required">*</span>
            </label>
            <textarea
              className={`create-bulletin-form-textarea ${errors.content ? 'error' : ''}`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`请详细描述${type === 'announcement' ? '公告' : '提案'}内容`}
              rows={6}
            />
            {errors.content && (
              <span className="create-bulletin-form-error">{errors.content}</span>
            )}
          </div>

          {/* 投票截止时间（仅提案） */}
          {type === 'proposal' && (
            <div className="create-bulletin-form-group">
              <label className="create-bulletin-form-label">
                投票截止时间 <span className="required">*</span>
              </label>
              <input
                type="datetime-local"
                className={`create-bulletin-form-input ${errors.votingDeadline ? 'error' : ''}`}
                value={votingDeadline}
                onChange={(e) => setVotingDeadline(e.target.value)}
              />
              {errors.votingDeadline && (
                <span className="create-bulletin-form-error">{errors.votingDeadline}</span>
              )}
            </div>
          )}

          {/* 奖励提示 */}
          <div className="create-bulletin-form-reward">
            <div className="create-bulletin-form-reward-icon">🎁</div>
            <div className="create-bulletin-form-reward-content">
              <div className="create-bulletin-form-reward-title">发布奖励</div>
              <div className="create-bulletin-form-reward-desc">
                {type === 'announcement' ? (
                  <>发布公告将获得 <span className="create-bulletin-form-reward-stars">50⭐</span> 和 <span className="create-bulletin-form-reward-exp">5EXP</span></>
                ) : (
                  <>发布提案将获得 <span className="create-bulletin-form-reward-stars">100⭐</span> 和 <span className="create-bulletin-form-reward-exp">10EXP</span></>
                )}
              </div>
            </div>
          </div>

          <div className="create-bulletin-form-actions">
            <button type="button" className="create-bulletin-form-cancel" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="create-bulletin-form-submit">
              发布{type === 'announcement' ? '公告' : '提案'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}


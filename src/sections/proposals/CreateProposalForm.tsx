import { useState } from 'react'
import Card from '@components/Card'
import { ProposalCategory } from '@core/types'
import './CreateProposalForm.css'

/**
 * 发布提案表单组件
 */

interface CreateProposalFormProps {
  onClose: () => void
  onSubmit: (proposalData: {
    title: string
    description: string
    category: ProposalCategory
    votingDeadline: Date
  }) => void
}

const categoryOptions: { value: ProposalCategory; label: string }[] = [
  { value: 'rule', label: '规则制定' },
  { value: 'budget', label: '预算管理' },
  { value: 'event', label: '活动策划' },
  { value: 'improvement', label: '改进建议' },
  { value: 'other', label: '其他' },
]

export default function CreateProposalForm({ onClose, onSubmit }: CreateProposalFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<ProposalCategory>('other')
  const [votingDeadline, setVotingDeadline] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = '请输入提案标题'
    }

    if (!description.trim()) {
      newErrors.description = '请输入提案描述'
    }

    if (!votingDeadline) {
      newErrors.votingDeadline = '请选择投票截止时间'
    } else if (new Date(votingDeadline) < new Date()) {
      newErrors.votingDeadline = '投票截止时间不能早于当前时间'
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
      category,
      votingDeadline: new Date(votingDeadline),
    })
  }

  return (
    <div className="create-proposal-overlay" onClick={onClose}>
      <Card className="create-proposal-form-card" onClick={(e) => e.stopPropagation()}>
        <div className="create-proposal-form-header">
          <h3 className="create-proposal-form-title">发布提案</h3>
          <button className="create-proposal-form-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="create-proposal-form">
          <div className="create-proposal-form-group">
            <label className="create-proposal-form-label">
              提案标题 <span className="required">*</span>
            </label>
            <input
              type="text"
              className={`create-proposal-form-input ${errors.title ? 'error' : ''}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入提案标题"
            />
            {errors.title && (
              <span className="create-proposal-form-error">{errors.title}</span>
            )}
          </div>

          <div className="create-proposal-form-group">
            <label className="create-proposal-form-label">
              提案类别 <span className="required">*</span>
            </label>
            <select
              className="create-proposal-form-select"
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

          <div className="create-proposal-form-group">
            <label className="create-proposal-form-label">
              提案描述 <span className="required">*</span>
            </label>
            <textarea
              className={`create-proposal-form-textarea ${errors.description ? 'error' : ''}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请详细描述您的提案内容"
              rows={6}
            />
            {errors.description && (
              <span className="create-proposal-form-error">{errors.description}</span>
            )}
          </div>

          <div className="create-proposal-form-group">
            <label className="create-proposal-form-label">
              投票截止时间 <span className="required">*</span>
            </label>
            <input
              type="datetime-local"
              className={`create-proposal-form-input ${errors.votingDeadline ? 'error' : ''}`}
              value={votingDeadline}
              onChange={(e) => setVotingDeadline(e.target.value)}
            />
            {errors.votingDeadline && (
              <span className="create-proposal-form-error">{errors.votingDeadline}</span>
            )}
          </div>

          <div className="create-proposal-form-reward">
            <div className="create-proposal-form-reward-icon">🎁</div>
            <div className="create-proposal-form-reward-content">
              <div className="create-proposal-form-reward-title">发布奖励</div>
              <div className="create-proposal-form-reward-desc">
                发布提案将获得 <span className="create-proposal-form-reward-stars">100⭐</span> 和 <span className="create-proposal-form-reward-exp">10EXP</span>
              </div>
            </div>
          </div>

          <div className="create-proposal-form-actions">
            <button type="button" className="create-proposal-form-cancel" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="create-proposal-form-submit">
              发布提案
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}


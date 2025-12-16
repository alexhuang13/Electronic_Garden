import { useState } from 'react'
import { Comment } from '@core/types'
import './CommentSection.css'

/**
 * 评论组件
 */

interface CommentSectionProps {
  comments: Comment[]
  onAddComment: (content: string) => void
}

export default function CommentSection({ comments, onAddComment }: CommentSectionProps) {
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!commentText.trim()) {
      return
    }

    setIsSubmitting(true)
    try {
      onAddComment(commentText.trim())
      setCommentText('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="comment-section">
      <h4 className="comment-section-title">评论 ({comments.length})</h4>

      {/* 评论输入框 */}
      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          className="comment-input"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="写下您的评论..."
          rows={3}
        />
        <button
          type="submit"
          className="comment-submit-btn"
          disabled={!commentText.trim() || isSubmitting}
        >
          发表评论
        </button>
      </form>

      {/* 评论列表 */}
      <div className="comment-list">
        {comments.length === 0 ? (
          <div className="comment-empty">暂无评论，快来发表第一条吧！</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{comment.userName}</span>
                <span className="comment-date">{formatDate(comment.createdAt || new Date())}</span>
              </div>
              <div className="comment-content">{comment.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}




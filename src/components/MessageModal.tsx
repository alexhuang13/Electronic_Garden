import React, { useState } from 'react'
import Card from '@components/Card'
import './MessageModal.css'

interface MessageModalProps {
  friendName: string
  onSend: (message: string) => void
  onClose: () => void
}

export default function MessageModal({ friendName, onSend, onClose }: MessageModalProps) {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage) {
      return
    }
    onSend(trimmedMessage)
    setMessage('')
    onClose()
  }

  return (
    <div className="message-modal-overlay" onClick={onClose}>
      <Card className="message-modal" onClick={(e?: React.MouseEvent<HTMLDivElement>) => e?.stopPropagation()}>
        <div className="message-modal-header">
          <h3 className="message-modal-title">给 {friendName} 留言</h3>
          <button className="message-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="message-modal-content">
          <textarea
            className="message-modal-input"
            placeholder="输入留言内容..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            maxLength={200}
          />
          <div className="message-modal-footer">
            <span className="message-modal-count">{message.length}/200</span>
            <div className="message-modal-actions">
              <button 
                className="message-modal-cancel"
                onClick={onClose}
              >
                取消
              </button>
              <button 
                className="message-modal-send"
                onClick={handleSend}
                disabled={!message.trim()}
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}


import { useState, useEffect } from 'react'
import Card from '@components/Card'
import './FriendSelectModal.css'

interface Friend {
  id: string
  name: string
  avatar?: string
  level: number
  points: number
  joinDate: string
  lastActive?: string
}

interface FriendSelectModalProps {
  itemName: string
  onSelect: (friendName: string) => void
  onClose: () => void
}

export default function FriendSelectModal({ itemName, onSelect, onClose }: FriendSelectModalProps) {
  const [friends, setFriends] = useState<Friend[]>([])

  useEffect(() => {
    // 从localStorage加载好友列表
    const loadFriends = (): Friend[] => {
      const savedFriends = localStorage.getItem('friends')
      if (savedFriends) {
        try {
          return JSON.parse(savedFriends)
        } catch (e) {
          return []
        }
      }
      return []
    }
    setFriends(loadFriends())
  }, [])

  const handleSelectFriend = (friendName: string) => {
    onSelect(friendName)
    onClose()
  }

  return (
    <div className="friend-select-overlay" onClick={onClose}>
      <Card className="friend-select-modal" onClick={(e?: React.MouseEvent) => e?.stopPropagation()}>
        <div className="friend-select-header">
          <h3 className="friend-select-title">选择要赠送的好友</h3>
          <button className="friend-select-close" onClick={onClose}>×</button>
        </div>
        <div className="friend-select-content">
          <p className="friend-select-subtitle">将 {itemName} 赠送给：</p>
          {friends.length === 0 ? (
            <div className="friend-select-empty">
              <p>您还没有好友，先去添加好友吧！</p>
            </div>
          ) : (
            <div className="friend-select-list">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="friend-select-item"
                  onClick={() => handleSelectFriend(friend.name)}
                >
                  <div className="friend-select-avatar">
                    {friend.name.charAt(0)}
                  </div>
                  <div className="friend-select-info">
                    <div className="friend-select-name">{friend.name}</div>
                    <div className="friend-select-details">
                      <span>Lv.{friend.level}</span>
                      <span>⭐ {friend.points.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}


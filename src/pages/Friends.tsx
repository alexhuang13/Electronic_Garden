import { useState } from 'react'
import Card from '@components/Card'
import '@styles/pages.css'
import './Friends.css'

/**
 * 👥 我的好友页面
 *
 * 功能：
 * - 显示好友列表
 * - 添加好友
 * - 查看好友信息
 * - 赠送物品给好友
 */

interface Friend {
  id: string
  name: string
  avatar?: string
  level: number
  points: number
  joinDate: string
  lastActive?: string
}

export default function Friends() {
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

  const [friends, setFriends] = useState<Friend[]>(loadFriends())
  const [showAddFriendForm, setShowAddFriendForm] = useState(false)
  const [newFriendName, setNewFriendName] = useState('')

  // 保存好友列表到localStorage
  const saveFriends = (friendsList: Friend[]) => {
    localStorage.setItem('friends', JSON.stringify(friendsList))
  }

  // 添加好友
  const handleAddFriend = () => {
    const trimmedName = newFriendName.trim()
    if (!trimmedName) {
      alert('请输入好友名称！')
      return
    }

    // 检查是否已经是好友
    if (friends.some(f => f.name === trimmedName)) {
      alert('该用户已经是您的好友！')
      return
    }

    // 创建新好友
    const newFriend: Friend = {
      id: Date.now().toString(),
      name: trimmedName,
      level: Math.floor(Math.random() * 10) + 1,
      points: Math.floor(Math.random() * 5000) + 1000,
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: '刚刚',
    }

    const updatedFriends = [...friends, newFriend]
    setFriends(updatedFriends)
    saveFriends(updatedFriends)
    setNewFriendName('')
    setShowAddFriendForm(false)
    alert(`成功添加好友：${trimmedName}`)
  }

  // 删除好友
  const handleRemoveFriend = (friendId: string) => {
    if (confirm('确定要删除这位好友吗？')) {
      const updatedFriends = friends.filter(f => f.id !== friendId)
      setFriends(updatedFriends)
      saveFriends(updatedFriends)
    }
  }

  // 赠送物品给好友
  const handleGiftToFriend = (friendName: string) => {
    alert(`赠送功能：选择要赠送给 ${friendName} 的物品`)
    // 这里可以打开物品选择弹窗
  }

  return (
    <div className="page friends-page">
      <section className="page-section">
        <div className="friends-header">
          <h2 className="section-title">我的好友</h2>
          <button 
            className="friends-add-btn"
            onClick={() => setShowAddFriendForm(true)}
          >
            <span className="friends-add-icon">➕</span>
            <span>添加好友</span>
          </button>
        </div>

        {showAddFriendForm && (
          <Card className="friends-add-form">
            <div className="friends-add-form-header">
              <h3>添加好友</h3>
              <button 
                className="friends-add-form-close"
                onClick={() => {
                  setShowAddFriendForm(false)
                  setNewFriendName('')
                }}
              >
                ×
              </button>
            </div>
            <div className="friends-add-form-content">
              <input
                type="text"
                className="friends-add-form-input"
                placeholder="请输入好友名称"
                value={newFriendName}
                onChange={(e) => setNewFriendName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddFriend()
                  }
                }}
              />
              <div className="friends-add-form-actions">
                <button 
                  className="friends-add-form-cancel"
                  onClick={() => {
                    setShowAddFriendForm(false)
                    setNewFriendName('')
                  }}
                >
                  取消
                </button>
                <button 
                  className="friends-add-form-submit"
                  onClick={handleAddFriend}
                >
                  添加
                </button>
              </div>
            </div>
          </Card>
        )}

        {friends.length === 0 ? (
          <div className="friends-empty">
            <div className="friends-empty-icon">👥</div>
            <p className="friends-empty-text">还没有好友，快去添加吧！</p>
          </div>
        ) : (
          <div className="friends-list">
            {friends.map((friend) => (
              <Card key={friend.id} className="friend-card">
                <div className="friend-card-content">
                  <div className="friend-avatar">
                    <div className="friend-avatar-placeholder">
                      {friend.name.charAt(0)}
                    </div>
                  </div>
                  <div className="friend-info">
                    <div className="friend-name">{friend.name}</div>
                    <div className="friend-details">
                      <span className="friend-level">Lv.{friend.level}</span>
                      <span className="friend-points">⭐ {friend.points.toLocaleString()}</span>
                    </div>
                    {friend.lastActive && (
                      <div className="friend-active">最后活跃：{friend.lastActive}</div>
                    )}
                  </div>
                  <div className="friend-actions">
                    <button 
                      className="friend-action-btn friend-action-gift"
                      onClick={() => handleGiftToFriend(friend.name)}
                      title="赠送物品"
                    >
                      赠送
                    </button>
                    <button 
                      className="friend-action-btn friend-action-remove"
                      onClick={() => handleRemoveFriend(friend.id)}
                      title="删除好友"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}


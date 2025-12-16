import { useState } from 'react'
import Card from '@components/Card'
import ItemSelectModal from '@components/ItemSelectModal'
import MessageModal from '@components/MessageModal'
import { showSuccess, showWarning, showReward } from '../utils/notification'
import { incrementGiftCount } from '@modules/badgeManager'
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
  messages?: Array<{
    id: string
    content: string
    sentAt: string
  }>
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
  const [showItemSelect, setShowItemSelect] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)

  // 保存好友列表到localStorage
  const saveFriends = (friendsList: Friend[]) => {
    localStorage.setItem('friends', JSON.stringify(friendsList))
  }

  // 添加好友
  const handleAddFriend = () => {
    const trimmedName = newFriendName.trim()
    if (!trimmedName) {
      showWarning('请输入好友名称！', '提示')
      return
    }

    // 检查是否已经是好友
    if (friends.some(f => f.name === trimmedName)) {
      showWarning('该用户已经是您的好友！', '提示')
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
      messages: [],
    }

    const updatedFriends = [...friends, newFriend]
    setFriends(updatedFriends)
    saveFriends(updatedFriends)
    setNewFriendName('')
    setShowAddFriendForm(false)
    showSuccess(`成功添加好友：${trimmedName}`, '添加成功')
  }

  // 删除好友
  const handleRemoveFriend = (friendId: string) => {
    if (window.confirm('确定要删除这位好友吗？')) {
      const updatedFriends = friends.filter(f => f.id !== friendId)
      setFriends(updatedFriends)
      saveFriends(updatedFriends)
      showSuccess('好友已删除', '删除成功')
    }
  }

  // 打开物品选择弹窗
  const handleGiftToFriend = (friend: Friend) => {
    setSelectedFriend(friend)
    setShowItemSelect(true)
  }

  // 选择物品后，确认赠送
  const handleSelectItem = (itemId: string, itemName: string) => {
    if (!selectedFriend) return
    
    // 检查物品数量
    let currentCount: number
    if (itemId === 'nameCard') {
      currentCount = parseInt(localStorage.getItem('nameCards') || '0', 10)
    } else {
      currentCount = parseInt(localStorage.getItem(`shopItem_${itemId}`) || '0', 10)
    }
    
    if (currentCount <= 0) {
      showWarning('物品数量不足！', '提示')
      setShowItemSelect(false)
      return
    }

    setShowItemSelect(false)
    
    // 扣除物品
    const newCount = currentCount - 1
    if (itemId === 'nameCard') {
      localStorage.setItem('nameCards', newCount.toString())
    } else {
      localStorage.setItem(`shopItem_${itemId}`, newCount.toString())
    }
    
    // 触发背包更新事件
    window.dispatchEvent(new CustomEvent('inventoryUpdated'))

    // 检查赠人玫瑰徽章
    const newBadge = incrementGiftCount()
    
    // 显示奖励通知
    if (newBadge) {
      showReward(
        `已将${itemName}赠送给 ${selectedFriend.name}！`,
        {
          badge: {
            name: newBadge.name,
            icon: newBadge.icon,
          },
          stars: 500,
          exp: 50,
        },
        '赠送成功'
      )
    } else {
      showSuccess(`已将${itemName}赠送给 ${selectedFriend.name}！`, '赠送成功')
    }
    
    setSelectedFriend(null)
  }

  // 发送留言
  const handleSendMessage = (message: string) => {
    if (!selectedFriend) return

    const messageData = {
      id: Date.now().toString(),
      content: message,
      sentAt: new Date().toISOString(),
    }

    const updatedFriends = friends.map(friend => {
      if (friend.id === selectedFriend.id) {
        return {
          ...friend,
          messages: [...(friend.messages || []), messageData],
        }
      }
      return friend
    })

    setFriends(updatedFriends)
    saveFriends(updatedFriends)
    showSuccess('留言已发送', '发送成功')
    setSelectedFriend(null)
  }

  // 打开留言弹窗
  const handleMessageFriend = (friend: Friend) => {
    setSelectedFriend(friend)
    setShowMessageModal(true)
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
                      className="friend-action-btn friend-action-message"
                      onClick={() => handleMessageFriend(friend)}
                      title="留言"
                    >
                      留言
                    </button>
                    <button 
                      className="friend-action-btn friend-action-gift"
                      onClick={() => handleGiftToFriend(friend)}
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

      {/* 物品选择弹窗 */}
      {showItemSelect && (
        <ItemSelectModal
          onSelect={handleSelectItem}
          onClose={() => {
            setShowItemSelect(false)
            setSelectedFriend(null)
          }}
        />
      )}

      {/* 留言弹窗 */}
      {showMessageModal && selectedFriend && (
        <MessageModal
          friendName={selectedFriend.name}
          onSend={handleSendMessage}
          onClose={() => {
            setShowMessageModal(false)
            setSelectedFriend(null)
          }}
        />
      )}
    </div>
  )
}


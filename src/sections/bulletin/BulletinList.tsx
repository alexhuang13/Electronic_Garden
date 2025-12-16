import { useState, useEffect } from 'react'
import { BulletinItem, Announcement, Proposal, ProposalCategory, ID } from '@core/types'
import Card from '@components/Card'
import { showWarning } from '../../utils/notification'
import './BulletinList.css'

/**
 * 公告栏列表组件
 * 统一显示公告和提案
 */

interface BulletinListProps {
  onCreateBulletin: () => void
}

const categoryLabels: Record<ProposalCategory, string> = {
  rule: '规则制定',
  budget: '预算管理',
  event: '活动策划',
  improvement: '改进建议',
  other: '其他',
}

const statusLabels: Record<Proposal['status'], string> = {
  draft: '草稿',
  voting: '投票中',
  approved: '已通过',
  rejected: '已拒绝',
  implemented: '已实施',
}

const priorityLabels: Record<NonNullable<Announcement['priority']>, { label: string; icon: string; color: string }> = {
  normal: { label: '普通', icon: '📌', color: '#6b7280' },
  important: { label: '重要', icon: '⚠️', color: '#f59e0b' },
  urgent: { label: '紧急', icon: '🚨', color: '#ef4444' },
}

// 从localStorage加载公告
const loadAnnouncementsFromStorage = (): Announcement[] => {
  const saved = localStorage.getItem('userAnnouncements')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      return parsed.map((announcement: any) => ({
        ...announcement,
        createdAt: announcement.createdAt ? new Date(announcement.createdAt) : new Date(),
      }))
    } catch (e) {
      return []
    }
  }
  return []
}

// 保存公告到localStorage
const saveAnnouncementsToStorage = (announcements: Announcement[]) => {
  localStorage.setItem('userAnnouncements', JSON.stringify(announcements))
}

// 从localStorage加载提案
const loadProposalsFromStorage = (): Proposal[] => {
  const saved = localStorage.getItem('userProposals')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      return parsed.map((proposal: any) => ({
        ...proposal,
        type: 'proposal' as const, // 确保有type字段
        votingDeadline: new Date(proposal.votingDeadline),
        createdAt: proposal.createdAt ? new Date(proposal.createdAt) : new Date(),
      }))
    } catch (e) {
      return []
    }
  }
  return []
}

// 保存提案到localStorage
const saveProposalsToStorage = (proposals: Proposal[]) => {
  localStorage.setItem('userProposals', JSON.stringify(proposals))
}

export default function BulletinList({ onCreateBulletin }: BulletinListProps) {
  const [items, setItems] = useState<BulletinItem[]>([])
  const currentUserId = 'currentUser'

  const loadItems = () => {
    const announcements = loadAnnouncementsFromStorage()
    const proposals = loadProposalsFromStorage()
    
    // 添加默认公告（如果不存在）
    const defaultAnnouncement: Announcement = {
      id: 'default-community-meeting',
      type: 'announcement',
      title: '社区会议通知',
      content: '本周社区会议将于周六下午2点举行，欢迎参加！',
      publishedBy: 'system',
      publishedByName: '系统管理员',
      priority: 'important',
      isPinned: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    // 检查是否已存在默认公告
    const hasDefaultAnnouncement = announcements.some(a => a.id === defaultAnnouncement.id)
    if (!hasDefaultAnnouncement) {
      announcements.unshift(defaultAnnouncement)
      saveAnnouncementsToStorage(announcements)
    }
    
    // 合并并排序：置顶公告 > 其他公告和提案（按时间倒序）
    const allItems: BulletinItem[] = [
      ...announcements.filter(a => a.isPinned),
      ...announcements.filter(a => !a.isPinned),
      ...proposals,
    ].sort((a, b) => {
      // 置顶的排在前面
      if ('isPinned' in a && a.isPinned && (!('isPinned' in b) || !b.isPinned)) return -1
      if ('isPinned' in b && b.isPinned && (!('isPinned' in a) || !a.isPinned)) return 1
      // 其他按创建时间倒序
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    })
    
    setItems(allItems)
  }

  useEffect(() => {
    loadItems()
  }, [])

  // 监听更新事件
  useEffect(() => {
    const handleUpdate = () => {
      loadItems()
    }

    window.addEventListener('announcementUpdated', handleUpdate as EventListener)
    window.addEventListener('proposalUpdated', handleUpdate as EventListener)
    return () => {
      window.removeEventListener('announcementUpdated', handleUpdate as EventListener)
      window.removeEventListener('proposalUpdated', handleUpdate as EventListener)
    }
  }, [])

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // 处理提案投票
  const handleVote = (proposalId: ID, choice: 'approve' | 'reject') => {
    const proposals = loadProposalsFromStorage()
    const proposalIndex = proposals.findIndex(p => p.id === proposalId)
    
    if (proposalIndex === -1) return

    const proposal = proposals[proposalIndex]
    
    if (new Date(proposal.votingDeadline) < new Date()) {
      showWarning('投票已截止', '提示')
      return
    }

    const existingVoteIndex = proposal.votes?.findIndex(vote => vote.userId === currentUserId) ?? -1
    
    if (existingVoteIndex >= 0) {
      proposal.votes[existingVoteIndex] = {
        userId: currentUserId,
        choice,
        votedAt: new Date(),
      }
    } else {
      if (!proposal.votes) {
        proposal.votes = []
      }
      proposal.votes.push({
        userId: currentUserId,
        choice,
        votedAt: new Date(),
      })
    }

    const approveCount = proposal.votes.filter(v => v.choice === 'approve').length
    const rejectCount = proposal.votes.filter(v => v.choice === 'reject').length

    if (approveCount >= proposal.requiredVotes && proposal.status === 'voting') {
      proposal.status = 'approved'
    } else if (rejectCount >= proposal.requiredVotes && proposal.status === 'voting') {
      proposal.status = 'rejected'
    }

    proposals[proposalIndex] = proposal
    saveProposalsToStorage(proposals)
    window.dispatchEvent(new CustomEvent('proposalUpdated'))
    loadItems()
  }

  const getUserVote = (proposal: Proposal): 'approve' | 'reject' | null => {
    const userVote = proposal.votes?.find(vote => vote.userId === currentUserId)
    if (!userVote) return null
    return userVote.choice === 'approve' ? 'approve' : 'reject'
  }

  const getVoteStats = (proposal: Proposal) => {
    const votes = proposal.votes || []
    const approveCount = votes.filter(v => v.choice === 'approve').length
    const rejectCount = votes.filter(v => v.choice === 'reject').length
    return { approveCount, rejectCount, totalVotes: votes.length }
  }

  if (items.length === 0) {
    return (
      <div className="bulletin-list-empty">
        <p>暂无内容</p>
        <button className="bulletin-list-create-btn" onClick={onCreateBulletin}>
          <span className="bulletin-list-create-icon">➕</span>
          <span>发布第一条内容</span>
        </button>
      </div>
    )
  }

  return (
    <div className="bulletin-list">
      {items.map((item) => {
        // 渲染公告
        if (item.type === 'announcement') {
          const announcement = item as Announcement
          const priorityInfo = priorityLabels[announcement.priority || 'normal']
          
          return (
            <Card key={announcement.id} className={`bulletin-card announcement-card ${announcement.isPinned ? 'pinned' : ''}`}>
              {announcement.isPinned && (
                <div className="bulletin-pinned-badge">📌 置顶</div>
              )}
              <div className="bulletin-card-header">
                <div className="bulletin-card-title-section">
                  <h4 className="bulletin-card-title">{announcement.title}</h4>
                  <span className="bulletin-card-type-badge announcement-badge">
                    📢 公告
                  </span>
                  <span 
                    className="bulletin-card-priority"
                    style={{ color: priorityInfo.color }}
                  >
                    {priorityInfo.icon} {priorityInfo.label}
                  </span>
                </div>
              </div>
              <p className="bulletin-card-content">{announcement.content}</p>
              <div className="bulletin-card-footer">
                <span className="bulletin-card-info">
                  发布时间：{formatDate(announcement.createdAt || new Date())}
                </span>
                {announcement.publishedByName && (
                  <span className="bulletin-card-author">
                    发布人：{announcement.publishedByName}
                  </span>
                )}
              </div>
            </Card>
          )
        }

        // 渲染提案
        const proposal = item as Proposal
        const userVote = getUserVote(proposal)
        const voteStats = getVoteStats(proposal)
        const isVoting = proposal.status === 'voting'
        const isExpired = new Date(proposal.votingDeadline) < new Date()
        const canVote = isVoting && !isExpired

        return (
          <Card key={proposal.id} className="bulletin-card proposal-card">
            <div className="bulletin-card-header">
              <div className="bulletin-card-title-section">
                <h4 className="bulletin-card-title">{proposal.title}</h4>
                <span className="bulletin-card-type-badge proposal-badge">
                  📋 提案
                </span>
                <span className={`bulletin-card-category category-${proposal.category}`}>
                  {categoryLabels[proposal.category]}
                </span>
              </div>
              <span className={`bulletin-card-status status-${proposal.status}`}>
                {statusLabels[proposal.status]}
              </span>
            </div>

            <p className="bulletin-card-content">{proposal.description}</p>

            {/* 投票统计 */}
            <div className="bulletin-vote-stats">
              <div className="bulletin-vote-stat-item">
                <span className="bulletin-vote-stat-label">赞成：</span>
                <span className="bulletin-vote-stat-value bulletin-vote-approve">
                  {voteStats.approveCount}
                </span>
              </div>
              <div className="bulletin-vote-stat-item">
                <span className="bulletin-vote-stat-label">反对：</span>
                <span className="bulletin-vote-stat-value bulletin-vote-reject">
                  {voteStats.rejectCount}
                </span>
              </div>
            </div>

            {/* 投票按钮 */}
            {canVote && (
              <div className="bulletin-vote-actions">
                <button
                  className={`bulletin-vote-btn bulletin-vote-approve-btn ${
                    userVote === 'approve' ? 'active' : ''
                  }`}
                  onClick={() => handleVote(proposal.id, 'approve')}
                >
                  <span className="bulletin-vote-btn-icon">👍</span>
                  <span>赞成</span>
                  {userVote === 'approve' && <span className="bulletin-vote-check">✓</span>}
                </button>
                <button
                  className={`bulletin-vote-btn bulletin-vote-reject-btn ${
                    userVote === 'reject' ? 'active' : ''
                  }`}
                  onClick={() => handleVote(proposal.id, 'reject')}
                >
                  <span className="bulletin-vote-btn-icon">👎</span>
                  <span>反对</span>
                  {userVote === 'reject' && <span className="bulletin-vote-check">✓</span>}
                </button>
              </div>
            )}

            {!canVote && userVote && (
              <div className="bulletin-vote-status">
                {isExpired ? (
                  <span className="bulletin-vote-status-text">投票已截止</span>
                ) : (
                  <span className="bulletin-vote-status-text">
                    您已投票：<span className={userVote === 'approve' ? 'bulletin-vote-approve' : 'bulletin-vote-reject'}>
                      {userVote === 'approve' ? '赞成' : '反对'}
                    </span>
                  </span>
                )}
              </div>
            )}

            <div className="bulletin-card-footer">
              <span className="bulletin-card-info">
                投票截止：{formatDate(proposal.votingDeadline)}
              </span>
            </div>
          </Card>
        )
      })}
    </div>
  )
}


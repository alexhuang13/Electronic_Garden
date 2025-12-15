import { useState, useEffect } from 'react'
import { Proposal, ProposalCategory, ID } from '@core/types'
import Card from '@components/Card'
import './ProposalList.css'

/**
 * 提案列表组件
 */

interface ProposalListProps {
  onCreateProposal: () => void
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

// 从localStorage加载提案
const loadProposalsFromStorage = (): Proposal[] => {
  const savedProposals = localStorage.getItem('userProposals')
  if (savedProposals) {
    try {
      const parsed = JSON.parse(savedProposals)
      const proposals = parsed.map((proposal: any) => ({
        ...proposal,
        votingDeadline: new Date(proposal.votingDeadline),
        createdAt: proposal.createdAt ? new Date(proposal.createdAt) : new Date(),
      }))
      
      // 过滤掉包含"削减美国军事经费"的提案
      const filteredProposals = proposals.filter((proposal: Proposal) => {
        const title = proposal.title || ''
        const description = proposal.description || ''
        return !title.includes('削减美国军事经费') && !description.includes('削减美国军事经费')
      })
      
      // 如果过滤后的数量不同，保存更新后的数据
      if (filteredProposals.length !== proposals.length) {
        saveProposalsToStorage(filteredProposals)
      }
      
      return filteredProposals
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

export default function ProposalList({ onCreateProposal }: ProposalListProps) {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const currentUserId = 'currentUser' // 当前用户ID

  useEffect(() => {
    const loadedProposals = loadProposalsFromStorage()
    setProposals(loadedProposals)
  }, [])

  // 监听提案更新事件
  useEffect(() => {
    const handleProposalUpdate = () => {
      const loadedProposals = loadProposalsFromStorage()
      setProposals(loadedProposals)
    }

    window.addEventListener('proposalUpdated', handleProposalUpdate as EventListener)
    return () => {
      window.removeEventListener('proposalUpdated', handleProposalUpdate as EventListener)
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

  // 检查用户是否已投票
  const getUserVote = (proposal: Proposal): 'approve' | 'reject' | null => {
    const userVote = proposal.votes?.find(vote => vote.userId === currentUserId)
    if (!userVote) return null
    return userVote.choice === 'approve' ? 'approve' : 'reject'
  }

  // 处理投票
  const handleVote = (proposalId: ID, choice: 'approve' | 'reject') => {
    const proposals = loadProposalsFromStorage()
    const proposalIndex = proposals.findIndex(p => p.id === proposalId)
    
    if (proposalIndex === -1) return

    const proposal = proposals[proposalIndex]
    
    // 检查是否已过期
    if (new Date(proposal.votingDeadline) < new Date()) {
      alert('投票已截止')
      return
    }

    // 检查是否已投票
    const existingVoteIndex = proposal.votes?.findIndex(vote => vote.userId === currentUserId) ?? -1
    
    if (existingVoteIndex >= 0) {
      // 如果已投票，更新投票
      proposal.votes[existingVoteIndex] = {
        userId: currentUserId,
        choice,
        votedAt: new Date(),
      }
    } else {
      // 如果未投票，添加新投票
      if (!proposal.votes) {
        proposal.votes = []
      }
      proposal.votes.push({
        userId: currentUserId,
        choice,
        votedAt: new Date(),
      })
    }

    // 检查是否达到所需票数
    const approveCount = proposal.votes.filter(v => v.choice === 'approve').length
    const rejectCount = proposal.votes.filter(v => v.choice === 'reject').length
    const totalVotes = proposal.votes.length

    // 如果赞成票达到所需票数，自动通过
    if (approveCount >= proposal.requiredVotes && proposal.status === 'voting') {
      proposal.status = 'approved'
    }
    // 如果反对票超过所需票数，自动拒绝
    else if (rejectCount >= proposal.requiredVotes && proposal.status === 'voting') {
      proposal.status = 'rejected'
    }

    proposals[proposalIndex] = proposal
    saveProposalsToStorage(proposals)
    
    // 触发更新事件
    window.dispatchEvent(new CustomEvent('proposalUpdated'))
    
    // 更新本地状态
    setProposals(proposals)
  }

  // 统计投票数
  const getVoteStats = (proposal: Proposal) => {
    const votes = proposal.votes || []
    const approveCount = votes.filter(v => v.choice === 'approve').length
    const rejectCount = votes.filter(v => v.choice === 'reject').length
    return { approveCount, rejectCount, totalVotes: votes.length }
  }

  if (proposals.length === 0) {
    return (
      <div className="proposal-list-empty">
        <p>暂无提案</p>
        <button className="proposal-list-create-btn" onClick={onCreateProposal}>
          <span className="proposal-list-create-icon">➕</span>
          <span>发布第一个提案</span>
        </button>
      </div>
    )
  }

  return (
    <div className="proposal-list">
      {proposals.map((proposal) => {
        const userVote = getUserVote(proposal)
        const voteStats = getVoteStats(proposal)
        const isVoting = proposal.status === 'voting'
        const isExpired = new Date(proposal.votingDeadline) < new Date()
        const canVote = isVoting && !isExpired

        return (
          <Card key={proposal.id} className="proposal-card">
            <div className="proposal-card-header">
              <div className="proposal-card-title-section">
                <h4 className="proposal-card-title">{proposal.title}</h4>
                <span className={`proposal-card-category category-${proposal.category}`}>
                  {categoryLabels[proposal.category]}
                </span>
              </div>
              <span className={`proposal-card-status status-${proposal.status}`}>
                {statusLabels[proposal.status]}
              </span>
            </div>

            <p className="proposal-card-description">{proposal.description}</p>

            {/* 投票统计 */}
            <div className="proposal-vote-stats">
              <div className="proposal-vote-stat-item">
                <span className="proposal-vote-stat-label">赞成：</span>
                <span className="proposal-vote-stat-value proposal-vote-approve">
                  {voteStats.approveCount}
                </span>
              </div>
              <div className="proposal-vote-stat-item">
                <span className="proposal-vote-stat-label">反对：</span>
                <span className="proposal-vote-stat-value proposal-vote-reject">
                  {voteStats.rejectCount}
                </span>
              </div>
            </div>

            {/* 投票按钮 */}
            {canVote && (
              <div className="proposal-vote-actions">
                <button
                  className={`proposal-vote-btn proposal-vote-approve-btn ${
                    userVote === 'approve' ? 'active' : ''
                  }`}
                  onClick={() => handleVote(proposal.id, 'approve')}
                >
                  <span className="proposal-vote-btn-icon">👍</span>
                  <span>赞成</span>
                  {userVote === 'approve' && <span className="proposal-vote-check">✓</span>}
                </button>
                <button
                  className={`proposal-vote-btn proposal-vote-reject-btn ${
                    userVote === 'reject' ? 'active' : ''
                  }`}
                  onClick={() => handleVote(proposal.id, 'reject')}
                >
                  <span className="proposal-vote-btn-icon">👎</span>
                  <span>反对</span>
                  {userVote === 'reject' && <span className="proposal-vote-check">✓</span>}
                </button>
              </div>
            )}

            {/* 已投票提示 */}
            {!canVote && userVote && (
              <div className="proposal-vote-status">
                {isExpired ? (
                  <span className="proposal-vote-status-text">投票已截止</span>
                ) : (
                  <span className="proposal-vote-status-text">
                    您已投票：<span className={userVote === 'approve' ? 'proposal-vote-approve' : 'proposal-vote-reject'}>
                      {userVote === 'approve' ? '赞成' : '反对'}
                    </span>
                  </span>
                )}
              </div>
            )}

            <div className="proposal-card-footer">
              <div className="proposal-card-info">
                <span className="proposal-card-info-item">
                  投票截止：{formatDate(proposal.votingDeadline)}
                </span>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}


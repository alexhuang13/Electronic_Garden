import { useState } from 'react'
import { checkHelpful } from '@modules/badgeManager'
import { Proposal, ProposalCategory, ExperienceShare } from '@core/types'
import ProposalList from '@sections/proposals/ProposalList'
import CreateProposalForm from '@sections/proposals/CreateProposalForm'
import ExperienceList from '@sections/experienceShare/ExperienceList'
import CreateExperienceForm from '@sections/experienceShare/CreateExperienceForm'
import SpeciesHandbook from '@sections/ecology/SpeciesHandbook'
import '@styles/pages.css'
import './Governance.css'

/**
 * ⚖️ 花园治理页面
 *
 * 功能：
 * - 提案与投票
 * - 种植经验分享
 * - 生态记录
 * - 培训与认证
 */

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

// 从localStorage加载经验分享
const loadExperiencesFromStorage = (): ExperienceShare[] => {
  const savedExperiences = localStorage.getItem('experienceShares')
  if (savedExperiences) {
    try {
      const parsed = JSON.parse(savedExperiences)
      const experiences = parsed.map((exp: any) => ({
        ...exp,
        createdAt: exp.createdAt ? new Date(exp.createdAt) : new Date(),
        comments: (exp.comments || []).map((comment: any) => ({
          ...comment,
          createdAt: comment.createdAt ? new Date(comment.createdAt) : new Date(),
        })),
      }))
      
      // 过滤掉包含"吃早饭不能吃午饭"的经验分享
      const filteredExperiences = experiences.filter((exp: ExperienceShare) => {
        const title = exp.title || ''
        const content = exp.content || ''
        return !title.includes('吃早饭不能吃午饭') && !content.includes('吃早饭不能吃午饭')
      })
      
      // 如果过滤后的数量不同，保存更新后的数据
      if (filteredExperiences.length !== experiences.length) {
        saveExperiencesToStorage(filteredExperiences)
      }
      
      return filteredExperiences
    } catch (e) {
      return []
    }
  }
  return []
}

// 保存经验分享到localStorage
const saveExperiencesToStorage = (experiences: ExperienceShare[]) => {
  localStorage.setItem('experienceShares', JSON.stringify(experiences))
}

export default function Governance() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showCreateExperienceForm, setShowCreateExperienceForm] = useState(false)

  const handleCreateProposal = (proposalData: {
    title: string
    description: string
    category: ProposalCategory
    votingDeadline: Date
  }) => {
    const proposals = loadProposalsFromStorage()
    const newProposal: Proposal = {
      id: Date.now(),
      title: proposalData.title,
      description: proposalData.description,
      proposedBy: 'currentUser', // 当前用户ID
      category: proposalData.category,
      status: 'voting',
      votingDeadline: proposalData.votingDeadline,
      votes: [],
      requiredVotes: 10, // 默认需要10票
      createdAt: new Date(),
    }

    const updatedProposals = [...proposals, newProposal]
    saveProposalsToStorage(updatedProposals)

    // 触发更新事件
    window.dispatchEvent(new CustomEvent('proposalUpdated'))

    // 发布提案奖励：100星星和10EXP
    const rewardStars = 100
    const rewardExp = 10

    // 获取当前数据
    const currentPoints = parseInt(localStorage.getItem('profilePoints') || '2420', 10)
    const currentLevel = parseInt(localStorage.getItem('profileLevel') || '5', 10)
    const currentExp = parseInt(localStorage.getItem('profileCurrentExp') || '320', 10)
    const maxExp = 500

    // 计算新的积分和经验值
    const newPoints = currentPoints + rewardStars
    let newCurrentExp = currentExp + rewardExp
    let newLevel = currentLevel
    let levelUp = false

    // 检查是否升级（经验值达到500）
    if (newCurrentExp >= maxExp) {
      newLevel += 1
      newCurrentExp = newCurrentExp - maxExp // 保留超出部分
      levelUp = true
    }

    // 更新发布提案次数
    const currentProposalTimes = parseInt(localStorage.getItem('profileProposalTimes') || '0', 10)
    const newProposalTimes = currentProposalTimes + 1

    // 保存到localStorage
    localStorage.setItem('profilePoints', newPoints.toString())
    localStorage.setItem('profileLevel', newLevel.toString())
    localStorage.setItem('profileCurrentExp', newCurrentExp.toString())
    localStorage.setItem('profileProposalTimes', newProposalTimes.toString())

    // 触发自定义事件，通知其他组件更新
    window.dispatchEvent(new CustomEvent('pointsUpdated', { 
      detail: { newPoints, newLevel, newCurrentExp, levelUp } 
    }))
    
    // 触发发布提案次数更新事件
    window.dispatchEvent(new CustomEvent('proposalTimesUpdated', { 
      detail: { newProposalTimes } 
    }))

    setShowCreateForm(false)

    // 显示奖励提示
    const rewardMessage = levelUp 
      ? `提案发布成功！\n获得 ${rewardStars}⭐ 和 ${rewardExp}EXP\n恭喜升级！Lv.${newLevel}` 
      : `提案发布成功！\n获得 ${rewardStars}⭐ 和 ${rewardExp}EXP`
    
    alert(rewardMessage)
  }

  const handleCreateExperience = (experienceData: {
    title: string
    content: string
  }) => {
    const experiences = loadExperiencesFromStorage()
    const newExperience: ExperienceShare = {
      id: Date.now(),
      title: experienceData.title,
      content: experienceData.content,
      authorId: 'currentUser',
      authorName: '花园守护者',
      comments: [],
      createdAt: new Date(),
    }

    const updatedExperiences = [newExperience, ...experiences]
    saveExperiencesToStorage(updatedExperiences)

    // 触发更新事件
    window.dispatchEvent(new CustomEvent('experienceUpdated'))

    // 发布经验分享奖励：200星星和10EXP
    const rewardStars = 200
    const rewardExp = 10

    // 获取当前数据
    const currentPoints = parseInt(localStorage.getItem('profilePoints') || '2420', 10)
    const currentLevel = parseInt(localStorage.getItem('profileLevel') || '5', 10)
    const currentExp = parseInt(localStorage.getItem('profileCurrentExp') || '320', 10)
    const maxExp = 500

    // 计算新的积分和经验值
    const newPoints = currentPoints + rewardStars
    let newCurrentExp = currentExp + rewardExp
    let newLevel = currentLevel
    let levelUp = false

    // 检查是否升级（经验值达到500）
    if (newCurrentExp >= maxExp) {
      newLevel += 1
      newCurrentExp = newCurrentExp - maxExp // 保留超出部分
      levelUp = true
    }

    // 更新分享经验次数
    const currentExperienceShareTimes = parseInt(localStorage.getItem('profileExperienceShareTimes') || '0', 10)
    const newExperienceShareTimes = currentExperienceShareTimes + 1

    // 保存到localStorage
    localStorage.setItem('profilePoints', newPoints.toString())
    localStorage.setItem('profileLevel', newLevel.toString())
    localStorage.setItem('profileCurrentExp', newCurrentExp.toString())
    localStorage.setItem('profileExperienceShareTimes', newExperienceShareTimes.toString())

    // 触发自定义事件，通知其他组件更新
    window.dispatchEvent(new CustomEvent('pointsUpdated', { 
      detail: { newPoints, newLevel, newCurrentExp, levelUp } 
    }))
    
    // 触发分享经验次数更新事件
    window.dispatchEvent(new CustomEvent('experienceShareTimesUpdated', { 
      detail: { newExperienceShareTimes } 
    }))

    // 检查乐于助人徽章
    const badge = checkHelpful()

    setShowCreateExperienceForm(false)

    // 显示奖励提示
    let rewardMessage = levelUp 
      ? `经验分享发布成功！\n获得 ${rewardStars}⭐ 和 ${rewardExp}EXP\n恭喜升级！Lv.${newLevel}` 
      : `经验分享发布成功！\n获得 ${rewardStars}⭐ 和 ${rewardExp}EXP`
    
    if (badge) {
      rewardMessage += `\n\n🎉 获得新徽章：${badge.name} ${badge.icon}\n✨ 徽章奖励：500⭐ + 50EXP`
    }
    
    alert(rewardMessage)
  }

  return (
    <div className="page governance-page">
      <section className="page-section">
        <div className="proposal-section-header">
          <h2 className="section-title">提案与投票</h2>
          <button className="proposal-create-btn" onClick={() => setShowCreateForm(true)}>
            <span className="proposal-create-icon">➕</span>
            <span>发布提案</span>
          </button>
        </div>

        {showCreateForm && (
          <CreateProposalForm
            onClose={() => setShowCreateForm(false)}
            onSubmit={handleCreateProposal}
          />
        )}

        <ProposalList onCreateProposal={() => setShowCreateForm(true)} />
      </section>

      <section className="page-section">
        <div className="proposal-section-header">
          <h2 className="section-title">种植经验分享</h2>
          <button className="proposal-create-btn" onClick={() => setShowCreateExperienceForm(true)}>
            <span className="proposal-create-icon">➕</span>
            <span>发布经验</span>
          </button>
        </div>

        {showCreateExperienceForm && (
          <CreateExperienceForm
            onClose={() => setShowCreateExperienceForm(false)}
            onSubmit={handleCreateExperience}
          />
        )}

        <ExperienceList onCreateExperience={() => setShowCreateExperienceForm(true)} />
      </section>

      <section className="page-section">
        <h2 className="section-title">生态记录</h2>
        <SpeciesHandbook />
      </section>

      <section className="page-section">
        <h2 className="section-title">培训与认证</h2>
        <div className="placeholder">
          培训与认证模块 - 待实现
        </div>
      </section>
    </div>
  )
}

import { useState } from 'react'
import { checkHelpful } from '@modules/badgeManager'
import { Proposal, ProposalCategory, Announcement, ExperienceShare } from '@core/types'
import BulletinList from '@sections/bulletin/BulletinList'
import CreateBulletinForm from '@sections/bulletin/CreateBulletinForm'
import ExperienceList from '@sections/experienceShare/ExperienceList'
import CreateExperienceForm from '@sections/experienceShare/CreateExperienceForm'
import SpeciesHandbook from '@sections/ecology/SpeciesHandbook'
import '@styles/pages.css'
import './Governance.css'

/**
 * ⚖️ 花园治理页面
 *
 * 功能：
 * - 公告栏（公告和提案）
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
        type: 'proposal' as const, // 确保有type字段
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

export default function Governance() {
  const [showCreateBulletinForm, setShowCreateBulletinForm] = useState(false)
  const [showCreateExperienceForm, setShowCreateExperienceForm] = useState(false)

  const handleCreateBulletin = (data: {
    type: 'announcement' | 'proposal'
    title: string
    content: string
    category?: ProposalCategory
    votingDeadline?: Date
    priority?: 'normal' | 'important' | 'urgent'
  }) => {
    if (data.type === 'announcement') {
      // 创建公告
      const announcements = loadAnnouncementsFromStorage()
      const newAnnouncement: Announcement = {
        id: Date.now(),
        title: data.title,
        content: data.content,
        publishedBy: 'currentUser',
        publishedByName: localStorage.getItem('profileName') || '花园守护者',
        type: 'announcement',
        priority: data.priority || 'normal',
        isPinned: false,
        createdAt: new Date(),
      }

      const updatedAnnouncements = [...announcements, newAnnouncement]
      saveAnnouncementsToStorage(updatedAnnouncements)
      window.dispatchEvent(new CustomEvent('announcementUpdated'))

      // 发布公告奖励：50星星和5EXP
      const rewardStars = 50
      const rewardExp = 5

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

      if (newCurrentExp >= maxExp) {
        newLevel += 1
        newCurrentExp = newCurrentExp - maxExp
        levelUp = true
      }

      localStorage.setItem('profilePoints', newPoints.toString())
      localStorage.setItem('profileLevel', newLevel.toString())
      localStorage.setItem('profileCurrentExp', newCurrentExp.toString())

      window.dispatchEvent(new CustomEvent('pointsUpdated', { 
        detail: { newPoints, newLevel, newCurrentExp, levelUp } 
      }))

      setShowCreateBulletinForm(false)

      const rewardMessage = levelUp 
        ? `公告发布成功！\n获得 ${rewardStars}⭐ 和 ${rewardExp}EXP\n恭喜升级！Lv.${newLevel}` 
        : `公告发布成功！\n获得 ${rewardStars}⭐ 和 ${rewardExp}EXP`
      
      alert(rewardMessage)
    } else {
      // 创建提案（保留原有逻辑）
      handleCreateProposal({
        title: data.title,
        description: data.content,
        category: data.category!,
        votingDeadline: data.votingDeadline!,
      })
    }
  }

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
      type: 'proposal',
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

    setShowCreateBulletinForm(false)

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
          <h2 className="section-title">公告栏</h2>
          <button className="proposal-create-btn" onClick={() => setShowCreateBulletinForm(true)}>
            <span className="proposal-create-icon">➕</span>
            <span>发布内容</span>
          </button>
        </div>

        {showCreateBulletinForm && (
          <CreateBulletinForm
            onClose={() => setShowCreateBulletinForm(false)}
            onSubmit={handleCreateBulletin}
          />
        )}

        <BulletinList onCreateBulletin={() => setShowCreateBulletinForm(true)} />
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

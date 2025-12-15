import { useState, useEffect } from 'react'
import { ExperienceShare, Comment, ID } from '@core/types'
import Card from '@components/Card'
import CommentSection from './CommentSection'
import './ExperienceList.css'

/**
 * 经验分享列表组件
 */

interface ExperienceListProps {
  onCreateExperience: () => void
}

// 从localStorage加载经验分享
const loadExperiencesFromStorage = (): ExperienceShare[] => {
  const savedExperiences = localStorage.getItem('experienceShares')
  if (savedExperiences) {
    try {
      const parsed = JSON.parse(savedExperiences)
      return parsed.map((exp: any) => ({
        ...exp,
        createdAt: exp.createdAt ? new Date(exp.createdAt) : new Date(),
        comments: (exp.comments || []).map((comment: any) => ({
          ...comment,
          createdAt: comment.createdAt ? new Date(comment.createdAt) : new Date(),
        })),
      }))
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

export default function ExperienceList({ onCreateExperience }: ExperienceListProps) {
  const [experiences, setExperiences] = useState<ExperienceShare[]>([])
  const currentUserId = 'currentUser'
  const currentUserName = '花园守护者'

  useEffect(() => {
    const loadedExperiences = loadExperiencesFromStorage()
    setExperiences(loadedExperiences)
  }, [])

  // 监听经验分享更新事件
  useEffect(() => {
    const handleExperienceUpdate = () => {
      const loadedExperiences = loadExperiencesFromStorage()
      setExperiences(loadedExperiences)
    }

    window.addEventListener('experienceUpdated', handleExperienceUpdate as EventListener)
    return () => {
      window.removeEventListener('experienceUpdated', handleExperienceUpdate as EventListener)
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

  const handleAddComment = (experienceId: ID, content: string) => {
    const experiences = loadExperiencesFromStorage()
    const experienceIndex = experiences.findIndex(exp => exp.id === experienceId)
    
    if (experienceIndex === -1) return

    const experience = experiences[experienceIndex]
    const newComment: Comment = {
      id: Date.now(),
      experienceId,
      userId: currentUserId,
      userName: currentUserName,
      content,
      createdAt: new Date(),
    }

    if (!experience.comments) {
      experience.comments = []
    }
    experience.comments.push(newComment)

    experiences[experienceIndex] = experience
    saveExperiencesToStorage(experiences)
    
    // 触发更新事件
    window.dispatchEvent(new CustomEvent('experienceUpdated'))
    
    // 更新本地状态
    setExperiences(experiences)
  }

  if (experiences.length === 0) {
    return (
      <div className="experience-list-empty">
        <p>暂无经验分享</p>
        <button className="experience-list-create-btn" onClick={onCreateExperience}>
          <span className="experience-list-create-icon">➕</span>
          <span>发布第一条经验分享</span>
        </button>
      </div>
    )
  }

  return (
    <div className="experience-list">
      {experiences.map((experience) => (
        <Card key={experience.id} className="experience-card">
          <div className="experience-card-header">
            <h4 className="experience-card-title">{experience.title}</h4>
            <div className="experience-card-meta">
              <span className="experience-card-author">{experience.authorName}</span>
              <span className="experience-card-date">{formatDate(experience.createdAt || new Date())}</span>
            </div>
          </div>

          <div className="experience-card-content">{experience.content}</div>

          <CommentSection
            experienceId={experience.id}
            comments={experience.comments || []}
            onAddComment={(content) => handleAddComment(experience.id, content)}
          />
        </Card>
      ))}
    </div>
  )
}




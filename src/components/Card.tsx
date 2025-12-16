import React from 'react'
import './Card.css'

/**
 * 通用卡片组件
 */

interface CardProps {
  children: React.ReactNode
  title?: string
  onClick?: (e?: React.MouseEvent<HTMLDivElement>) => void
  className?: string
}

export default function Card({ children, title, onClick, className = '' }: CardProps) {
  return (
    <div className={`card ${className}`} onClick={onClick}>
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">{children}</div>
    </div>
  )
}

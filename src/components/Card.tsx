import './Card.css'

/**
 * 通用卡片组件
 */

interface CardProps {
  children: React.ReactNode
  title?: string
  onClick?: (e?: React.MouseEvent) => void
  className?: string
  style?: React.CSSProperties
}

export default function Card({ children, title, onClick, className = '', style }: CardProps) {
  return (
    <div className={`card ${className}`} onClick={onClick} style={style}>
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">{children}</div>
    </div>
  )
}

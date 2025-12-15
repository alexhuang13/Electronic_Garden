import { useState } from 'react'
import Card from '@components/Card'
import './InventoryItem.css'

interface InventoryItemProps {
  id: string
  name: string
  icon: string
  count: number
  onUse: () => void
  onGift: () => void
}

export default function InventoryItem({ id, name, icon, count, onUse, onGift }: InventoryItemProps) {
  const [showActions, setShowActions] = useState(false)

  if (count === 0) {
    return null
  }

  return (
    <Card 
      className="inventory-item-card"
      onClick={() => setShowActions(true)}
    >
      <div className="inventory-item-content">
        <div className="inventory-item-icon">{icon}</div>
        <div className="inventory-item-info">
          <div className="inventory-item-name">{name}</div>
          <div className="inventory-item-count">x{count}</div>
        </div>
      </div>

      {showActions && (
        <div className="inventory-item-overlay" onClick={(e) => e.stopPropagation()}>
          <div className="inventory-item-actions">
            <button 
              className="inventory-action-btn inventory-action-use"
              onClick={(e) => {
                e.stopPropagation()
                onUse()
                setShowActions(false)
              }}
            >
              使用
            </button>
            <button 
              className="inventory-action-btn inventory-action-gift"
              onClick={(e) => {
                e.stopPropagation()
                onGift()
                setShowActions(false)
              }}
            >
              赠送
            </button>
            <button 
              className="inventory-action-btn inventory-action-cancel"
              onClick={(e) => {
                e.stopPropagation()
                setShowActions(false)
              }}
            >
              取消
            </button>
          </div>
        </div>
      )}
    </Card>
  )
}


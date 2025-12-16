import React, { useState, useEffect } from 'react'
import Card from '@components/Card'
import './ItemSelectModal.css'

interface InventoryItem {
  id: string
  name: string
  icon: string
  count: number
}

interface ItemSelectModalProps {
  onSelect: (itemId: string, itemName: string) => void
  onClose: () => void
}

export default function ItemSelectModal({ onSelect, onClose }: ItemSelectModalProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>([])

  useEffect(() => {
    // 从localStorage加载背包数据
    const loadInventory = (): InventoryItem[] => {
      const items: InventoryItem[] = []
      
      // 改名卡
      const nameCards = parseInt(localStorage.getItem('nameCards') || '0', 10)
      if (nameCards > 0) {
        items.push({
          id: 'nameCard',
          name: '改名卡',
          icon: '✏️',
          count: nameCards,
        })
      }

      // 其他物品
      const itemIds = ['seed', 'fertilizer', 'coffee', 'fountain', 'bench', 'watering_upgrade']
      const itemNames: Record<string, string> = {
        seed: '种子',
        fertilizer: '肥料',
        coffee: '咖啡',
        fountain: '喷泉',
        bench: '长椅',
        watering_upgrade: '浇水工具升级',
      }
      const itemIcons: Record<string, string> = {
        seed: '🌱',
        fertilizer: '🌾',
        coffee: '☕',
        fountain: '⛲',
        bench: '🪑',
        watering_upgrade: '🔧',
      }

      itemIds.forEach(itemId => {
        const count = parseInt(localStorage.getItem(`shopItem_${itemId}`) || '0', 10)
        if (count > 0) {
          items.push({
            id: itemId,
            name: itemNames[itemId] || itemId,
            icon: itemIcons[itemId] || '📦',
            count,
          })
        }
      })

      return items
    }

    setInventory(loadInventory())
    
    // 监听背包更新事件
    const handleInventoryUpdate = () => {
      setInventory(loadInventory())
    }
    
    window.addEventListener('inventoryUpdated', handleInventoryUpdate)
    return () => {
      window.removeEventListener('inventoryUpdated', handleInventoryUpdate)
    }
  }, [])

  const handleSelectItem = (itemId: string, itemName: string) => {
    onSelect(itemId, itemName)
    onClose()
  }

  return (
    <div className="item-select-overlay" onClick={onClose}>
      <Card className="item-select-modal" onClick={(e?: React.MouseEvent<HTMLDivElement>) => e?.stopPropagation()}>
        <div className="item-select-header">
          <h3 className="item-select-title">选择要赠送的物品</h3>
          <button className="item-select-close" onClick={onClose}>×</button>
        </div>
        <div className="item-select-content">
          {inventory.length === 0 ? (
            <div className="item-select-empty">
              <div className="item-select-empty-icon">📦</div>
              <p>背包中没有物品</p>
            </div>
          ) : (
            <div className="item-select-list">
              {inventory.map((item) => (
                <div
                  key={item.id}
                  className="item-select-item"
                  onClick={() => handleSelectItem(item.id, item.name)}
                >
                  <div className="item-select-icon">{item.icon}</div>
                  <div className="item-select-info">
                    <div className="item-select-name">{item.name}</div>
                    <div className="item-select-count">x{item.count}</div>
                  </div>
                  <div className="item-select-arrow">→</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}


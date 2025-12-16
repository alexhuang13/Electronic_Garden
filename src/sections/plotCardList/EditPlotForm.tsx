import { useState } from 'react'
import { Plot, PlotStatus } from '@core/types'
import Card from '@components/Card'
import './EditPlotForm.css'

interface EditPlotFormProps {
  plot: Plot
  onClose: () => void
  onSubmit: (data: { cropName: string; status: PlotStatus }) => void
}

const statusOptions: { value: PlotStatus; label: string }[] = [
  { value: 'growing', label: '生长中' },
  { value: 'needsWater', label: '需要浇水' },
  { value: 'needsFertilizer', label: '需要施肥' },
  { value: 'needsWeeding', label: '需要除草' },
]

export default function EditPlotForm({ plot, onClose, onSubmit }: EditPlotFormProps) {
  const currentCropName = plot.crops.length > 0 ? plot.crops[0].name : ''
  const [cropName, setCropName] = useState(currentCropName)
  
  // 如果当前状态不在选项中，默认使用"生长中"
  const getInitialStatus = (): PlotStatus => {
    const validStatuses: PlotStatus[] = ['growing', 'needsWater', 'needsFertilizer', 'needsWeeding']
    if (plot.status === 'empty' || !validStatuses.includes(plot.status)) {
      return 'growing'
    }
    return plot.status
  }
  
  const [status, setStatus] = useState<PlotStatus>(getInitialStatus())
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!cropName.trim()) {
      newErrors.cropName = '请输入植物名称'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    onSubmit({
      cropName: cropName.trim(),
      status,
    })
  }

  return (
    <div className="edit-plot-overlay" onClick={onClose}>
      <Card className="edit-plot-form-card" onClick={(e?: React.MouseEvent) => e?.stopPropagation()}>
        <div className="edit-plot-form-header">
          <h3 className="edit-plot-form-title">编辑地块 - {plot.name}</h3>
          <button className="edit-plot-form-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="edit-plot-form">
          <div className="edit-plot-form-group">
            <label className="edit-plot-form-label">
              植物种类 <span className="required">*</span>
            </label>
            <input
              type="text"
              className={`edit-plot-form-input ${errors.cropName ? 'error' : ''}`}
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              placeholder="请输入植物名称，如：番茄、生菜、萝卜等"
            />
            {errors.cropName && (
              <span className="edit-plot-form-error">{errors.cropName}</span>
            )}
          </div>

          <div className="edit-plot-form-group">
            <label className="edit-plot-form-label">
              地块状态 <span className="required">*</span>
            </label>
            <select
              className="edit-plot-form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value as PlotStatus)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="edit-plot-form-actions">
            <button type="button" className="edit-plot-form-cancel" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="edit-plot-form-submit">
              保存修改
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}


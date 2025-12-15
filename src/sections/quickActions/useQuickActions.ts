/**
 * QuickActions 业务逻辑 Hook
 */

interface UseQuickActionsReturn {
  handleAction: (action: string) => void
}

export function useQuickActions(): UseQuickActionsReturn {
  const handleAction = (action: string) => {
    console.log('执行快捷操作:', action)
    // 实际使用时，这里应该打开对应的操作弹窗或执行相应操作
    alert(`执行操作: ${action}`)
  }

  return {
    handleAction,
  }
}

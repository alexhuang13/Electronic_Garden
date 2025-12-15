import { NavLink } from 'react-router-dom'
import './Navigation.css'

/**
 * 导航栏组件
 * 显示主要页面的导航标签
 */

export default function Navigation() {
  const navItems = [
    { path: '/garden', icon: '🌿', label: '花园' },
    { path: '/tasks', icon: '📋', label: '我的任务' },
    { path: '/community', icon: '🏆', label: '社区' },
    { path: '/governance', icon: '⚖️', label: '花园治理' },
    { path: '/recharge', icon: '💰', label: '商城' },
    { path: '/friends', icon: '👥', label: '我的好友' },
    { path: '/profile', icon: '👤', label: '个人中心' },
  ]

  return (
    <nav className="navigation">
      <div className="nav-container">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'nav-item-active' : ''}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

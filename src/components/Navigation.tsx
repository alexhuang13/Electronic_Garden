import { NavLink } from 'react-router-dom'
import './Navigation.css'

/**
 * 导航栏组件
 * 显示 4 个主要页面的导航标签
 */

export default function Navigation() {
  const navItems = [
    { path: '/garden', icon: '🌿', label: '我的花园' },
    { path: '/tasks', icon: '📋', label: '任务与协作' },
    { path: '/community', icon: '🏆', label: '社区与激励' },
    { path: '/governance', icon: '⚖️', label: '治理与台账' },
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

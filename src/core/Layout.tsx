import { Outlet } from 'react-router-dom'
import Navigation from '@components/Navigation'
import '@styles/layout.css'

/**
 * 应用主布局
 * 包含导航栏和页面内容区域
 */
export default function Layout() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <h1 className="app-title">电子花园</h1>
      </header>

      <Navigation />

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <p>© 2025 电子花园 Electronic Garden</p>
      </footer>
    </div>
  )
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Garden from '@pages/Garden'
import Tasks from '@pages/Tasks'
import Community from '@pages/Community'
import Governance from '@pages/Governance'
import Layout from '@core/Layout'

/**
 * 路由配置
 * 定义应用的所有页面路由
 */
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/garden" replace />} />
          <Route path="garden" element={<Garden />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="community" element={<Community />} />
          <Route path="governance" element={<Governance />} />
          <Route path="*" element={<Navigate to="/garden" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

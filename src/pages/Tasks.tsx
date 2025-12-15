import Banner from '@sections/banner/Banner'
import TodoList from '@sections/todoList/TodoList'
import '@styles/pages.css'

/**
 * 📋 任务与协作页面
 *
 * 功能：
 * - 我的排班任务
 * - 逾期任务与协作大厅
 * - 认领任务、代班、求助
 */
export default function Tasks() {
  return (
    <div className="page tasks-page">
      <Banner type="announcement" />

      <section className="page-section">
        <h2 className="section-title">我的任务</h2>
        <TodoList filter="myTasks" />
      </section>

      <section className="page-section">
        <h2 className="section-title">协作大厅</h2>
        <TodoList filter="needsHelp" />
      </section>

      <section className="page-section">
        <h2 className="section-title">逾期任务</h2>
        <TodoList filter="overdue" />
      </section>
    </div>
  )
}

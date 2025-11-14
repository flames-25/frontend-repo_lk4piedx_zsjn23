import { useEffect, useMemo, useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || ''

function Stat({ label, value }) {
  return (
    <div className="bg-white/60 backdrop-blur rounded-xl px-4 py-3 border border-white/60 shadow-sm">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-xl font-semibold text-gray-800">{value}</div>
    </div>
  )
}

function RoleBadge({ role }) {
  const color = useMemo(() => ({
    MD: 'bg-purple-100 text-purple-700',
    CEO: 'bg-indigo-100 text-indigo-700',
    COO: 'bg-blue-100 text-blue-700',
    MANAGER: 'bg-emerald-100 text-emerald-700',
    EMPLOYEE: 'bg-gray-100 text-gray-700'
  })[role] || 'bg-gray-100 text-gray-700', [role])
  return <span className={`text-xs px-2 py-1 rounded-full ${color}`}>{role}</span>
}

function App() {
  const [overview, setOverview] = useState(null)
  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ovr, us, ts] = await Promise.all([
          fetch(`${BACKEND}/analytics/overview`).then(r => r.json()),
          fetch(`${BACKEND}/users`).then(r => r.json()),
          fetch(`${BACKEND}/tasks`).then(r => r.json()),
        ])
        setOverview(ovr)
        setUsers(us)
        setTasks(ts)
      } catch (e) {
        setError('Unable to connect to backend. Set VITE_BACKEND_URL.')
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <header className="px-6 py-4 border-b bg-white/70 backdrop-blur sticky top-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Trimkart – Hierarchical Tracking</h1>
          <div className="text-sm text-slate-500">MD → CEO → COO → Managers → Employees</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-lg">{error}</div>
        )}

        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Overview</h2>
          {overview ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Stat label="Users" value={overview.users} />
              <Stat label="Tasks" value={overview.tasks} />
              <Stat label="Completed" value={overview.completed} />
              <Stat label="In Progress" value={overview.in_progress} />
              <Stat label="Pending" value={overview.pending} />
            </div>
          ) : (
            <div className="text-slate-500">Loading overview…</div>
          )}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-semibold text-slate-800 mb-3">People</h3>
            <div className="bg-white rounded-xl border p-4 divide-y">
              {users.length === 0 && <div className="text-slate-500">No users yet</div>}
              {users.map(u => (
                <div key={u.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-800">{u.name}</div>
                    <div className="text-xs text-slate-500">{u.email}</div>
                  </div>
                  <RoleBadge role={u.role} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold text-slate-800 mb-3">Tasks</h3>
            <div className="bg-white rounded-xl border p-4 divide-y">
              {tasks.length === 0 && <div className="text-slate-500">No tasks yet</div>}
              {tasks.map(t => (
                <div key={t.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-slate-800">{t.title}</div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      t.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                      t.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>{t.status}</span>
                  </div>
                  <div className="text-xs text-slate-500">Progress: {t.progress}% • Due: {t.due_date ? new Date(t.due_date).toLocaleDateString() : '—'}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 py-6 text-center text-xs text-slate-500">© Trimkart by Coders Sectors</footer>
    </div>
  )
}

export default App

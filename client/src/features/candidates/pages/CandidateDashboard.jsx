import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../../shared/api/client'
import Spinner from '../../../shared/components/Spinner'
import StatusTag from '../../../shared/components/StatusTag'
import Pagination from '../../../shared/components/Pagination'

export default function CandidateDashboard() {
  const [applications, setApplications] = useState([])
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const res = await api.get('/applications', { page })
        if (!cancelled) {
          setApplications(res.data)
          setMeta(res.meta)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [page])

  async function handleWithdraw(id) {
    if (!confirm('Withdraw this application?')) return
    await api.delete(`/applications/${id}`)
    setApplications((apps) => apps.filter((a) => a.id !== id))
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl">Your applications</h1>
          <p className="text-ink-muted text-sm mt-1">Track where things stand.</p>
        </div>
        <Link to="/profile/candidate" className="text-sm text-amber-dark hover:underline">
          Edit profile
        </Link>
      </div>

      {loading && (
        <div className="py-16 flex justify-center">
          <Spinner />
        </div>
      )}

      {!loading && applications.length === 0 && (
        <p className="text-ink-muted text-sm py-12 text-center">
          No applications yet. <Link to="/" className="text-amber-dark hover:underline">Browse open roles</Link>.
        </p>
      )}

      {!loading &&
        applications.map((app) => (
          <div key={app.id} className="flex items-center justify-between border-b border-line py-4">
            <div>
              <Link to={`/jobs/${app.job.id}`} className="font-display text-lg hover:text-amber-dark transition-colors">
                {app.job.title}
              </Link>
              <p className="text-sm text-ink-muted">{app.job.company}</p>
            </div>
            <div className="flex items-center gap-4">
              <StatusTag status={app.status} />
              <button onClick={() => handleWithdraw(app.id)} className="btn-ghost text-xs">
                Withdraw
              </button>
            </div>
          </div>
        ))}

      <Pagination meta={meta} onPageChange={setPage} />
    </div>
  )
}

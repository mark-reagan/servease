import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../../../shared/api/client'
import Spinner from '../../../shared/components/Spinner'
import StatusTag from '../../../shared/components/StatusTag'
import Pagination from '../../../shared/components/Pagination'

const STATUS_OPTIONS = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired']

export default function JobApplicants() {
  const { id } = useParams()
  const [applications, setApplications] = useState([])
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const res = await api.get(`/jobs/${id}/applications`, {
          page,
          status: statusFilter || undefined,
        })
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
  }, [id, page, statusFilter])

  async function handleStatusChange(applicationId, status) {
    const res = await api.patch(`/applications/${applicationId}`, { status })
    const updated = res.data ?? res
    setApplications((apps) => apps.map((a) => (a.id === applicationId ? updated : a)))
  }

  return (
    <div>
      <Link to="/dashboard" className="text-sm text-ink-muted hover:text-ink transition-colors">
        ← Your postings
      </Link>

      <div className="flex items-baseline justify-between mt-4 mb-8">
        <h1 className="font-display text-3xl">Applicants</h1>
        <select
          className="field-input w-auto"
          value={statusFilter}
          onChange={(e) => {
            setPage(1)
            setStatusFilter(e.target.value)
          }}
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="py-16 flex justify-center">
          <Spinner />
        </div>
      )}

      {!loading && applications.length === 0 && (
        <p className="text-ink-muted text-sm py-12 text-center">No applicants match this filter yet.</p>
      )}

      {!loading &&
        applications.map((app) => (
          <div key={app.id} className="border-b border-line py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-lg">{app.candidate?.name}</p>
                <p className="text-sm text-ink-muted">{app.candidate?.email}</p>
                {app.candidate?.headline && (
                  <p className="text-sm text-ink-faint mt-0.5">{app.candidate.headline}</p>
                )}
              </div>
              <StatusTag status={app.status} />
            </div>

            {app.cover_letter && (
              <p className="text-sm text-ink-muted mt-3 whitespace-pre-line">{app.cover_letter}</p>
            )}

            <div className="flex items-center gap-2 mt-4">
              <label className="text-xs text-ink-muted" htmlFor={`status-${app.id}`}>
                Update status:
              </label>
              <select
                id={`status-${app.id}`}
                className="field-input w-auto text-sm py-1"
                value={app.status}
                onChange={(e) => handleStatusChange(app.id, e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s[0].toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

      <Pagination meta={meta} onPageChange={setPage} />
    </div>
  )
}

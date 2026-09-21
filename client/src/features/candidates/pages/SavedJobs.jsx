import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../../shared/api/client'
import JobRow from '../../jobs/components/JobRow'
import Spinner from '../../../shared/components/Spinner'
import Pagination from '../../../shared/components/Pagination'

export default function SavedJobs() {
  const [jobs, setJobs] = useState([])
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const res = await api.get('/saved-jobs', { page })
        if (!cancelled) {
          setJobs(res.data)
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

  return (
    <div>
      <h1 className="font-display text-3xl mb-1">Saved jobs</h1>
      <p className="text-ink-muted text-sm mb-8">Roles you've bookmarked to revisit.</p>

      {loading && (
        <div className="py-16 flex justify-center">
          <Spinner />
        </div>
      )}

      {!loading && jobs.length === 0 && (
        <p className="text-ink-muted text-sm py-12 text-center">
          Nothing saved yet. <Link to="/" className="text-amber-dark hover:underline">Browse open roles</Link>.
        </p>
      )}

      {!loading && jobs.map((job) => <JobRow key={job.id} job={job} />)}

      <Pagination meta={meta} onPageChange={setPage} />
    </div>
  )
}

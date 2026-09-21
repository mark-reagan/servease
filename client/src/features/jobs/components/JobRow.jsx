import { Link } from 'react-router-dom'
import { employmentLabel, workModeLabel, formatSalary, timeAgo } from '../../../shared/lib/format'

export default function JobRow({ job }) {
  const salary = formatSalary(job)

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group flex gap-4 border-b border-line py-5 hover:bg-panel/60 transition-colors -mx-2 px-2"
    >
      <div
        className={`w-1 shrink-0 ${job.work_mode === 'remote' ? 'bg-teal' : 'bg-amber'}`}
        aria-hidden="true"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-lg text-ink group-hover:text-amber-dark transition-colors truncate">
            {job.title}
          </h3>
          {salary && <span className="text-sm text-ink-muted whitespace-nowrap">{salary}</span>}
        </div>

        <p className="text-sm text-ink-muted mt-0.5">
          {job.company?.name || 'A company'} {job.location && `· ${job.location}`}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-ink-faint">
          <span>{employmentLabel(job.employment_type)}</span>
          <span aria-hidden="true">·</span>
          <span>{workModeLabel(job.work_mode)}</span>
          {job.created_at && (
            <>
              <span aria-hidden="true">·</span>
              <span>{timeAgo(job.created_at)}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}

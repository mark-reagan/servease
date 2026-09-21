const STYLES = {
  open: 'text-teal border-teal',
  closed: 'text-rust border-rust',
  draft: 'text-ink-faint border-line',
  pending: 'text-amber-dark border-amber',
  reviewed: 'text-ink-muted border-ink-faint',
  shortlisted: 'text-teal border-teal',
  rejected: 'text-rust border-rust',
  hired: 'text-teal-dark border-teal',
}

const LABELS = {
  open: 'Open',
  closed: 'Closed',
  draft: 'Draft',
  pending: 'Pending review',
  reviewed: 'Reviewed',
  shortlisted: 'Shortlisted',
  rejected: 'Not selected',
  hired: 'Hired',
}

export default function StatusTag({ status }) {
  const style = STYLES[status] || 'text-ink-muted border-line'
  const label = LABELS[status] || status

  return (
    <span className={`inline-block text-xs px-2 py-0.5 border ${style}`}>
      {label}
    </span>
  )
}

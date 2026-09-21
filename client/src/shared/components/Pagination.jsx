export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null

  const { current_page, last_page } = meta

  return (
    <div className="flex items-center justify-between pt-6 text-sm">
      <button
        className="btn-outline"
        disabled={current_page <= 1}
        onClick={() => onPageChange(current_page - 1)}
      >
        Previous
      </button>
      <span className="text-ink-muted">
        Page {current_page} of {last_page}
      </span>
      <button
        className="btn-outline"
        disabled={current_page >= last_page}
        onClick={() => onPageChange(current_page + 1)}
      >
        Next
      </button>
    </div>
  )
}

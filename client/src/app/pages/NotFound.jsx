import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <p className="font-display text-2xl mb-2">There's nothing at this address.</p>
      <Link to="/" className="text-amber-dark hover:underline text-sm">
        Back to all jobs
      </Link>
    </div>
  )
}

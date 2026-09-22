const STYLES = {
	open: 'bg-teal/10 text-teal-dark',
	closed: 'bg-rust/10 text-rust',
	draft: 'bg-line text-ink-muted',
	pending: 'bg-amber-light text-amber-dark',
	reviewed: 'bg-sky-100 text-sky-700',
	shortlisted: 'bg-teal/10 text-teal-dark',
	rejected: 'bg-rust/10 text-rust',
	hired: 'bg-teal/15 text-teal-dark',
};

const LABELS = {
	open: 'Open',
	closed: 'Closed',
	draft: 'Draft',
	pending: 'Pending review',
	reviewed: 'Reviewed',
	shortlisted: 'Shortlisted',
	rejected: 'Not selected',
	hired: 'Hired',
};

export default function StatusTag({ status }) {
	const style = STYLES[status] || 'bg-line text-ink-muted';
	const label = LABELS[status] || status;

	return (
		<span
			className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-center text-xs font-medium ${style}`}
		>
			{label}
		</span>
	);
}

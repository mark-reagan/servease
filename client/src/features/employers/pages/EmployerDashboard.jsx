import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../shared/api/client';
import Spinner from '../../../shared/components/Spinner';
import StatusTag from '../../../shared/components/StatusTag';
import Pagination from '../../../shared/components/Pagination';
import { formatSalary } from '../../../shared/lib/format';
import { useLanguage } from '../../../shared/context/LanguageContext';

export default function EmployerDashboard() {
	const { t } = useLanguage();
	const [jobs, setJobs] = useState([]);
	const [meta, setMeta] = useState(null);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;
		async function load() {
			setLoading(true);
			try {
				const res = await api.get('/my-jobs', { page });
				if (!cancelled) {
					setJobs(res.data);
					setMeta(res.meta);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		}
		load();
		return () => {
			cancelled = true;
		};
	}, [page]);

	async function handleDelete(id) {
		if (!confirm(t.deletePostingConfirm)) return;
		await api.delete(`/jobs/${id}`);
		setJobs((js) => js.filter((j) => j.id !== id));
	}

	return (
		<div>
			<div className="flex flex-col gap-5 mb-8 sm:flex-row sm:items-baseline sm:justify-between">
				<div>
					<h1 className="font-display text-3xl">{t.yourPostings}</h1>
					<p className="text-ink-muted text-sm mt-1">{t.manageJobs}</p>
				</div>
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
					<Link to="/profile/company" className="btn-outline w-full sm:w-auto">
						{t.companyProfile}
					</Link>
					<Link to="/jobs/new" className="btn-primary w-full sm:w-auto">
						{t.postJob}
					</Link>
				</div>
			</div>

			{loading && (
				<div className="py-16 flex justify-center">
					<Spinner />
				</div>
			)}

			{!loading && jobs.length === 0 && (
				<p className="text-ink-muted text-sm py-12 text-center">
					{t.emptyPostings}
				</p>
			)}

			{!loading &&
				jobs.map((job) => (
					<article
						key={job.id}
						className="mb-4 overflow-hidden border border-gray-100 border-l-4 border-l-amber bg-white shadow-sm last:mb-0"
					>
						<div className="flex items-start justify-between gap-4 px-5 py-5 sm:px-6">
							<div className="min-w-0">
								<Link
									to={`/jobs/${job.id}`}
									className="font-display text-lg leading-tight"
								>
									{job.title}
								</Link>
								<div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-sm text-ink-muted">
									<span>{formatSalary(job) || t.salaryNotListed}</span>
									<span aria-hidden="true">·</span>
									<span>
										{job.applications_count ?? 0} {t.applicant}
										{job.applications_count === 1 ? '' : 's'}
									</span>
								</div>
							</div>
							<StatusTag status={job.status} />
						</div>

						<div className="grid grid-cols-3 gap-2 border-t border-line bg-gray-50 px-4 py-3 sm:flex sm:justify-end sm:px-6">
							<Link
								to={`/jobs/${job.id}/applicants`}
								className="btn-outline w-full px-2 text-xs sm:w-auto sm:px-4"
							>
								{t.applicants}
							</Link>
							<Link
								to={`/jobs/${job.id}/edit`}
								className="btn-ghost w-full px-2 text-xs sm:w-auto sm:px-4"
							>
								{t.edit}
							</Link>
							<button
								onClick={() => handleDelete(job.id)}
								className="btn-ghost w-full px-2 text-xs text-rust sm:w-auto sm:px-4"
							>
								{t.delete}
							</button>
						</div>
					</article>
				))}

			<Pagination meta={meta} onPageChange={setPage} />
		</div>
	);
}

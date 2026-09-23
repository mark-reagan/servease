import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../shared/api/client';
import Spinner from '../../../shared/components/Spinner';
import Pagination from '../../../shared/components/Pagination';
import { useLanguage } from '../../../shared/context/LanguageContext';
import JobRow from '../../jobs/components/JobRow';

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
					<article key={job.id}>
						<JobRow job={job} />
						<div className="flex flex-wrap items-center justify-between gap-2 pb-5 pl-5">
							<span className="text-xs text-ink-faint">
								{job.applications_count ?? 0} {t.applicant}
								{job.applications_count === 1 ? '' : 's'}
							</span>
							<div className="flex flex-wrap items-center justify-end gap-2">
								<Link
									to={`/jobs/${job.id}/applicants`}
									className="btn-outline px-3 text-xs"
								>
									{t.applicants}
								</Link>
								<Link
									to={`/jobs/${job.id}/edit`}
									className="btn-ghost px-3 text-xs"
								>
									{t.edit}
								</Link>
								<button
									onClick={() => handleDelete(job.id)}
									className="btn-ghost px-3 text-xs text-rust"
								>
									{t.delete}
								</button>
							</div>
						</div>
					</article>
				))}

			<Pagination meta={meta} onPageChange={setPage} />
		</div>
	);
}

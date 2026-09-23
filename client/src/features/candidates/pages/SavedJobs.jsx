import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../shared/api/client';
import JobRow from '../../jobs/components/JobRow';
import Spinner from '../../../shared/components/Spinner';
import Pagination from '../../../shared/components/Pagination';
import { useLanguage } from '../../../shared/context/LanguageContext';

export default function SavedJobs() {
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
				const res = await api.get('/saved-jobs', { page });
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

	return (
		<div>
			<h1 className="font-display text-3xl mb-1">{t.savedJobs}</h1>
			<p className="text-ink-muted text-sm mb-8">{t.savedJobsDescription}</p>

			{loading && (
				<div className="py-16 flex justify-center">
					<Spinner />
				</div>
			)}

			{!loading && jobs.length === 0 && (
				<p className="text-ink-muted text-sm py-12 text-center">
					{t.nothingSaved}{' '}
					<Link to="/" className="text-amber-dark hover:underline">
						{t.browseOpenRoles}
					</Link>
					.
				</p>
			)}

			{!loading && jobs.map((job) => <JobRow key={job.id} job={job} />)}

			<Pagination meta={meta} onPageChange={setPage} />
		</div>
	);
}

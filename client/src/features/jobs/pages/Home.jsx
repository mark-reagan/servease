import { useEffect, useState, useCallback } from 'react';
import { api } from '../../../shared/api/client';
import JobRow from '../components/JobRow';
import Pagination from '../../../shared/components/Pagination';
import Spinner from '../../../shared/components/Spinner';

const EMPLOYMENT_TYPES = [
	{ value: '', label: 'Any type' },
	{ value: 'full_time', label: 'Full-time' },
	{ value: 'part_time', label: 'Part-time' },
	{ value: 'contract', label: 'Contract' },
	{ value: 'internship', label: 'Internship' },
	{ value: 'temporary', label: 'Temporary' },
];

const WORK_MODES = [
	{ value: '', label: 'Any mode' },
	{ value: 'on_site', label: 'On-site' },
	{ value: 'remote', label: 'Remote' },
	{ value: 'hybrid', label: 'Hybrid' },
];

export default function Home() {
	const [filters, setFilters] = useState({
		keyword: '',
		location: '',
		employment_type: '',
		work_mode: '',
	});
	const [jobs, setJobs] = useState([]);
	const [meta, setMeta] = useState(null);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	const fetchJobs = useCallback(async (currentFilters, currentPage) => {
		setLoading(true);
		setError('');
		try {
			const res = await api.get('/jobs', {
				...currentFilters,
				page: currentPage,
			});
			setJobs(res.data);
			setMeta(res.meta);
		} catch {
			setError('Could not load listings right now.');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchJobs(filters, page);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	function handleSubmit(e) {
		e.preventDefault();
		setPage(1);
		fetchJobs(filters, 1);
	}

	function updateFilter(key, value) {
		setFilters((f) => ({ ...f, [key]: value }));
	}

	return (
		<div>
			<section className="border-b border-line pb-10 mb-10">
				<p className="text-sm text-amber-dark mb-2">Serving Quezon, Palawan</p>
				<h1 className="font-display text-4xl sm:text-5xl leading-tight max-w-2xl">
					Find the right job. Hire the right person.
				</h1>
				<p className="text-ink-muted mt-3 max-w-lg">
					ServEase connects people in Quezon, Palawan with local opportunities
					and trusted candidates.
				</p>
			</section>

			<form onSubmit={handleSubmit} className="grid sm:grid-cols-5 gap-3 mb-8">
				<input
					type="text"
					placeholder="Service or keyword"
					value={filters.keyword}
					onChange={(e) => updateFilter('keyword', e.target.value)}
					className="field-input sm:col-span-2"
				/>
				<input
					type="text"
					placeholder="Location"
					value={filters.location}
					onChange={(e) => updateFilter('location', e.target.value)}
					className="field-input"
				/>
				<select
					value={filters.employment_type}
					onChange={(e) => updateFilter('employment_type', e.target.value)}
					className="field-input"
				>
					{EMPLOYMENT_TYPES.map((t) => (
						<option key={t.value} value={t.value}>
							{t.label}
						</option>
					))}
				</select>
				<select
					value={filters.work_mode}
					onChange={(e) => updateFilter('work_mode', e.target.value)}
					className="field-input"
				>
					{WORK_MODES.map((m) => (
						<option key={m.value} value={m.value}>
							{m.label}
						</option>
					))}
				</select>
				<button
					type="submit"
					className="btn-primary sm:col-span-5 sm:justify-self-start"
				>
					Find jobs
				</button>
			</form>

			{loading && (
				<div className="py-16 flex justify-center">
					<Spinner label="Fetching listings…" />
				</div>
			)}

			{!loading && error && <p className="text-rust text-sm">{error}</p>}

			{!loading && !error && jobs.length === 0 && (
				<p className="text-ink-muted text-sm py-12 text-center">
					No roles match those filters yet. Try widening your search.
				</p>
			)}

			{!loading && !error && jobs.length > 0 && (
				<div>
					{jobs.map((job) => (
						<JobRow key={job.id} job={job} />
					))}
					<Pagination meta={meta} onPageChange={setPage} />
				</div>
			)}
		</div>
	);
}

import { useEffect, useState, useCallback } from 'react';
import { api } from '../../../shared/api/client';
import JobRow from '../components/JobRow';
import Pagination from '../../../shared/components/Pagination';
import Spinner from '../../../shared/components/Spinner';
import { useLanguage } from '../../../shared/context/LanguageContext';

export default function Home() {
	const { t } = useLanguage();
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

	const fetchJobs = useCallback(
		async (currentFilters, currentPage) => {
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
				setError(t.listingsLoadError);
			} finally {
				setLoading(false);
			}
		},
		[t.listingsLoadError],
	);

	const employmentTypes = [
		{ value: '', label: t.anyType },
		{ value: 'full_time', label: t.fullTime },
		{ value: 'part_time', label: t.partTime },
		{ value: 'contract', label: t.contract },
		{ value: 'internship', label: t.internship },
		{ value: 'temporary', label: t.temporary },
	];

	const workModes = [
		{ value: '', label: t.anyMode },
		{ value: 'on_site', label: t.onSite },
		{ value: 'remote', label: t.remote },
		{ value: 'hybrid', label: t.hybrid },
	];

	useEffect(() => {
		fetchJobs(filters, page);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchJobs, page]);

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
				<p className="text-sm text-amber-dark mb-2">{t.servingLocation}</p>
				<h1 className="font-display text-4xl sm:text-5xl leading-tight max-w-2xl">
					{t.homeTitle}
				</h1>
				<p className="text-ink-muted mt-3 max-w-lg">{t.homeDescription}</p>
			</section>

			<form onSubmit={handleSubmit} className="grid sm:grid-cols-5 gap-3 mb-8">
				<input
					type="text"
					placeholder={t.serviceOrKeyword}
					value={filters.keyword}
					onChange={(e) => updateFilter('keyword', e.target.value)}
					className="field-input sm:col-span-2"
				/>
				<input
					type="text"
					placeholder={t.location}
					value={filters.location}
					onChange={(e) => updateFilter('location', e.target.value)}
					className="field-input"
				/>
				<select
					value={filters.employment_type}
					onChange={(e) => updateFilter('employment_type', e.target.value)}
					className="field-input"
				>
					{employmentTypes.map((type) => (
						<option key={type.value} value={type.value}>
							{type.label}
						</option>
					))}
				</select>
				<select
					value={filters.work_mode}
					onChange={(e) => updateFilter('work_mode', e.target.value)}
					className="field-input"
				>
					{workModes.map((mode) => (
						<option key={mode.value} value={mode.value}>
							{mode.label}
						</option>
					))}
				</select>
				<button
					type="submit"
					className="btn-primary sm:col-span-5 sm:justify-self-start"
				>
					{t.findJobs}
				</button>
			</form>

			{loading && (
				<div className="py-16 flex justify-center">
					<Spinner label={t.fetchingListings} />
				</div>
			)}

			{!loading && error && <p className="text-rust text-sm">{error}</p>}

			{!loading && !error && jobs.length === 0 && (
				<p className="text-ink-muted text-sm py-12 text-center">{t.noRoles}</p>
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

import { useEffect, useState } from 'react';
import {
	ArrowLeft,
	CalendarDays,
	ChevronDown,
	Download,
	FileText,
	Mail,
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../../shared/api/client';
import Spinner from '../../../shared/components/Spinner';
import StatusTag from '../../../shared/components/StatusTag';
import Pagination from '../../../shared/components/Pagination';

const STATUS_OPTIONS = [
	'pending',
	'reviewed',
	'shortlisted',
	'rejected',
	'hired',
];

export default function JobApplicants() {
	const { id } = useParams();
	const [applications, setApplications] = useState([]);
	const [meta, setMeta] = useState(null);
	const [page, setPage] = useState(1);
	const [statusFilter, setStatusFilter] = useState('');
	const [loading, setLoading] = useState(true);
	const [expandedApplications, setExpandedApplications] = useState(
		() => new Set(),
	);

	useEffect(() => {
		let cancelled = false;
		async function load() {
			setLoading(true);
			try {
				const res = await api.get(`/jobs/${id}/applications`, {
					page,
					status: statusFilter || undefined,
				});
				if (!cancelled) {
					setApplications(res.data);
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
	}, [id, page, statusFilter]);

	async function handleStatusChange(applicationId, status) {
		const res = await api.patch(`/applications/${applicationId}`, { status });
		const updated = res.data ?? res;
		setApplications((apps) =>
			apps.map((a) => (a.id === applicationId ? updated : a)),
		);
	}

	async function handleDownloadResume(app) {
		try {
			const { blob, filename } = await api.get(
				`/applications/${app.id}/resume`,
				null,
				{
					responseType: 'blob',
				},
			);
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute(
				'download',
				filename || `resume-${app.candidate?.name || app.id}`,
			);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch {
			alert('Could not download resume.');
		}
	}

	function toggleApplication(applicationId) {
		setExpandedApplications((expanded) => {
			const nextExpanded = new Set(expanded);
			if (nextExpanded.has(applicationId)) {
				nextExpanded.delete(applicationId);
			} else {
				nextExpanded.add(applicationId);
			}
			return nextExpanded;
		});
	}

	function handleApplicationHeaderKeyDown(event, applicationId) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggleApplication(applicationId);
		}
	}

	return (
		<div>
			<Link
				to="/dashboard"
				className="inline-flex items-center gap-2 text-sm font-medium text-ink-muted hover:text-ink transition-colors"
			>
				<ArrowLeft size={16} aria-hidden="true" />
				Your postings
			</Link>

			<div className="flex flex-col gap-4 mt-5 mb-8 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h1 className="font-display text-3xl">Applicants</h1>
					<p className="mt-1 text-sm text-ink-muted">
						Review candidates and update their hiring status.
					</p>
				</div>
				<label className="block">
					<span className="sr-only">Filter applicants by status</span>
					<select
						className="field-input w-full sm:w-auto"
						value={statusFilter}
						onChange={(e) => {
							setPage(1);
							setStatusFilter(e.target.value);
						}}
					>
						<option value="">All statuses</option>
						{STATUS_OPTIONS.map((s) => (
							<option key={s} value={s}>
								{s[0].toUpperCase() + s.slice(1)}
							</option>
						))}
					</select>
				</label>
			</div>

			{loading && (
				<div className="py-16 flex justify-center">
					<Spinner />
				</div>
			)}

			{!loading && applications.length === 0 && (
				<p className="text-ink-muted text-sm py-12 text-center">
					No applicants match this filter yet.
				</p>
			)}

			{!loading && (
				<div className="space-y-5">
					{applications.map((app) => {
						const isExpanded = expandedApplications.has(app.id);

						return (
							<article
								key={app.id}
								className={`overflow-hidden border border-gray-100 border-l-4 border-l-amber bg-white shadow-sm transition-colors ${isExpanded ? '' : 'hover:bg-[#eeece5]'}`}
							>
								<header
									onClick={() => toggleApplication(app.id)}
									onKeyDown={(event) =>
										handleApplicationHeaderKeyDown(event, app.id)
									}
									role="button"
									tabIndex={0}
									aria-expanded={isExpanded}
									aria-controls={`application-details-${app.id}`}
									className={`flex cursor-pointer flex-col gap-4 px-6 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-8 ${isExpanded ? 'border-b border-line' : ''}`}
								>
									<div>
										<p className="font-display text-xl text-ink">
											{app.candidate?.name}
										</p>
										<a
											href={`mailto:${app.candidate?.email}`}
											onClick={(event) => event.stopPropagation()}
											className="mt-1 inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors"
										>
											<Mail size={15} aria-hidden="true" />
											{app.candidate?.email}
										</a>
										{app.candidate?.headline && (
											<p className="mt-2 text-sm text-ink-muted">
												{app.candidate.headline}
											</p>
										)}
									</div>
									<div className="flex items-center gap-3">
										<StatusTag status={app.status} />
										<button
											type="button"
											onClick={(event) => {
												event.stopPropagation();
												toggleApplication(app.id);
											}}
											aria-expanded={isExpanded}
											aria-controls={`application-details-${app.id}`}
											aria-label={
												isExpanded
													? 'Collapse applicant details'
													: 'Expand applicant details'
											}
											className="btn-ghost h-8 w-8 p-0 text-ink-muted hover:bg-gray-50"
										>
											<ChevronDown
												size={18}
												aria-hidden="true"
												className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
											/>
										</button>
									</div>
								</header>

								{isExpanded && (
									<div id={`application-details-${app.id}`}>
										<div className="grid divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0">
											<section className="px-6 py-5 sm:px-8">
												<div className="flex items-center gap-2 text-ink-faint">
													<CalendarDays size={16} aria-hidden="true" />
													<p className="text-xs font-medium uppercase tracking-wide">
														Submitted
													</p>
												</div>
												<p className="mt-3 text-sm font-medium text-ink">
													{new Date(app.created_at).toLocaleDateString(
														undefined,
														{
															month: 'long',
															day: 'numeric',
															year: 'numeric',
														},
													)}
												</p>
											</section>

											<section className="px-6 py-5 sm:px-8">
												<div className="flex items-center gap-2 text-ink-faint">
													<FileText size={16} aria-hidden="true" />
													<p className="text-xs font-medium uppercase tracking-wide">
														Resume
													</p>
												</div>
												{app.has_resume ? (
													<button
														type="button"
														onClick={() => handleDownloadResume(app)}
														className="btn-outline mt-3 px-3 py-1.5 text-sm"
													>
														<Download size={16} aria-hidden="true" />
														Download resume
													</button>
												) : (
													<p className="mt-3 text-sm text-ink-muted">
														No resume attached
													</p>
												)}
											</section>
										</div>

										<section className="border-t border-line px-6 py-6 sm:px-8">
											<p className="text-xs font-medium uppercase tracking-wide text-ink-faint">
												Cover letter
											</p>
											<p className="mt-3 whitespace-pre-line text-sm leading-6 text-ink-muted">
												{app.cover_letter || 'No cover letter was included.'}
											</p>
										</section>

										<footer className="flex flex-col gap-2 border-t border-line bg-gray-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
											<label
												className="text-sm font-medium text-ink-muted"
												htmlFor={`status-${app.id}`}
											>
												Update hiring status
											</label>
											<select
												id={`status-${app.id}`}
												className="field-input w-full sm:w-auto"
												value={app.status}
												onChange={(e) =>
													handleStatusChange(app.id, e.target.value)
												}
											>
												{STATUS_OPTIONS.map((s) => (
													<option key={s} value={s}>
														{s[0].toUpperCase() + s.slice(1)}
													</option>
												))}
											</select>
										</footer>
									</div>
								)}
							</article>
						);
					})}
				</div>
			)}

			<Pagination meta={meta} onPageChange={setPage} />
		</div>
	);
}

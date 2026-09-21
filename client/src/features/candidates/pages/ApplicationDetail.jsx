import { useEffect, useState } from 'react';
import {
	ArrowLeft,
	CalendarDays,
	Download,
	ExternalLink,
	FileText,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../../shared/api/client';
import Spinner from '../../../shared/components/Spinner';
import StatusTag from '../../../shared/components/StatusTag';

export default function ApplicationDetail() {
	const { id } = useParams();
	const [application, setApplication] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			setLoading(true);
			try {
				const response = await api.get(`/applications/${id}`);
				if (!cancelled) setApplication(response.data ?? response);
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		load();
		return () => {
			cancelled = true;
		};
	}, [id]);

	async function handleDownloadResume() {
		try {
			const { blob, filename } = await api.get(
				`/applications/${id}/resume`,
				null,
				{ responseType: 'blob' },
			);
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = filename || `resume-${id}`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch {
			alert('Could not download resume.');
		}
	}

	if (loading) {
		return (
			<div className="py-16 flex justify-center">
				<Spinner />
			</div>
		);
	}

	if (!application) {
		return (
			<p className="text-ink-muted text-sm py-12 text-center">
				Application not found.
			</p>
		);
	}

	return (
		<div className="max-w-4xl">
			<Link
				to="/dashboard"
				className="inline-flex items-center gap-2 text-sm font-medium text-ink-muted hover:text-ink transition-colors"
			>
				<ArrowLeft size={16} aria-hidden="true" />
				Your applications
			</Link>

			<article className="mt-5 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
				<header className="flex flex-col gap-4 border-b border-line px-6 py-6 sm:flex-row sm:items-start sm:justify-between sm:px-8">
					<div>
						<p className="text-xs font-medium uppercase tracking-wide text-ink-faint">
							Application details
						</p>
						<h1 className="mt-2 font-display text-3xl text-ink">
							{application.job?.title}
						</h1>
						<p className="mt-1 text-sm text-ink-muted">
							{application.job?.company}
						</p>
					</div>
					<StatusTag status={application.status} />
				</header>

				<div className="grid divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0">
					<section className="px-6 py-5 sm:px-8">
						<div className="flex items-center gap-2 text-ink-faint">
							<CalendarDays size={16} aria-hidden="true" />
							<p className="text-xs font-medium uppercase tracking-wide">
								Submitted
							</p>
						</div>
						<p className="mt-3 text-sm font-medium text-ink">
							{new Date(application.created_at).toLocaleDateString(undefined, {
								month: 'long',
								day: 'numeric',
								year: 'numeric',
							})}
						</p>
					</section>

					<section className="px-6 py-5 sm:px-8">
						<div className="flex items-center gap-2 text-ink-faint">
							<FileText size={16} aria-hidden="true" />
							<p className="text-xs font-medium uppercase tracking-wide">
								Resume
							</p>
						</div>
						{application.has_resume ? (
							<button
								type="button"
								onClick={handleDownloadResume}
								className="btn-outline mt-3 px-3 py-1.5 text-sm"
							>
								<Download size={16} aria-hidden="true" />
								Download resume
							</button>
						) : (
							<p className="mt-3 text-sm text-ink-muted">No resume attached</p>
						)}
					</section>
				</div>

				<section className="border-t border-line px-6 py-6 sm:px-8">
					<p className="text-xs font-medium uppercase tracking-wide text-ink-faint">
						Cover letter
					</p>
					<p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-6 text-ink-muted">
						{application.cover_letter || 'No cover letter was included.'}
					</p>
				</section>

				<footer className="flex justify-end border-t border-line bg-gray-50 px-6 py-4 sm:px-8">
					<Link to={`/jobs/${application.job?.id}`} className="btn-primary">
						View job posting
						<ExternalLink size={16} aria-hidden="true" />
					</Link>
				</footer>
			</article>
		</div>
	);
}

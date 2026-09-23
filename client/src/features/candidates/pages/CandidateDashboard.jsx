import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../../shared/api/client';
import Spinner from '../../../shared/components/Spinner';
import StatusTag from '../../../shared/components/StatusTag';
import Pagination from '../../../shared/components/Pagination';
import { useLanguage } from '../../../shared/context/LanguageContext';

export default function CandidateDashboard() {
	const { t } = useLanguage();
	const [applications, setApplications] = useState([]);
	const [meta, setMeta] = useState(null);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		let cancelled = false;
		async function load() {
			setLoading(true);
			try {
				const res = await api.get('/applications', { page });
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
	}, [page]);

	async function handleWithdraw(id) {
		if (!confirm(t.withdrawConfirm)) return;
		await api.delete(`/applications/${id}`);
		setApplications((apps) => apps.filter((a) => a.id !== id));
	}

	function openApplication(id) {
		navigate(`/applications/${id}`);
	}

	return (
		<div>
			<div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between mb-8">
				<div>
					<h1 className="font-display text-3xl">{t.yourApplications}</h1>
					<p className="text-ink-muted text-sm mt-1">{t.trackStatus}</p>
				</div>
				<Link
					to="/profile/candidate"
					className="text-sm text-amber-dark hover:underline"
				>
					{t.editProfile}
				</Link>
			</div>

			{loading && (
				<div className="py-16 flex justify-center">
					<Spinner />
				</div>
			)}

			{!loading && applications.length === 0 && (
				<p className="text-ink-muted text-sm py-12 text-center">
					{t.noApplications}{' '}
					<Link to="/" className="text-amber-dark hover:underline">
						{t.browseOpenRoles}
					</Link>
					.
				</p>
			)}

			{!loading &&
				applications.map((app) => (
					<div
						key={app.id}
						role="link"
						tabIndex={0}
						onClick={() => openApplication(app.id)}
						onKeyDown={(event) => {
							if (event.key === 'Enter' || event.key === ' ') {
								event.preventDefault();
								openApplication(app.id);
							}
						}}
						className="group grid cursor-pointer grid-cols-[0.25rem_minmax(0,1fr)] gap-x-4 gap-y-3 border-b border-line py-5 -mx-2 px-2 transition-colors hover:bg-panel/60 sm:flex sm:gap-4"
					>
						<div
							className={`row-span-2 w-1 shrink-0 self-stretch ${app.job?.work_mode === 'remote' ? 'bg-teal' : 'bg-amber'}`}
							aria-hidden="true"
						/>
						<div className="min-w-0 flex-1">
							<p className="font-display text-lg text-ink transition-colors group-hover:text-amber-dark">
								{app.job.title}
							</p>
							<p className="text-sm text-ink-muted">{app.job.company}</p>
						</div>
						<div className="col-start-2 flex items-center justify-between gap-3 sm:ml-auto sm:justify-start">
							<StatusTag status={app.status} />
							<button
								onClick={(event) => {
									event.stopPropagation();
									handleWithdraw(app.id);
								}}
								className="btn-ghost text-xs"
							>
								{t.withdraw}
							</button>
						</div>
					</div>
				))}

			<Pagination meta={meta} onPageChange={setPage} />
		</div>
	);
}

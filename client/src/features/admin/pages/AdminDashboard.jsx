import { useEffect, useState } from 'react';
import { api, ApiError } from '../../../shared/api/client';
import Spinner from '../../../shared/components/Spinner';
import StatusTag from '../../../shared/components/StatusTag';

const JOB_STATUSES = ['draft', 'open', 'closed'];
const APPLICATION_STATUSES = [
	'pending',
	'reviewed',
	'shortlisted',
	'rejected',
	'hired',
];
const USER_ROLES = ['candidate', 'employer', 'admin'];
const DASHBOARD_FILTERS = [
	{ key: 'all', label: 'All', countKey: 'total' },
	{ key: 'users', label: 'Users', countKey: 'users' },
	{ key: 'jobs', label: 'Jobs', countKey: 'jobs' },
	{ key: 'applications', label: 'Applications', countKey: 'applications' },
];

function Section({ title, children }) {
	return (
		<section className="border-t border-line pt-6 mt-8">
			<h2 className="font-display text-2xl mb-4">{title}</h2>
			{children}
		</section>
	);
}

function InlineError({ message }) {
	return message ? <p className="text-rust text-sm mb-4">{message}</p> : null;
}

function DashboardFilter({ activeFilter, counts, onChange }) {
	return (
		<div
			className="flex max-w-full overflow-x-auto border-b border-line"
			aria-label="Filter admin dashboard"
			role="tablist"
		>
			{DASHBOARD_FILTERS.map((filter) => (
				<button
					key={filter.key}
					type="button"
					role="tab"
					aria-selected={activeFilter === filter.key}
					onClick={() => onChange(filter.key)}
					className={`shrink-0 border-b-2 px-3 py-3 text-sm transition-colors sm:px-4 ${
						activeFilter === filter.key
							? 'border-amber-dark text-ink'
							: 'border-transparent text-ink-muted hover:border-line hover:text-ink'
					}`}
				>
					{filter.label}
					<span className="ml-1 text-xs text-ink-faint">
						{counts[filter.countKey]}
					</span>
				</button>
			))}
		</div>
	);
}

export default function AdminDashboard() {
	const [users, setUsers] = useState([]);
	const [jobs, setJobs] = useState([]);
	const [applications, setApplications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [updating, setUpdating] = useState('');
	const [activeFilter, setActiveFilter] = useState('all');
	const [editingUser, setEditingUser] = useState(null);
	const [userDraft, setUserDraft] = useState({ name: '', email: '' });

	useEffect(() => {
		let cancelled = false;

		async function load() {
			setLoading(true);
			setError('');
			try {
				const [usersResponse, jobsResponse, applicationsResponse] =
					await Promise.all([
						api.get('/admin/users'),
						api.get('/admin/jobs'),
						api.get('/admin/applications'),
					]);
				if (!cancelled) {
					setUsers(usersResponse.data || []);
					setJobs(jobsResponse.data || []);
					setApplications(applicationsResponse.data || []);
				}
			} catch (err) {
				if (!cancelled) {
					setError(
						err instanceof ApiError
							? err.message
							: 'Could not load admin data.',
					);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		load();
		return () => {
			cancelled = true;
		};
	}, []);

	async function updateUser(user, changes) {
		setUpdating(`user-${user.id}`);
		try {
			const response = await api.patch(`/admin/users/${user.id}`, changes);
			const updated = response.data ?? response;
			setUsers((current) =>
				current.map((item) => (item.id === user.id ? updated : item)),
			);
			return true;
		} catch (err) {
			setError(
				err instanceof ApiError ? err.message : 'Could not update this user.',
			);
			return false;
		} finally {
			setUpdating('');
		}
	}

	function startEditingUser(user) {
		setError('');
		setEditingUser(user.id);
		setUserDraft({ name: user.name || '', email: user.email || '' });
	}

	async function saveUserEdit(user) {
		if (!userDraft.name.trim() || !userDraft.email.trim()) {
			setError('Name and email are required.');
			return;
		}

		const saved = await updateUser(user, {
			name: userDraft.name.trim(),
			email: userDraft.email.trim(),
		});
		if (saved) setEditingUser(null);
	}

	async function updateJob(job, status) {
		setUpdating(`job-${job.id}`);
		try {
			const response = await api.patch(`/admin/jobs/${job.id}/status`, {
				status,
			});
			const updated = response.data ?? response;
			setJobs((current) =>
				current.map((item) => (item.id === job.id ? updated : item)),
			);
		} catch (err) {
			setError(
				err instanceof ApiError ? err.message : 'Could not update this job.',
			);
		} finally {
			setUpdating('');
		}
	}

	async function updateApplication(application, status) {
		setUpdating(`application-${application.id}`);
		try {
			const response = await api.patch(
				`/admin/applications/${application.id}/status`,
				{ status },
			);
			const updated = response.data ?? response;
			setApplications((current) =>
				current.map((item) => (item.id === application.id ? updated : item)),
			);
		} catch (err) {
			setError(
				err instanceof ApiError
					? err.message
					: 'Could not update this application.',
			);
		} finally {
			setUpdating('');
		}
	}

	async function deleteRecord(type, record, label) {
		if (!window.confirm(`Delete ${label}? This action cannot be undone.`))
			return;

		const key = `${type}-${record.id}`;
		setUpdating(key);
		setError('');
		try {
			await api.delete(`/admin/${type}/${record.id}`);
			if (type === 'users') {
				setUsers((current) => current.filter((item) => item.id !== record.id));
			} else if (type === 'jobs') {
				setJobs((current) => current.filter((item) => item.id !== record.id));
			} else {
				setApplications((current) =>
					current.filter((item) => item.id !== record.id),
				);
			}
		} catch (err) {
			setError(
				err instanceof ApiError
					? err.message
					: `Could not delete this ${type.slice(0, -1)}.`,
			);
		} finally {
			setUpdating('');
		}
	}

	if (loading) {
		return (
			<div className="py-24 flex justify-center">
				<Spinner label="Loading admin dashboard" />
			</div>
		);
	}

	const counts = {
		users: users.length,
		jobs: jobs.length,
		applications: applications.length,
		total: users.length + jobs.length + applications.length,
	};

	return (
		<div>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
				<div>
					<h1 className="font-display text-3xl">Admin dashboard</h1>
					<p className="text-ink-muted text-sm mt-1">
						Review accounts, job postings, and applications.
					</p>
				</div>
				<p className="text-xs text-ink-faint sm:text-right">
					{users.length} users · {jobs.length} jobs · {applications.length}{' '}
					applications
				</p>
			</div>

			<InlineError message={error} />
			<DashboardFilter
				activeFilter={activeFilter}
				counts={counts}
				onChange={setActiveFilter}
			/>

			{(activeFilter === 'all' || activeFilter === 'users') && (
				<Section title="Users">
					{users.length === 0 ? (
						<p className="text-sm text-ink-muted">No users found.</p>
					) : (
						<div className="divide-y divide-line">
							{users.map((user) => (
								<div
									key={user.id}
									className="flex flex-col items-stretch justify-between gap-3 py-4 sm:flex-row sm:items-center"
								>
									{editingUser === user.id ? (
										<div className="grid flex-1 gap-2 sm:grid-cols-2">
											<input
												className="field-input"
												value={userDraft.name}
												onChange={(event) =>
													setUserDraft((current) => ({
														...current,
														name: event.target.value,
													}))
												}
												aria-label={`Name for ${user.name}`}
											/>
											<input
												type="email"
												className="field-input"
												value={userDraft.email}
												onChange={(event) =>
													setUserDraft((current) => ({
														...current,
														email: event.target.value,
													}))
												}
												aria-label={`Email for ${user.name}`}
											/>
										</div>
									) : (
										<div>
											<p className="font-display text-lg">{user.name}</p>
											<p className="text-sm text-ink-muted">{user.email}</p>
										</div>
									)}
									<div className="flex flex-wrap items-center gap-2">
										{editingUser === user.id ? (
											<>
												<button
													type="button"
													className="btn-primary text-sm"
													disabled={updating === `user-${user.id}`}
													onClick={() => saveUserEdit(user)}
												>
													Save
												</button>
												<button
													type="button"
													className="btn-ghost"
													disabled={updating === `user-${user.id}`}
													onClick={() => setEditingUser(null)}
												>
													Cancel
												</button>
											</>
										) : (
											<button
												type="button"
												className="btn-ghost"
												disabled={Boolean(updating)}
												onClick={() => startEditingUser(user)}
											>
												Edit
											</button>
										)}
										<select
											className="field-input w-auto text-sm py-1"
											value={user.role}
											disabled={updating === `user-${user.id}`}
											onChange={(event) =>
												updateUser(user, { role: event.target.value })
											}
											aria-label={`Role for ${user.name}`}
										>
											{USER_ROLES.map((role) => (
												<option key={role} value={role}>
													{role}
												</option>
											))}
										</select>
										<label className="flex items-center gap-2 text-sm text-ink-muted">
											<input
												type="checkbox"
												checked={user.is_active}
												disabled={updating === `user-${user.id}`}
												onChange={(event) =>
													updateUser(user, { is_active: event.target.checked })
												}
											/>
											Active
										</label>
										<button
											type="button"
											className="btn-ghost text-rust"
											disabled={updating === `users-${user.id}`}
											onClick={() =>
												deleteRecord('users', user, `user ${user.name}`)
											}
										>
											Delete
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</Section>
			)}

			{(activeFilter === 'all' || activeFilter === 'jobs') && (
				<Section title="Job postings">
					{jobs.length === 0 ? (
						<p className="text-sm text-ink-muted">No jobs found.</p>
					) : (
						<div className="divide-y divide-line">
							{jobs.map((job) => (
								<div
									key={job.id}
									className="flex flex-col items-stretch justify-between gap-3 py-4 sm:flex-row sm:items-center"
								>
									<div>
										<p className="font-display text-lg">{job.title}</p>
										<p className="text-sm text-ink-muted">
											{job.company?.name || 'Unknown company'} ·{' '}
											{job.applications_count || 0} applications
										</p>
									</div>
									<div className="flex flex-wrap items-center gap-2">
										<select
											className="field-input text-sm py-1 sm:w-auto"
											value={job.status}
											disabled={updating === `job-${job.id}`}
											onChange={(event) => updateJob(job, event.target.value)}
											aria-label={`Edit status for ${job.title}`}
										>
											{JOB_STATUSES.map((status) => (
												<option key={status} value={status}>
													{status}
												</option>
											))}
										</select>
										<button
											type="button"
											className="btn-ghost text-rust"
											disabled={updating === `jobs-${job.id}`}
											onClick={() =>
												deleteRecord('jobs', job, `job ${job.title}`)
											}
										>
											Delete
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</Section>
			)}

			{(activeFilter === 'all' || activeFilter === 'applications') && (
				<Section title="Applications">
					{applications.length === 0 ? (
						<p className="text-sm text-ink-muted">No applications found.</p>
					) : (
						<div className="divide-y divide-line">
							{applications.map((application) => (
								<div
									key={application.id}
									className="flex flex-col items-stretch justify-between gap-3 py-4 sm:flex-row sm:items-center"
								>
									<div>
										<p className="font-display text-lg">
											{application.candidate?.name || 'Unknown candidate'}
										</p>
										<p className="text-sm text-ink-muted">
											{application.job?.title || 'Unknown job'}
										</p>
									</div>
									<div className="flex flex-wrap items-center gap-3">
										<StatusTag status={application.status} />
										<select
											className="field-input text-sm py-1 sm:w-auto"
											value={application.status}
											disabled={updating === `application-${application.id}`}
											onChange={(event) =>
												updateApplication(application, event.target.value)
											}
											aria-label={`Status for application by ${application.candidate?.name || 'candidate'}`}
										>
											{APPLICATION_STATUSES.map((status) => (
												<option key={status} value={status}>
													{status}
												</option>
											))}
										</select>
										<button
											type="button"
											className="btn-ghost text-rust"
											disabled={updating === `applications-${application.id}`}
											onClick={() =>
												deleteRecord('applications', application, 'application')
											}
										>
											Delete
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</Section>
			)}
		</div>
	);
}

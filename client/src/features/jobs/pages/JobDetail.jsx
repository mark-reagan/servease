import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, ApiError } from '../../../shared/api/client';
import { useAuth } from '../../auth/context/AuthContext';
import {
	employmentLabel,
	workModeLabel,
	formatSalary,
} from '../../../shared/lib/format';
import Spinner from '../../../shared/components/Spinner';
import StatusTag from '../../../shared/components/StatusTag';

export default function JobDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();

	const [job, setJob] = useState(null);
	const [loading, setLoading] = useState(true);
	const [coverLetter, setCoverLetter] = useState('');
	const [resumeFile, setResumeFile] = useState(null);
	const [applying, setApplying] = useState(false);
	const [applyMessage, setApplyMessage] = useState('');
	const [applyError, setApplyError] = useState('');
	const [saved, setSaved] = useState(false);

	useEffect(() => {
		let cancelled = false;
		async function load() {
			setLoading(true);
			try {
				const res = await api.get(`/jobs/${id}`);
				if (!cancelled) {
					const loadedJob = res.data ?? res;
					setJob(loadedJob);
					setSaved(loadedJob.is_saved === true);
				}
			} catch {
				if (!cancelled) setJob(null);
			} finally {
				if (!cancelled) setLoading(false);
			}
		}
		load();
		return () => {
			cancelled = true;
		};
	}, [id]);

	async function handleApply(e) {
		e.preventDefault();
		setApplying(true);
		setApplyError('');
		setApplyMessage('');
		const data = new FormData();
		data.append('cover_letter', coverLetter);
		if (resumeFile) data.append('resume', resumeFile);
		try {
			await api.post(`/jobs/${id}/apply`, data);
			setApplyMessage(
				'Application sent. The employer can now see it on their end.',
			);
			setCoverLetter('');
			setResumeFile(null);
		} catch (err) {
			if (err instanceof ApiError) setApplyError(err.message);
			else setApplyError('Could not submit your application.');
		} finally {
			setApplying(false);
		}
	}

	async function handleSave() {
		try {
			if (saved) {
				await api.delete(`/jobs/${id}/save`);
				setSaved(false);
			} else {
				await api.post(`/jobs/${id}/save`);
				setSaved(true);
			}
		} catch {
			// fail quietly
		}
	}

	if (loading) {
		return (
			<div className="py-24 flex justify-center">
				<Spinner label="Opening posting…" />
			</div>
		);
	}

	if (!job) {
		return (
			<div className="py-24 text-center">
				<p className="font-display text-2xl mb-2">
					This posting isn't here anymore.
				</p>
				<Link to="/" className="text-amber-dark hover:underline text-sm">
					Back to all jobs
				</Link>
			</div>
		);
	}

	const salary = formatSalary(job);
	const isOwner =
		user?.role === 'employer' &&
		job.company?.id &&
		user.company_profile?.id === job.company.id;

	return (
		<div className="max-w-2xl mx-auto">
			<Link
				to="/"
				className="text-sm text-ink-muted hover:text-ink transition-colors"
			>
				← All jobs
			</Link>

			<div className="panel mt-4 relative">
				<div className="absolute -top-3 right-6 rotate-2">
					<StatusTag status={job.status} />
				</div>

				<div className="p-8">
					<p className="text-sm text-ink-muted">
						{job.company?.name || 'A company'}
					</p>
					<h1 className="font-display text-3xl mt-1">{job.title}</h1>

					<div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-ink-muted">
						{job.location && <span>{job.location}</span>}
						<span>{employmentLabel(job.employment_type)}</span>
						<span>{workModeLabel(job.work_mode)}</span>
						{salary && <span className="text-ink">{salary}</span>}
					</div>
				</div>

				<div
					className="border-t border-dashed border-line mx-8"
					style={{ borderTopWidth: '2px' }}
					aria-hidden="true"
				/>

				<div className="p-8 pt-6 space-y-6">
					<div>
						<h2 className="font-display text-lg mb-2">About the role</h2>
						<p className="text-sm text-ink-muted whitespace-pre-line leading-relaxed">
							{job.description}
						</p>
					</div>

					{job.requirements && (
						<div>
							<h2 className="font-display text-lg mb-2">
								What they're looking for
							</h2>
							<p className="text-sm text-ink-muted whitespace-pre-line leading-relaxed">
								{job.requirements}
							</p>
						</div>
					)}

					{job.skills?.length > 0 && (
						<div>
							<h2 className="font-display text-lg mb-2">Skills</h2>
							<div className="flex flex-wrap gap-2">
								{job.skills.map((skill) => (
									<span
										key={skill}
										className="text-xs border border-line px-2 py-1 text-ink-muted"
									>
										{skill}
									</span>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{isOwner && (
				<div className="mt-6 flex gap-3">
					<Link to={`/jobs/${job.id}/applicants`} className="btn-outline">
						View applicants
					</Link>
					<Link to={`/jobs/${job.id}/edit`} className="btn-ghost">
						Edit posting
					</Link>
				</div>
			)}

			{!isOwner && user?.role === 'candidate' && (
				<div className="mt-8 panel p-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="font-display text-lg">Apply to this role</h2>
						<button onClick={handleSave} className="btn-ghost text-sm">
							{saved ? 'Remove saved job' : 'Save job'}
						</button>
					</div>

					{applyMessage && (
						<p className="text-teal text-sm mb-4">{applyMessage}</p>
					)}
					{applyError && <p className="text-rust text-sm mb-4">{applyError}</p>}

					{!applyMessage && (
						<form onSubmit={handleApply} className="space-y-3">
							<div>
								<label className="field-label" htmlFor="cover_letter">
									Cover letter (optional)
								</label>
								<textarea
									id="cover_letter"
									rows={5}
									className="field-input"
									placeholder="Why this role, and why you."
									value={coverLetter}
									onChange={(e) => setCoverLetter(e.target.value)}
								/>
							</div>
							<div>
								<label className="field-label" htmlFor="resume">
									Resume (PDF or Word, optional)
								</label>
								<input
									id="resume"
									type="file"
									accept=".pdf,.doc,.docx"
									className="field-input"
									onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
								/>
								{resumeFile ? (
									<p className="text-xs text-teal mt-1">{resumeFile.name}</p>
								) : (
									user?.candidate_profile?.resume_path && (
										<p className="text-xs text-ink-faint mt-1">
											The resume on your profile will be used if you don't
											attach one.
										</p>
									)
								)}
							</div>
							<button type="submit" className="btn-primary" disabled={applying}>
								{applying ? 'Sending…' : 'Submit application'}
							</button>
						</form>
					)}
				</div>
			)}

			{!user && (
				<div className="mt-8 panel p-6 text-center">
					<p className="text-sm text-ink-muted mb-3">
						Log in as a candidate to apply.
					</p>
					<button onClick={() => navigate('/login')} className="btn-primary">
						Log in
					</button>
				</div>
			)}
		</div>
	);
}

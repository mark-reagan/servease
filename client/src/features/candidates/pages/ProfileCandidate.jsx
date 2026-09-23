import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, ApiError } from '../../../shared/api/client';
import { useAuth } from '../../auth/context/AuthContext';
import Spinner from '../../../shared/components/Spinner';
import { useLanguage } from '../../../shared/context/LanguageContext';

export default function ProfileCandidate() {
	const { user, refresh } = useAuth();
	const { t } = useLanguage();
	const [form, setForm] = useState(null);
	const [resumeFile, setResumeFile] = useState(null);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');

	useEffect(() => {
		if (user?.candidate_profile) {
			setForm({
				headline: user.candidate_profile.headline || '',
				bio: user.candidate_profile.bio || '',
				location: user.candidate_profile.location || '',
				skills: (user.candidate_profile.skills || []).join(', '),
				linkedin_url: user.candidate_profile.linkedin_url || '',
				portfolio_url: user.candidate_profile.portfolio_url || '',
				years_experience: user.candidate_profile.years_experience || '',
				open_to_work: user.candidate_profile.open_to_work ?? true,
			});
		}
	}, [user]);

	function update(key, value) {
		setForm((f) => ({ ...f, [key]: value }));
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setSaving(true);
		setMessage('');
		setError('');

		const data = new FormData();
		data.append('headline', form.headline);
		data.append('bio', form.bio);
		data.append('location', form.location);
		form.skills
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean)
			.forEach((skill) => data.append('skills[]', skill));
		data.append('linkedin_url', form.linkedin_url);
		data.append('portfolio_url', form.portfolio_url);
		if (form.years_experience)
			data.append('years_experience', form.years_experience);
		data.append('open_to_work', form.open_to_work ? '1' : '0');
		if (resumeFile) data.append('resume', resumeFile);

		try {
			await api.put('/profile/candidate', data);
			await refresh();
			setMessage(t.profileUpdated);
		} catch (err) {
			setError(err instanceof ApiError ? err.message : t.couldNotSaveProfile);
		} finally {
			setSaving(false);
		}
	}

	if (!form) {
		return (
			<div className="py-24 flex justify-center">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto">
			<div className="flex flex-wrap items-start justify-between gap-4 mb-8">
				<div>
					<h1 className="font-display text-3xl mb-1">{t.candidateProfile}</h1>
					<p className="text-ink-muted text-sm">
						{t.candidateProfileDescription}
					</p>
				</div>
				<Link to="/account-settings" className="btn-outline">
					{t.accountSettings}
				</Link>
			</div>

			{message && <p className="text-teal text-sm mb-4">{message}</p>}
			{error && <p className="text-rust text-sm mb-4">{error}</p>}

			<form onSubmit={handleSubmit} className="space-y-5">
				<div>
					<label className="field-label" htmlFor="headline">
						{t.headline}
					</label>
					<input
						id="headline"
						className="field-input"
						placeholder="e.g. Senior Backend Engineer"
						value={form.headline}
						onChange={(e) => update('headline', e.target.value)}
					/>
				</div>

				<div>
					<label className="field-label" htmlFor="bio">
						{t.bio}
					</label>
					<textarea
						id="bio"
						rows={5}
						className="field-input"
						value={form.bio}
						onChange={(e) => update('bio', e.target.value)}
					/>
				</div>

				<div className="grid sm:grid-cols-2 gap-4">
					<div>
						<label className="field-label" htmlFor="location">
							{t.location}
						</label>
						<input
							id="location"
							className="field-input"
							value={form.location}
							onChange={(e) => update('location', e.target.value)}
						/>
					</div>
					<div>
						<label className="field-label" htmlFor="years_experience">
							{t.yearsExperience}
						</label>
						<input
							id="years_experience"
							type="number"
							min="0"
							className="field-input"
							value={form.years_experience}
							onChange={(e) => update('years_experience', e.target.value)}
						/>
					</div>
				</div>

				<div>
					<label className="field-label" htmlFor="skills">
						{t.skillsCommaSeparated}
					</label>
					<input
						id="skills"
						className="field-input"
						value={form.skills}
						onChange={(e) => update('skills', e.target.value)}
					/>
				</div>

				<div className="grid sm:grid-cols-2 gap-4">
					<div>
						<label className="field-label" htmlFor="linkedin_url">
							{t.linkedinUrl}
						</label>
						<input
							id="linkedin_url"
							className="field-input"
							value={form.linkedin_url}
							onChange={(e) => update('linkedin_url', e.target.value)}
						/>
					</div>
					<div>
						<label className="field-label" htmlFor="portfolio_url">
							{t.portfolioUrl}
						</label>
						<input
							id="portfolio_url"
							className="field-input"
							value={form.portfolio_url}
							onChange={(e) => update('portfolio_url', e.target.value)}
						/>
					</div>
				</div>

				<div>
					<label className="field-label" htmlFor="resume">
						{t.resume}
					</label>
					<input
						id="resume"
						type="file"
						accept=".pdf,.doc,.docx"
						className="field-input"
						onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
					/>
					{user?.candidate_profile?.resume_path && !resumeFile && (
						<p className="text-xs text-ink-faint mt-1">{t.resumeOnFile}</p>
					)}
				</div>

				<label className="flex items-center gap-2 text-sm text-ink-muted">
					<input
						type="checkbox"
						checked={form.open_to_work}
						onChange={(e) => update('open_to_work', e.target.checked)}
					/>
					{t.openToNewRoles}
				</label>

				<button type="submit" className="btn-primary" disabled={saving}>
					{saving ? t.savingProfile : t.saveProfile}
				</button>
			</form>
		</div>
	);
}

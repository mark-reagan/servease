import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, ApiError } from '../../../shared/api/client';
import { useAuth } from '../../auth/context/AuthContext';
import Spinner from '../../../shared/components/Spinner';
import { useLanguage } from '../../../shared/context/LanguageContext';

export default function ProfileCompany() {
	const { user, refresh } = useAuth();
	const { t } = useLanguage();
	const [form, setForm] = useState(null);
	const [logoFile, setLogoFile] = useState(null);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');

	useEffect(() => {
		if (user?.company_profile) {
			setForm({
				company_name: user.company_profile.company_name || '',
				description: user.company_profile.description || '',
				website: user.company_profile.website || '',
				industry: user.company_profile.industry || '',
				company_size: user.company_profile.company_size || '',
				location: user.company_profile.location || '',
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
		Object.entries(form).forEach(([key, value]) =>
			data.append(key, value ?? ''),
		);
		if (logoFile) data.append('logo', logoFile);

		try {
			await api.put('/profile/company', data);
			await refresh();
			setMessage(t.companyProfileUpdated);
		} catch (err) {
			setError(
				err instanceof ApiError ? err.message : t.couldNotSaveCompanyProfile,
			);
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
					<h1 className="font-display text-3xl mb-1">{t.companyProfile}</h1>
					<p className="text-ink-muted text-sm">
						{t.companyProfileDescription}
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
					<label className="field-label" htmlFor="company_name">
						{t.companyName}
					</label>
					<input
						id="company_name"
						className="field-input"
						value={form.company_name}
						onChange={(e) => update('company_name', e.target.value)}
					/>
				</div>

				<div>
					<label className="field-label" htmlFor="description">
						{t.description}
					</label>
					<textarea
						id="description"
						rows={5}
						className="field-input"
						value={form.description}
						onChange={(e) => update('description', e.target.value)}
					/>
				</div>

				<div className="grid sm:grid-cols-2 gap-4">
					<div>
						<label className="field-label" htmlFor="website">
							{t.website}
						</label>
						<input
							id="website"
							className="field-input"
							placeholder="https://"
							value={form.website}
							onChange={(e) => update('website', e.target.value)}
						/>
					</div>
					<div>
						<label className="field-label" htmlFor="industry">
							{t.industry}
						</label>
						<input
							id="industry"
							className="field-input"
							value={form.industry}
							onChange={(e) => update('industry', e.target.value)}
						/>
					</div>
				</div>

				<div className="grid sm:grid-cols-2 gap-4">
					<div>
						<label className="field-label" htmlFor="company_size">
							{t.companySize}
						</label>
						<input
							id="company_size"
							className="field-input"
							placeholder="e.g. 11-50"
							value={form.company_size}
							onChange={(e) => update('company_size', e.target.value)}
						/>
					</div>
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
				</div>

				<div>
					<label className="field-label" htmlFor="logo">
						{t.logo}
					</label>
					<input
						id="logo"
						type="file"
						accept="image/*"
						className="field-input"
						onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
					/>
				</div>

				<button type="submit" className="btn-primary" disabled={saving}>
					{saving ? t.saving : t.saveCompanyProfile}
				</button>
			</form>
		</div>
	);
}

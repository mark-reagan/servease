import { useState } from 'react';
import { useLanguage } from '../../../shared/context/LanguageContext';

const EMPTY = {
	title: '',
	description: '',
	requirements: '',
	location: '',
	employment_type: 'full_time',
	work_mode: 'on_site',
	salary_min: '',
	salary_max: '',
	salary_currency: 'USD',
	skills: '',
	status: 'open',
};

export default function JobForm({ initial, onSubmit, submitLabel }) {
	const { t } = useLanguage();
	const [form, setForm] = useState(() => ({
		...EMPTY,
		...initial,
		skills: initial?.skills?.join(', ') || '',
	}));
	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState('');

	function update(key, value) {
		setForm((f) => ({ ...f, [key]: value }));
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setSubmitting(true);
		setError('');
		setErrors({});

		const payload = {
			...form,
			salary_min: form.salary_min ? Number(form.salary_min) : null,
			salary_max: form.salary_max ? Number(form.salary_max) : null,
			skills: form.skills
				? form.skills
						.split(',')
						.map((s) => s.trim())
						.filter(Boolean)
				: [],
		};

		try {
			await onSubmit(payload);
		} catch (err) {
			setError(err.message || t.postingSaved);
			setErrors(err.errors || {});
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
			{error && <p className="text-rust text-sm">{error}</p>}

			<div>
				<label className="field-label" htmlFor="title">
					{t.jobTitle}
				</label>
				<input
					id="title"
					required
					className="field-input"
					value={form.title}
					onChange={(e) => update('title', e.target.value)}
				/>
				{errors.title && (
					<p className="text-rust text-xs mt-1">{errors.title[0]}</p>
				)}
			</div>

			<div>
				<label className="field-label" htmlFor="description">
					{t.description}
				</label>
				<textarea
					id="description"
					required
					rows={6}
					className="field-input"
					value={form.description}
					onChange={(e) => update('description', e.target.value)}
				/>
				{errors.description && (
					<p className="text-rust text-xs mt-1">{errors.description[0]}</p>
				)}
			</div>

			<div>
				<label className="field-label" htmlFor="requirements">
					{t.requirementsOptional}
				</label>
				<textarea
					id="requirements"
					rows={4}
					className="field-input"
					value={form.requirements}
					onChange={(e) => update('requirements', e.target.value)}
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
						placeholder="e.g. Quezon, Palawan"
						value={form.location}
						onChange={(e) => update('location', e.target.value)}
					/>
				</div>
				<div>
					<label className="field-label" htmlFor="skills">
						{t.skillsCommaSeparated}
					</label>
					<input
						id="skills"
						className="field-input"
						placeholder="PHP, Laravel, MySQL"
						value={form.skills}
						onChange={(e) => update('skills', e.target.value)}
					/>
				</div>
			</div>

			<div className="grid sm:grid-cols-2 gap-4">
				<div>
					<label className="field-label" htmlFor="employment_type">
						{t.employmentType}
					</label>
					<select
						id="employment_type"
						className="field-input"
						value={form.employment_type}
						onChange={(e) => update('employment_type', e.target.value)}
					>
						<option value="full_time">{t.fullTime}</option>
						<option value="part_time">{t.partTime}</option>
						<option value="contract">{t.contract}</option>
						<option value="internship">{t.internship}</option>
						<option value="temporary">{t.temporary}</option>
					</select>
				</div>
				<div>
					<label className="field-label" htmlFor="work_mode">
						{t.workMode}
					</label>
					<select
						id="work_mode"
						className="field-input"
						value={form.work_mode}
						onChange={(e) => update('work_mode', e.target.value)}
					>
						<option value="on_site">{t.onSite}</option>
						<option value="remote">{t.remote}</option>
						<option value="hybrid">{t.hybrid}</option>
					</select>
				</div>
			</div>

			<div className="grid sm:grid-cols-3 gap-4">
				<div>
					<label className="field-label" htmlFor="salary_min">
						{t.salaryMin}
					</label>
					<input
						id="salary_min"
						type="number"
						min="0"
						className="field-input"
						value={form.salary_min}
						onChange={(e) => update('salary_min', e.target.value)}
					/>
				</div>
				<div>
					<label className="field-label" htmlFor="salary_max">
						{t.salaryMax}
					</label>
					<input
						id="salary_max"
						type="number"
						min="0"
						className="field-input"
						value={form.salary_max}
						onChange={(e) => update('salary_max', e.target.value)}
					/>
					{errors.salary_max && (
						<p className="text-rust text-xs mt-1">{errors.salary_max[0]}</p>
					)}
				</div>
				<div>
					<label className="field-label" htmlFor="salary_currency">
						{t.currency}
					</label>
					<input
						id="salary_currency"
						maxLength={3}
						className="field-input uppercase"
						value={form.salary_currency}
						onChange={(e) =>
							update('salary_currency', e.target.value.toUpperCase())
						}
					/>
				</div>
			</div>

			<div>
				<label className="field-label" htmlFor="status">
					{t.status}
				</label>
				<select
					id="status"
					className="field-input max-w-xs"
					value={form.status}
					onChange={(e) => update('status', e.target.value)}
				>
					<option value="draft">{t.draftHidden}</option>
					<option value="open">{t.openAccepting}</option>
					<option value="closed">{t.closed}</option>
				</select>
			</div>

			<button type="submit" className="btn-primary" disabled={submitting}>
				{submitting ? t.saving : submitLabel || t.publishPosting}
			</button>
		</form>
	);
}

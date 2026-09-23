import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../../../shared/api/client';

export default function Register() {
	const { register } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const [form, setForm] = useState({
		name: '',
		email: '',
		password: '',
		password_confirmation: '',
		role: 'candidate',
		company_name: '',
	});
	const [errors, setErrors] = useState({});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [showVerifyModal, setShowVerifyModal] = useState(false);

	function update(key, value) {
		setForm((f) => ({ ...f, [key]: value }));
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);
		setError('');
		setErrors({});
		try {
			await register(form);
			setShowVerifyModal(true);
		} catch (err) {
			if (err instanceof ApiError) {
				setErrors(err.errors || {});
				const validationMessage = Object.values(err.errors || {}).flat()[0];
				setError(validationMessage || err.message);
			} else {
				setError('Could not create your account.');
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="max-w-sm mx-auto py-10">
			<h1 className="font-display text-3xl mb-1">Join Servease</h1>
			<p className="text-ink-muted text-sm mb-8">
				Set up an account as a candidate or an employer.
			</p>

			<div className="grid grid-cols-2 gap-2 mb-6">
				{['candidate', 'employer'].map((role) => (
					<button
						key={role}
						type="button"
						onClick={() => update('role', role)}
						className={`border px-4 py-2 text-sm transition-colors ${
							form.role === role
								? 'border-ink bg-ink text-paper'
								: 'border-line text-ink-muted hover:border-ink'
						}`}
					>
						{role === 'candidate' ? "I'm looking for work" : "I'm hiring"}
					</button>
				))}
			</div>

			{error && <p className="text-rust text-sm mb-4">{error}</p>}

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="field-label" htmlFor="name">
						Full name
					</label>
					<input
						id="name"
						required
						className="field-input"
						value={form.name}
						onChange={(e) => update('name', e.target.value)}
					/>
					{errors.name && (
						<p className="text-rust text-xs mt-1">{errors.name[0]}</p>
					)}
				</div>

				{form.role === 'employer' && (
					<div>
						<label className="field-label" htmlFor="company_name">
							Company name
						</label>
						<input
							id="company_name"
							required
							className="field-input"
							value={form.company_name}
							onChange={(e) => update('company_name', e.target.value)}
						/>
						{errors.company_name && (
							<p className="text-rust text-xs mt-1">{errors.company_name[0]}</p>
						)}
					</div>
				)}

				<div>
					<label className="field-label" htmlFor="email">
						Email
					</label>
					<input
						id="email"
						type="email"
						required
						className="field-input"
						value={form.email}
						onChange={(e) => update('email', e.target.value)}
					/>
					{errors.email && (
						<p className="text-rust text-xs mt-1">{errors.email[0]}</p>
					)}
				</div>

				<div>
					<label className="field-label" htmlFor="password">
						Password
					</label>
					<input
						id="password"
						type="password"
						required
						className="field-input"
						value={form.password}
						onChange={(e) => update('password', e.target.value)}
					/>
					{errors.password && (
						<p className="text-rust text-xs mt-1">{errors.password[0]}</p>
					)}
				</div>

				<div>
					<label className="field-label" htmlFor="password_confirmation">
						Confirm password
					</label>
					<input
						id="password_confirmation"
						type="password"
						required
						className="field-input"
						value={form.password_confirmation}
						onChange={(e) => update('password_confirmation', e.target.value)}
					/>
				</div>

				<button type="submit" className="btn-primary w-full" disabled={loading}>
					{loading ? 'Creating account…' : 'Create account'}
				</button>
			</form>

			<p className="text-sm text-ink-muted mt-6">
				Already have an account?{' '}
				<Link to="/login" className="text-amber-dark hover:underline">
					Log in
				</Link>
			</p>

			{showVerifyModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4">
					<div className="bg-paper max-w-sm w-full p-6 border border-line">
						<h2 className="font-display text-2xl mb-2">Check your email</h2>
						<p className="text-sm text-ink-muted mb-6">
							We've sent a verification link to{' '}
							<strong className="text-ink">{form.email}</strong>. Please verify
							your email before logging in.
						</p>
						<button
							type="button"
							className="btn-primary w-full"
							onClick={() => navigate('/login', { state: location.state })}
						>
							Go to login
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

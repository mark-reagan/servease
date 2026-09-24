import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../../../shared/api/client';
import { useLanguage } from '../../../shared/context/LanguageContext';
import { useResendCooldown } from '../../../shared/lib/useResendCooldown';

const RESEND_COOLDOWN_SECONDS = 60;

export default function Register() {
	const { register, resendVerificationEmail } = useAuth();
	const { t } = useLanguage();
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
	const [resending, setResending] = useState(false);
	const [resendMessage, setResendMessage] = useState('');
	const [resendCooldown, startResendCooldown] = useResendCooldown(
		form.email,
		RESEND_COOLDOWN_SECONDS,
	);

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
			startResendCooldown();
		} catch (err) {
			if (err instanceof ApiError) {
				setErrors(err.errors || {});
				const validationMessage = Object.values(err.errors || {}).flat()[0];
				setError(validationMessage || err.message);
			} else {
				setError(t.couldNotCreateAccount);
			}
		} finally {
			setLoading(false);
		}
	}

	async function handleResend() {
		if (resending || resendCooldown > 0) return;
		setResending(true);
		setResendMessage('');
		try {
			await resendVerificationEmail(form.email);
			setResendMessage(t.verificationResent);
			startResendCooldown();
		} catch {
			setResendMessage(t.couldNotResendVerification);
		} finally {
			setResending(false);
		}
	}

	return (
		<div className="max-w-sm mx-auto py-10">
			<h1 className="font-display text-3xl mb-1">{t.joinServease}</h1>
			<p className="text-ink-muted text-sm mb-8">{t.registerDescription}</p>

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
						{role === 'candidate' ? t.lookingForWork : t.hiring}
					</button>
				))}
			</div>

			{error && <p className="text-rust text-sm mb-4">{error}</p>}

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="field-label" htmlFor="name">
						{t.fullName}
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
							{t.companyName}
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
						{t.email}
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
						{t.password}
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
						{t.confirmPassword}
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
					{loading ? t.creatingAccount : t.createAccount}
				</button>
			</form>

			<p className="text-sm text-ink-muted mt-6">
				{t.alreadyHaveAccount}{' '}
				<Link to="/login" className="text-amber-dark hover:underline">
					{t.logIn}
				</Link>
			</p>

			{showVerifyModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4">
					<div className="bg-paper max-w-sm w-full p-6 border border-line">
						<h2 className="font-display text-2xl mb-2">{t.checkEmail}</h2>
						<p className="text-sm text-ink-muted mb-6">
							{t.verificationSent}{' '}
							<strong className="text-ink">{form.email}</strong>. Please verify
							{t.verifyBeforeLogin}
						</p>

						<p className="text-xs text-ink-muted mb-2">{t.didntGetEmail}</p>
						<button
							type="button"
							className="btn-outline w-full mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
							onClick={handleResend}
							disabled={resending || resendCooldown > 0}
						>
							{resending
								? t.resendingEmail
								: resendCooldown > 0
									? t.resendAvailableIn.replace('{seconds}', resendCooldown)
									: t.resendVerificationEmail}
						</button>
						{resendMessage && (
							<p className="text-xs text-ink-muted mb-4">{resendMessage}</p>
						)}

						<button
							type="button"
							className="btn-primary w-full"
							onClick={() => navigate('/login', { state: location.state })}
						>
							{t.goToLogin}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

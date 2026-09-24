import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../../../shared/api/client';
import { useLanguage } from '../../../shared/context/LanguageContext';
import { useResendCooldown } from '../../../shared/lib/useResendCooldown';

const RESEND_COOLDOWN_SECONDS = 60;
const UNVERIFIED_MESSAGE =
	'Please verify your email address before logging in.';

export default function Login() {
	const { login, resendVerificationEmail } = useAuth();
	const { t } = useLanguage();
	const navigate = useNavigate();
	const location = useLocation();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [showVerifyModal, setShowVerifyModal] = useState(false);
	const [resending, setResending] = useState(false);
	const [resendMessage, setResendMessage] = useState('');
	const [resendCooldown, startResendCooldown] = useResendCooldown(
		email,
		RESEND_COOLDOWN_SECONDS,
	);

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);
		setError('');
		setResendMessage('');
		try {
			await login(email, password);
			navigate(location.state?.from?.pathname || '/');
		} catch (err) {
			setError(err instanceof ApiError ? err.message : t.couldNotLogin);
			if (err instanceof ApiError && err.message === UNVERIFIED_MESSAGE) {
				setShowVerifyModal(true);
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
			await resendVerificationEmail(email);
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
			<h1 className="font-display text-3xl mb-1">{t.welcomeBack}</h1>
			<p className="text-ink-muted text-sm mb-8">{t.loginDescription}</p>

			{error && <p className="text-rust text-sm mb-4">{error}</p>}

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="field-label" htmlFor="email">
						{t.email}
					</label>
					<input
						id="email"
						type="email"
						required
						className="field-input"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
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
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<button type="submit" className="btn-primary w-full" disabled={loading}>
					{loading ? t.loggingIn : t.logIn}
				</button>
			</form>

			<p className="text-sm text-ink-muted mt-6">
				{t.forgotPassword}{' '}
				<Link to="/forgot-password" className="text-amber-dark hover:underline">
					{t.resetItHere}
				</Link>
			</p>
			<p className="text-sm text-ink-muted mt-2">
				{t.newHere}{' '}
				<Link to="/register" className="text-amber-dark hover:underline">
					{t.createAccount}
				</Link>
			</p>

			{showVerifyModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4">
					<div className="bg-paper max-w-sm w-full p-6 border border-line">
						<h2 className="font-display text-2xl mb-2">{t.verifyYourEmail}</h2>
						<p className="text-sm text-ink-muted mb-6">
							{t.unverifiedLoginDescription}
						</p>

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
							onClick={() => setShowVerifyModal(false)}
						>
							{t.close}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../../../shared/api/client';
import { useLanguage } from '../../../shared/context/LanguageContext';

export default function ForgotPassword() {
	const { forgotPassword } = useAuth();
	const { t } = useLanguage();
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);
		setError('');
		setMessage('');
		try {
			const res = await forgotPassword(email);
			setMessage(res.message || t.resetEmailSent);
		} catch (err) {
			setError(err instanceof ApiError ? err.message : t.couldNotSendReset);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="max-w-md mx-auto py-10">
			<h1 className="font-display text-3xl mb-1">{t.resetPassword}</h1>
			<p className="text-ink-muted text-sm mb-8">{t.resetDescription}</p>

			{message && <p className="text-green-700 text-sm mb-4">{message}</p>}
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

				<button type="submit" className="btn-primary w-full" disabled={loading}>
					{loading ? t.sendingLink : t.sendResetLink}
				</button>
			</form>

			<p className="text-sm text-ink-muted mt-6">
				{t.rememberedIt}{' '}
				<Link to="/login" className="text-amber-dark hover:underline">
					{t.backToLogin}
				</Link>
			</p>
		</div>
	);
}

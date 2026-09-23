import { useState, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../../../shared/api/client';
import { useLanguage } from '../../../shared/context/LanguageContext';

export default function ResetPassword() {
	const { resetPassword } = useAuth();
	const { t } = useLanguage();
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const token = params.get('token') || '';
	const email = params.get('email') || '';
	const [form, setForm] = useState({
		password: '',
		password_confirmation: '',
	});
	const [error, setError] = useState('');
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);

	const validRequest = useMemo(() => Boolean(token && email), [token, email]);

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);
		setError('');
		setMessage('');
		try {
			const res = await resetPassword({
				token,
				email,
				password: form.password,
				password_confirmation: form.password_confirmation,
			});
			setMessage(res.message || t.passwordReset);
			setTimeout(() => navigate('/login'), 1500);
		} catch (err) {
			setError(err instanceof ApiError ? err.message : t.couldNotReset);
		} finally {
			setLoading(false);
		}
	}

	if (!validRequest) {
		return (
			<div className="max-w-md mx-auto py-10">
				<h1 className="font-display text-3xl mb-1">{t.invalidResetLink}</h1>
				<p className="text-ink-muted text-sm mb-8">
					{t.invalidResetDescription}
				</p>
				<Link to="/forgot-password" className="btn-primary inline-block">
					{t.requestNewResetLink}
				</Link>
			</div>
		);
	}

	return (
		<div className="max-w-md mx-auto py-10">
			<h1 className="font-display text-3xl mb-1">{t.chooseNewPassword}</h1>
			<p className="text-ink-muted text-sm mb-8">{t.newPasswordDescription}</p>

			{message && <p className="text-green-700 text-sm mb-4">{message}</p>}
			{error && <p className="text-rust text-sm mb-4">{error}</p>}

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="field-label" htmlFor="password">
						{t.newPassword}
					</label>
					<input
						id="password"
						type="password"
						required
						className="field-input"
						value={form.password}
						onChange={(e) =>
							setForm((prev) => ({ ...prev, password: e.target.value }))
						}
					/>
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
						onChange={(e) =>
							setForm((prev) => ({
								...prev,
								password_confirmation: e.target.value,
							}))
						}
					/>
				</div>

				<button type="submit" className="btn-primary w-full" disabled={loading}>
					{loading ? t.resettingPassword : t.resetPasswordButton}
				</button>
			</form>
		</div>
	);
}

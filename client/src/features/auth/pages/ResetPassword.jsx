import { useState, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../../../shared/api/client';
import { useLanguage } from '../../../shared/context/LanguageContext';
import { Eye, EyeOff } from 'lucide-react';

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
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

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
					<div className="relative">
						<input
							id="password"
							type={showPassword ? 'text' : 'password'}
							required
							className="field-input pr-10"
							value={form.password}
							onChange={(e) =>
								setForm((prev) => ({ ...prev, password: e.target.value }))
							}
						/>
						<button
							type="button"
							className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-muted hover:text-ink"
							onClick={() => setShowPassword((visible) => !visible)}
							aria-label={showPassword ? 'Hide password' : 'Show password'}
							title={showPassword ? 'Hide password' : 'Show password'}
						>
							{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
						</button>
					</div>
				</div>

				<div>
					<label className="field-label" htmlFor="password_confirmation">
						{t.confirmPassword}
					</label>
					<div className="relative">
						<input
							id="password_confirmation"
							type={showPasswordConfirmation ? 'text' : 'password'}
							required
							className="field-input pr-10"
							value={form.password_confirmation}
							onChange={(e) =>
								setForm((prev) => ({
									...prev,
									password_confirmation: e.target.value,
								}))
							}
						/>
						<button
							type="button"
							className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-muted hover:text-ink"
							onClick={() =>
								setShowPasswordConfirmation((visible) => !visible)
							}
							aria-label={
								showPasswordConfirmation
									? 'Hide password confirmation'
									: 'Show password confirmation'
							}
							title={
								showPasswordConfirmation
									? 'Hide password confirmation'
									: 'Show password confirmation'
							}
						>
							{showPasswordConfirmation ? (
								<EyeOff size={18} />
							) : (
								<Eye size={18} />
							)}
						</button>
					</div>
				</div>

				<button type="submit" className="btn-primary w-full" disabled={loading}>
					{loading ? t.resettingPassword : t.resetPasswordButton}
				</button>
			</form>
		</div>
	);
}

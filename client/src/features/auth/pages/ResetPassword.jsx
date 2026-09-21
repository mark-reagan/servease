import { useState, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../../../shared/api/client';

export default function ResetPassword() {
	const { resetPassword } = useAuth();
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
			setMessage(res.message || 'Your password has been reset.');
			setTimeout(() => navigate('/login'), 1500);
		} catch (err) {
			setError(
				err instanceof ApiError
					? err.message
					: 'Could not reset your password.',
			);
		} finally {
			setLoading(false);
		}
	}

	if (!validRequest) {
		return (
			<div className="max-w-md mx-auto py-10">
				<h1 className="font-display text-3xl mb-1">Invalid reset link</h1>
				<p className="text-ink-muted text-sm mb-8">
					The reset link is missing required details. Please request a new one.
				</p>
				<Link to="/forgot-password" className="btn-primary inline-block">
					Request a new reset link
				</Link>
			</div>
		);
	}

	return (
		<div className="max-w-md mx-auto py-10">
			<h1 className="font-display text-3xl mb-1">Choose a new password</h1>
			<p className="text-ink-muted text-sm mb-8">
				Create a password with at least 8 characters.
			</p>

			{message && <p className="text-green-700 text-sm mb-4">{message}</p>}
			{error && <p className="text-rust text-sm mb-4">{error}</p>}

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="field-label" htmlFor="password">
						New password
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
						Confirm password
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
					{loading ? 'Resetting password…' : 'Reset password'}
				</button>
			</form>
		</div>
	);
}

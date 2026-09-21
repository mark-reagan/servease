import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../../../shared/api/client';

export default function ForgotPassword() {
	const { forgotPassword } = useAuth();
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
			setMessage(res.message || 'We have emailed your password reset link.');
		} catch (err) {
			setError(
				err instanceof ApiError ? err.message : 'Could not send reset email.',
			);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="max-w-md mx-auto py-10">
			<h1 className="font-display text-3xl mb-1">Reset your password</h1>
			<p className="text-ink-muted text-sm mb-8">
				Enter your email and we’ll send a secure reset link.
			</p>

			{message && <p className="text-green-700 text-sm mb-4">{message}</p>}
			{error && <p className="text-rust text-sm mb-4">{error}</p>}

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="field-label" htmlFor="email">
						Email
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
					{loading ? 'Sending link…' : 'Send reset link'}
				</button>
			</form>

			<p className="text-sm text-ink-muted mt-6">
				Remembered it?{' '}
				<Link to="/login" className="text-amber-dark hover:underline">
					Back to login
				</Link>
			</p>
		</div>
	);
}

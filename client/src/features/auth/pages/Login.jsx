import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../../../shared/api/client';

export default function Login() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);
		setError('');
		try {
			await login(email, password);
			navigate(location.state?.from?.pathname || '/');
		} catch (err) {
			setError(err instanceof ApiError ? err.message : 'Could not log in.');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="max-w-sm mx-auto py-10">
			<h1 className="font-display text-3xl mb-1">Welcome back</h1>
			<p className="text-ink-muted text-sm mb-8">
				Log in to keep track of your search.
			</p>

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
				<div>
					<label className="field-label" htmlFor="password">
						Password
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
					{loading ? 'Logging in…' : 'Log in'}
				</button>
			</form>

			<p className="text-sm text-ink-muted mt-6">
				Forgot your password?{' '}
				<Link to="/forgot-password" className="text-amber-dark hover:underline">
					Reset it here
				</Link>
			</p>
			<p className="text-sm text-ink-muted mt-2">
				New here?{' '}
				<Link to="/register" className="text-amber-dark hover:underline">
					Create an account
				</Link>
			</p>
		</div>
	);
}

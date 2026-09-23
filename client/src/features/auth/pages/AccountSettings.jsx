import { useState } from 'react';
import { api, ApiError } from '../../../shared/api/client';
import { useAuth } from '../context/AuthContext';

export default function AccountSettings() {
	const { user, refresh } = useAuth();
	const [email, setEmail] = useState(user?.email || '');
	const [currentPassword, setCurrentPassword] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirmation, setPasswordConfirmation] = useState('');
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');

	async function handleSubmit(event) {
		event.preventDefault();
		setSaving(true);
		setMessage('');
		setError('');

		try {
			const response = await api.put('/account', {
				email,
				current_password: currentPassword || undefined,
				password: password || undefined,
				password_confirmation: passwordConfirmation || undefined,
			});
			await refresh();
			setCurrentPassword('');
			setPassword('');
			setPasswordConfirmation('');
			setMessage(response.message || 'Account settings updated.');
		} catch (err) {
			setError(
				err instanceof ApiError
					? err.message
					: 'Could not update account settings.',
			);
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="max-w-2xl mx-auto">
			<h1 className="font-display text-3xl mb-1">Account settings</h1>
			<p className="text-ink-muted text-sm mb-8">
				Manage the email address and password used to sign in.
			</p>

			{message && <p className="text-teal text-sm mb-4">{message}</p>}
			{error && <p className="text-rust text-sm mb-4">{error}</p>}

			<form onSubmit={handleSubmit} className="space-y-5">
				<div>
					<label className="field-label" htmlFor="email">
						Email address
					</label>
					<input
						id="email"
						type="email"
						autoComplete="email"
						className="field-input"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						required
					/>
				</div>

				<div className="border-t border-line pt-5 space-y-5">
					<div>
						<label className="field-label" htmlFor="current_password">
							Current password
						</label>
						<input
							id="current_password"
							type="password"
							autoComplete="current-password"
							className="field-input"
							value={currentPassword}
							onChange={(event) => setCurrentPassword(event.target.value)}
						/>
					</div>
					<div className="grid sm:grid-cols-2 gap-4">
						<div>
							<label className="field-label" htmlFor="password">
								New password
							</label>
							<input
								id="password"
								type="password"
								autoComplete="new-password"
								className="field-input"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
							/>
						</div>
						<div>
							<label className="field-label" htmlFor="password_confirmation">
								Confirm new password
							</label>
							<input
								id="password_confirmation"
								type="password"
								autoComplete="new-password"
								className="field-input"
								value={passwordConfirmation}
								onChange={(event) =>
									setPasswordConfirmation(event.target.value)
								}
							/>
						</div>
					</div>
				</div>

				<button type="submit" className="btn-primary" disabled={saving}>
					{saving ? 'Saving...' : 'Save account settings'}
				</button>
			</form>
		</div>
	);
}

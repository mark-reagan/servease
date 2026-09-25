import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiError } from '../../../shared/api/client';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../../../shared/context/LanguageContext';
import { Eye, EyeOff } from 'lucide-react';

export default function AccountSettings() {
	const { user, refresh, logout } = useAuth();
	const { t } = useLanguage();
	const navigate = useNavigate();
	const [email, setEmail] = useState(user?.email || '');
	const [currentPassword, setCurrentPassword] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirmation, setPasswordConfirmation] = useState('');
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	const [deletePassword, setDeletePassword] = useState('');
	const [deleteConfirmation, setDeleteConfirmation] = useState('');
	const [deleting, setDeleting] = useState(false);
	const [deleteError, setDeleteError] = useState('');
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
	const [showDeletePassword, setShowDeletePassword] = useState(false);

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
			setMessage(response.message || t.accountSettingsUpdated);
		} catch (err) {
			setError(err instanceof ApiError ? err.message : t.couldNotUpdateAccount);
		} finally {
			setSaving(false);
		}
	}

	async function handleDeleteAccount(event) {
		event.preventDefault();
		setDeleting(true);
		setDeleteError('');

		try {
			await api.delete('/account', {
				current_password: deletePassword,
				confirmation: deleteConfirmation,
			});
			await logout();
			navigate('/login', { replace: true });
		} catch (err) {
			setDeleteError(
				err instanceof ApiError ? err.message : t.couldNotDeleteAccount,
			);
		} finally {
			setDeleting(false);
		}
	}

	return (
		<div className="max-w-2xl mx-auto">
			<h1 className="font-display text-3xl mb-1">{t.accountSettings}</h1>
			<p className="text-ink-muted text-sm mb-8">
				{t.accountSettingsDescription}
			</p>

			{message && <p className="text-teal text-sm mb-4">{message}</p>}
			{error && <p className="text-rust text-sm mb-4">{error}</p>}

			<form onSubmit={handleSubmit} className="space-y-5">
				<div>
					<label className="field-label" htmlFor="email">
						{t.emailAddress}
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
							{t.currentPassword}
						</label>
						<div className="relative">
							<input
								id="current_password"
								type={showCurrentPassword ? 'text' : 'password'}
								autoComplete="current-password"
								className="field-input pr-10"
								value={currentPassword}
								onChange={(event) => setCurrentPassword(event.target.value)}
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-muted hover:text-ink"
								onClick={() => setShowCurrentPassword((visible) => !visible)}
								aria-label={
									showCurrentPassword ? 'Hide current password' : 'Show current password'
								}
								title={
									showCurrentPassword ? 'Hide current password' : 'Show current password'
								}
							>
								{showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>
					</div>
					<div className="grid sm:grid-cols-2 gap-4">
						<div>
							<label className="field-label" htmlFor="password">
								{t.newPassword}
							</label>
							<div className="relative">
								<input
									id="password"
									type={showPassword ? 'text' : 'password'}
									autoComplete="new-password"
									className="field-input pr-10"
									value={password}
									onChange={(event) => setPassword(event.target.value)}
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
								{t.confirmNewPassword}
							</label>
							<div className="relative">
								<input
									id="password_confirmation"
									type={showPasswordConfirmation ? 'text' : 'password'}
									autoComplete="new-password"
									className="field-input pr-10"
									value={passwordConfirmation}
									onChange={(event) =>
										setPasswordConfirmation(event.target.value)
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
					</div>
				</div>

				<button type="submit" className="btn-primary" disabled={saving}>
					{saving ? t.saving : t.saveAccountSettings}
				</button>
			</form>

			<section
				className="mt-12 border border-rust bg-rust/5 p-5"
				aria-labelledby="delete-account-heading"
			>
				<h2
					id="delete-account-heading"
					className="font-display text-xl text-rust-dark"
				>
					{t.deleteAccount}
				</h2>
				<p className="text-sm text-ink-muted mt-2">
					{t.deleteAccountDescription}
				</p>
				{!showDeleteConfirmation ? (
					<button
						type="button"
						className="btn mt-5 border border-rust bg-rust text-white hover:bg-rust-dark"
						onClick={() => setShowDeleteConfirmation(true)}
					>
						{t.deleteMyAccount}
					</button>
				) : (
					<form
						onSubmit={handleDeleteAccount}
						className="mt-5 space-y-4 border-t border-rust/30 pt-5"
					>
						<p className="text-sm font-medium text-rust-dark">
							{t.finalDeleteConfirmation}
						</p>
						{deleteError && <p className="text-rust text-sm">{deleteError}</p>}
						<div>
							<label className="field-label" htmlFor="delete_confirmation">
								{t.typeDelete}
							</label>
							<input
								id="delete_confirmation"
								className="field-input"
								value={deleteConfirmation}
								onChange={(event) => setDeleteConfirmation(event.target.value)}
								autoComplete="off"
								required
							/>
						</div>
						<div>
							<label className="field-label" htmlFor="delete_password">
								{t.currentPassword}
							</label>
							<div className="relative">
								<input
									id="delete_password"
									type={showDeletePassword ? 'text' : 'password'}
									className="field-input pr-10"
									value={deletePassword}
									onChange={(event) => setDeletePassword(event.target.value)}
									autoComplete="current-password"
									required
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-muted hover:text-ink"
									onClick={() => setShowDeletePassword((visible) => !visible)}
									aria-label={
										showDeletePassword
											? 'Hide delete password'
											: 'Show delete password'
									}
									title={
										showDeletePassword
											? 'Hide delete password'
											: 'Show delete password'
									}
								>
									{showDeletePassword ? <EyeOff size={18} /> : <Eye size={18} />}
								</button>
							</div>
						</div>
						<div className="flex flex-wrap gap-3">
							<button
								type="submit"
								className="btn border border-rust bg-rust text-white hover:bg-rust-dark"
								disabled={deleting || deleteConfirmation !== 'DELETE'}
							>
								{deleting ? t.deletingAccount : t.permanentlyDelete}
							</button>
							<button
								type="button"
								className="btn-outline"
								disabled={deleting}
								onClick={() => {
									setShowDeleteConfirmation(false);
									setDeletePassword('');
									setDeleteConfirmation('');
									setDeleteError('');
								}}
							>
								Cancel
							</button>
						</div>
					</form>
				)}
			</section>
		</div>
	);
}

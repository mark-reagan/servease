import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../features/auth/context/AuthContext';

function navLinkClass({ isActive }) {
	return `hover:text-amber-dark transition-colors ${
		isActive ? 'text-amber-dark' : 'text-ink-muted'
	}`;
}

function mobileNavLinkClass({ isActive }) {
	return `block hover:text-amber-dark transition-colors ${
		isActive ? 'text-amber-dark' : 'text-ink-muted'
	}`;
}

function ctaNavLinkClass({ isActive }) {
	return isActive ? 'btn bg-amber-dark text-paper' : 'btn-primary';
}

export default function Navbar() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

	async function handleLogout() {
		setIsLogoutModalOpen(false);
		await logout();
		navigate('/');
	}

	function openLogoutModal() {
		setIsMenuOpen(false);
		setIsLogoutModalOpen(true);
	}

	return (
		<>
			<header className="border-b border-line bg-paper/95 backdrop-blur sticky top-0 z-10">
				<div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
					<Link to="/" className="font-display text-xl tracking-tight text-ink">
						Servease
					</Link>

					<nav className="hidden sm:flex items-center gap-6 text-sm">
						<NavLink to="/" className={navLinkClass} end>
							Find work
						</NavLink>

						{!user && (
							<>
								<NavLink to="/login" className={navLinkClass}>
									Log in
								</NavLink>
								<NavLink to="/register" className={ctaNavLinkClass}>
									Get started
								</NavLink>
							</>
						)}

						{user?.role === 'candidate' && (
							<>
								<NavLink to="/saved-jobs" className={navLinkClass}>
									Saved jobs
								</NavLink>
								<NavLink to="/dashboard" className={navLinkClass}>
									My applications
								</NavLink>
								<NavLink to="/profile/candidate" className={navLinkClass}>
									Profile
								</NavLink>
							</>
						)}

						{user?.role === 'employer' && (
							<>
								<NavLink to="/dashboard" className={navLinkClass}>
									My postings
								</NavLink>
								<NavLink to="/jobs/new" className={ctaNavLinkClass}>
									Post a job
								</NavLink>
								<NavLink to="/profile/company" className={navLinkClass}>
									Company profile
								</NavLink>
							</>
						)}

						{user && (
							<button
								type="button"
								onClick={openLogoutModal}
								className="btn text-rust hover:bg-rust hover:text-paper"
							>
								Log out
							</button>
						)}
					</nav>

					<button
						type="button"
						className="sm:hidden text-ink p-2"
						onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
						aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
						aria-expanded={isMenuOpen}
					>
						{isMenuOpen ? <X size={22} /> : <Menu size={22} />}
					</button>
				</div>

				<nav
					className={`sm:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
						isMenuOpen
							? 'max-h-[32rem] opacity-100'
							: 'max-h-0 opacity-0 pointer-events-none'
					}`}
					aria-hidden={!isMenuOpen}
				>
					<div className="border-t border-line px-5 py-4 space-y-3 text-sm">
						<NavLink
							to="/"
							className={mobileNavLinkClass}
							onClick={() => setIsMenuOpen(false)}
							end
						>
							Find work
						</NavLink>
						{!user && (
							<>
								<NavLink
									to="/login"
									className={mobileNavLinkClass}
									onClick={() => setIsMenuOpen(false)}
								>
									Log in
								</NavLink>
								<NavLink
									to="/register"
									className={({ isActive }) =>
										`${ctaNavLinkClass({ isActive })} w-full`
									}
									onClick={() => setIsMenuOpen(false)}
								>
									Get started
								</NavLink>
							</>
						)}

						{user?.role === 'candidate' && (
							<>
								<NavLink
									to="/saved-jobs"
									className={mobileNavLinkClass}
									onClick={() => setIsMenuOpen(false)}
								>
									Saved jobs
								</NavLink>
								<NavLink
									to="/dashboard"
									className={mobileNavLinkClass}
									onClick={() => setIsMenuOpen(false)}
								>
									My applications
								</NavLink>
								<NavLink
									to="/profile/candidate"
									className={mobileNavLinkClass}
									onClick={() => setIsMenuOpen(false)}
								>
									Profile
								</NavLink>
							</>
						)}

						{user?.role === 'employer' && (
							<>
								<NavLink
									to="/dashboard"
									className={mobileNavLinkClass}
									onClick={() => setIsMenuOpen(false)}
								>
									My postings
								</NavLink>
								<NavLink
									to="/jobs/new"
									className={({ isActive }) =>
										`${ctaNavLinkClass({ isActive })} w-full`
									}
									onClick={() => setIsMenuOpen(false)}
								>
									Post a job
								</NavLink>
								<NavLink
									to="/profile/company"
									className={mobileNavLinkClass}
									onClick={() => setIsMenuOpen(false)}
								>
									Company profile
								</NavLink>
							</>
						)}

						{user && (
							<button
								type="button"
								onClick={openLogoutModal}
								className="btn text-rust hover:bg-rust hover:text-paper px-0"
							>
								Log out
							</button>
						)}
					</div>
				</nav>
			</header>

			{isLogoutModalOpen && (
				<div
					className="fixed inset-0 z-20 flex items-center justify-center bg-ink/40 px-5"
					role="presentation"
					onMouseDown={(event) => {
						if (event.target === event.currentTarget) {
							setIsLogoutModalOpen(false);
						}
					}}
				>
					<div
						className="panel w-full max-w-md p-6 shadow-lg"
						role="dialog"
						aria-modal="true"
						aria-labelledby="logout-title"
						aria-describedby="logout-description"
						tabIndex="-1"
						onKeyDown={(event) => {
							if (event.key === 'Escape') {
								setIsLogoutModalOpen(false);
							}
						}}
					>
						<h2 id="logout-title" className="font-display text-2xl text-ink">
							Log out?
						</h2>
						<p id="logout-description" className="mt-2 text-sm text-ink-muted">
							Are you sure you want to log out of your account?
						</p>
						<div className="mt-6 flex justify-end gap-3">
							<button
								type="button"
								className="btn-outline"
								onClick={() => setIsLogoutModalOpen(false)}
							>
								Cancel
							</button>
							<button
								type="button"
								className="btn bg-rust text-paper hover:bg-rust-dark"
								onClick={handleLogout}
							>
								Log out
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

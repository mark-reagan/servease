import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../features/auth/context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import logo from '../../assets/logo.svg';

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
	const { language, setLanguage, t } = useLanguage();
	const { theme, toggleTheme } = useTheme();
	const navigate = useNavigate();
	const isAuthenticated = Boolean(user);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
	const mobileMenuRef = useRef(null);
	const mobileMenuToggleRef = useRef(null);

	useEffect(() => {
		function handlePointerDown(event) {
			if (
				isMenuOpen &&
				!mobileMenuRef.current?.contains(event.target) &&
				!mobileMenuToggleRef.current?.contains(event.target)
			) {
				setIsMenuOpen(false);
			}
		}

		document.addEventListener('pointerdown', handlePointerDown);
		return () => document.removeEventListener('pointerdown', handlePointerDown);
	}, [isMenuOpen]);

	async function handleLogout() {
		setIsLogoutModalOpen(false);
		await logout();
		navigate('/');
	}

	function openLogoutModal() {
		setIsMenuOpen(false);
		setIsLogoutModalOpen(true);
	}

	function themeToggle(className = '') {
		return (
			<button
				type="button"
				onClick={toggleTheme}
				className={`inline-flex items-center justify-center p-1.5 text-ink-muted hover:text-ink transition-colors ${className}`}
				aria-label={theme === 'dark' ? t.switchLightTheme : t.switchDarkTheme}
			>
				{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
			</button>
		);
	}

	function languageSelector(className = '') {
		return (
			<label className={`text-ink-muted ${className}`}>
				<span className="sr-only">{t.language}</span>
				<select
					value={language}
					onChange={(event) => setLanguage(event.target.value)}
					className="border border-line bg-panel px-2 py-1.5 text-sm text-ink focus:border-ink"
					aria-label={t.language}
				>
					<option value="en">English</option>
					<option value="fil">Filipino</option>
				</select>
			</label>
		);
	}

	return (
		<>
			<header className="border-b border-line bg-paper/95 backdrop-blur sticky top-0 z-10">
				<div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
					<Link
						to="/"
						className="mr-6 flex items-center gap-0 font-display text-xl tracking-[0.12em] text-blue-dark transition-colors hover:text-blue-dark"
					>
						<img src={logo} alt="" className="mr-1 h-8 w-8" />
						<span className="font-black text-blue-dark">SERV</span>
						<span className="font-light text-amber-dark">EASE</span>
					</Link>

					<nav
						className={`${isAuthenticated ? 'hidden min-[840px]:flex' : 'hidden sm:flex'} items-center gap-6 text-sm`}
					>
						{themeToggle()}
						{languageSelector()}
						<NavLink to="/" className={navLinkClass} end>
							{t.findWork}
						</NavLink>

						{!user && (
							<>
								<NavLink to="/login" className={navLinkClass}>
									{t.logIn}
								</NavLink>
								<NavLink to="/register" className={ctaNavLinkClass}>
									{t.getStarted}
								</NavLink>
							</>
						)}

						{user?.role === 'candidate' && (
							<>
								<NavLink to="/saved-jobs" className={navLinkClass}>
									{t.savedJobs}
								</NavLink>
								<NavLink to="/dashboard" className={navLinkClass}>
									{t.myApplications}
								</NavLink>
								<NavLink to="/profile/candidate" className={navLinkClass}>
									{t.profile}
								</NavLink>
							</>
						)}

						{user?.role === 'employer' && (
							<>
								<NavLink to="/dashboard" className={navLinkClass}>
									{t.myPostings}
								</NavLink>
								<NavLink to="/jobs/new" className={ctaNavLinkClass}>
									{t.postJob}
								</NavLink>
								<NavLink to="/profile/company" className={navLinkClass}>
									{t.companyProfile}
								</NavLink>
							</>
						)}

						{user && (
							<button
								type="button"
								onClick={openLogoutModal}
								className="btn text-rust hover:bg-rust hover:text-paper"
							>
								{t.logOut}
							</button>
						)}
					</nav>

					<div
						className={`${isAuthenticated ? 'min-[840px]:hidden' : 'sm:hidden'} flex items-center gap-2`}
					>
						{themeToggle()}
						<button
							type="button"
							ref={mobileMenuToggleRef}
							className="text-ink p-2"
							onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
							aria-label={isMenuOpen ? t.closeMenu : t.openMenu}
							aria-expanded={isMenuOpen}
						>
							{isMenuOpen ? <X size={22} /> : <Menu size={22} />}
						</button>
					</div>
				</div>

				<nav
					ref={mobileMenuRef}
					className={`${isAuthenticated ? 'min-[840px]:hidden' : 'sm:hidden'} overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
						isMenuOpen
							? 'max-h-[32rem] opacity-100'
							: 'max-h-0 opacity-0 pointer-events-none'
					}`}
					aria-hidden={!isMenuOpen}
				>
					<div className="border-t border-line px-5 py-4 space-y-3 text-sm">
						{languageSelector('block')}
						<NavLink
							to="/"
							className={mobileNavLinkClass}
							onClick={() => setIsMenuOpen(false)}
							end
						>
							{t.findWork}
						</NavLink>
						{!user && (
							<>
								<NavLink
									to="/login"
									className={mobileNavLinkClass}
									onClick={() => setIsMenuOpen(false)}
								>
									{t.logIn}
								</NavLink>
								<NavLink
									to="/register"
									className={({ isActive }) =>
										`${ctaNavLinkClass({ isActive })} w-full`
									}
									onClick={() => setIsMenuOpen(false)}
								>
									{t.getStarted}
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
									{t.savedJobs}
								</NavLink>
								<NavLink
									to="/dashboard"
									className={mobileNavLinkClass}
									onClick={() => setIsMenuOpen(false)}
								>
									{t.myApplications}
								</NavLink>
								<NavLink
									to="/profile/candidate"
									className={mobileNavLinkClass}
									onClick={() => setIsMenuOpen(false)}
								>
									{t.profile}
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
									{t.myPostings}
								</NavLink>
								<NavLink
									to="/jobs/new"
									className={({ isActive }) =>
										`${ctaNavLinkClass({ isActive })} w-full`
									}
									onClick={() => setIsMenuOpen(false)}
								>
									{t.postJob}
								</NavLink>
								<NavLink
									to="/profile/company"
									className={mobileNavLinkClass}
									onClick={() => setIsMenuOpen(false)}
								>
									{t.companyProfile}
								</NavLink>
							</>
						)}

						{user && (
							<button
								type="button"
								onClick={openLogoutModal}
								className="btn text-rust hover:bg-rust hover:text-paper px-0"
							>
								{t.logOut}
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
							{t.logOutTitle}
						</h2>
						<p id="logout-description" className="mt-2 text-sm text-ink-muted">
							{t.logOutDescription}
						</p>
						<div className="mt-6 flex justify-end gap-3">
							<button
								type="button"
								className="btn-outline"
								onClick={() => setIsLogoutModalOpen(false)}
							>
								{t.cancel}
							</button>
							<button
								type="button"
								className="btn bg-rust text-paper hover:bg-rust-dark"
								onClick={handleLogout}
							>
								{t.logOut}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../features/auth/context/AuthContext';

export default function Navbar() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	async function handleLogout() {
		await logout();
		navigate('/');
	}

	return (
		<header className="border-b border-line bg-paper/95 backdrop-blur sticky top-0 z-10">
			<div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
				<Link to="/" className="font-display text-xl tracking-tight text-ink">
					ServEase
				</Link>

				<nav className="hidden sm:flex items-center gap-6 text-sm">
					<Link
						to="/"
						className="text-ink-muted hover:text-ink transition-colors"
					>
						Find work
					</Link>

					{!user && (
						<>
							<Link
								to="/login"
								className="text-ink-muted hover:text-ink transition-colors"
							>
								Log in
							</Link>
							<Link to="/register" className="btn-primary">
								Get started
							</Link>
						</>
					)}

					{user?.role === 'candidate' && (
						<>
							<Link
								to="/saved-jobs"
								className="text-ink-muted hover:text-ink transition-colors"
							>
								Saved jobs
							</Link>
							<Link
								to="/dashboard"
								className="text-ink-muted hover:text-ink transition-colors"
							>
								My applications
							</Link>
							<Link
								to="/profile/candidate"
								className="text-ink-muted hover:text-ink transition-colors"
							>
								Profile
							</Link>
						</>
					)}

					{user?.role === 'employer' && (
						<>
							<Link
								to="/dashboard"
								className="text-ink-muted hover:text-ink transition-colors"
							>
								My postings
							</Link>
							<Link to="/jobs/new" className="btn-primary">
								Post a job
							</Link>
							<Link
								to="/profile/company"
								className="text-ink-muted hover:text-ink transition-colors"
							>
								Company profile
							</Link>
						</>
					)}

					{user && (
						<button onClick={handleLogout} className="btn-ghost">
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

			{isMenuOpen && (
				<nav className="sm:hidden border-t border-line px-5 py-4 space-y-3 text-sm">
					<Link
						to="/"
						className="block text-ink-muted hover:text-ink transition-colors"
						onClick={() => setIsMenuOpen(false)}
					>
						Find work
					</Link>
					{!user && (
						<>
							<Link
								to="/login"
								className="block text-ink-muted hover:text-ink transition-colors"
								onClick={() => setIsMenuOpen(false)}
							>
								Log in
							</Link>
							<Link
								to="/register"
								className="btn-primary w-full"
								onClick={() => setIsMenuOpen(false)}
							>
								Get started
							</Link>
						</>
					)}

					{user?.role === 'candidate' && (
						<>
							<Link
								to="/saved-jobs"
								className="block text-ink-muted hover:text-ink transition-colors"
								onClick={() => setIsMenuOpen(false)}
							>
								Saved jobs
							</Link>
							<Link
								to="/dashboard"
								className="block text-ink-muted hover:text-ink transition-colors"
								onClick={() => setIsMenuOpen(false)}
							>
								My applications
							</Link>
							<Link
								to="/profile/candidate"
								className="block text-ink-muted hover:text-ink transition-colors"
								onClick={() => setIsMenuOpen(false)}
							>
								Profile
							</Link>
						</>
					)}

					{user?.role === 'employer' && (
						<>
							<Link
								to="/dashboard"
								className="block text-ink-muted hover:text-ink transition-colors"
								onClick={() => setIsMenuOpen(false)}
							>
								My postings
							</Link>
							<Link
								to="/jobs/new"
								className="btn-primary w-full"
								onClick={() => setIsMenuOpen(false)}
							>
								Post a job
							</Link>
							<Link
								to="/profile/company"
								className="block text-ink-muted hover:text-ink transition-colors"
								onClick={() => setIsMenuOpen(false)}
							>
								Company profile
							</Link>
						</>
					)}

					{user && (
						<button onClick={handleLogout} className="btn-ghost px-0">
							Log out
						</button>
					)}
				</nav>
			)}
		</header>
	);
}

import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from '../shared/components/Navbar';
import ProtectedRoute from '../shared/components/ProtectedRoute';
import { useAuth } from '../features/auth/context/AuthContext';
import Spinner from '../shared/components/Spinner';

const Home = lazy(() => import('../features/jobs/pages/Home'));
const JobDetail = lazy(() => import('../features/jobs/pages/JobDetail'));
const Login = lazy(() => import('../features/auth/pages/Login'));
const Register = lazy(() => import('../features/auth/pages/Register'));
const ForgotPassword = lazy(
	() => import('../features/auth/pages/ForgotPassword'),
);
const ResetPassword = lazy(
	() => import('../features/auth/pages/ResetPassword'),
);
const CandidateDashboard = lazy(
	() => import('../features/candidates/pages/CandidateDashboard'),
);
const ApplicationDetail = lazy(
	() => import('../features/candidates/pages/ApplicationDetail'),
);
const EmployerDashboard = lazy(
	() => import('../features/employers/pages/EmployerDashboard'),
);
const PostJob = lazy(() => import('../features/jobs/pages/PostJob'));
const EditJob = lazy(() => import('../features/jobs/pages/EditJob'));
const JobApplicants = lazy(
	() => import('../features/jobs/pages/JobApplicants'),
);
const ProfileCandidate = lazy(
	() => import('../features/candidates/pages/ProfileCandidate'),
);
const ProfileCompany = lazy(
	() => import('../features/employers/pages/ProfileCompany'),
);
const SavedJobs = lazy(() => import('../features/candidates/pages/SavedJobs'));
const NotFound = lazy(() => import('./pages/NotFound'));

function RoleDashboard() {
	const { user } = useAuth();
	return user.role === 'employer' ? (
		<EmployerDashboard />
	) : (
		<CandidateDashboard />
	);
}

const pageTitles = {
	'/': 'Find Your Next Gig',
	'/login': 'Welcome Back',
	'/register': 'Join the Crew',
	'/forgot-password': 'Forgot Your Password',
	'/reset-password': 'Reset Your Password',
	'/dashboard': 'Your Workspace',
	'/jobs/new': 'Post a New Opportunity',
	'/saved-jobs': 'Your Saved Roles',
	'/profile/company': 'Company Profile',
	'/profile/candidate': 'Candidate Profile',
};

function getPageTitle(pathname) {
	if (pathname === '/') return pageTitles['/'];
	if (pageTitles[pathname]) return pageTitles[pathname];

	if (/^\/jobs\/[^/]+$/.test(pathname)) return 'Job Details';
	if (/^\/jobs\/[^/]+\/edit$/.test(pathname)) return 'Edit Job';
	if (/^\/jobs\/[^/]+\/applicants$/.test(pathname)) return 'Applicants';
	if (/^\/applications\/[^/]+$/.test(pathname)) return 'Application Details';
	if (pathname === '*') return 'Page Not Found';

	return 'Page';
}

export default function App() {
	const location = useLocation();

	useEffect(() => {
		document.title = `Servease | ${getPageTitle(location.pathname)}`;
	}, [location.pathname]);

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:px-5">
				<Suspense
					fallback={
						<div className="flex min-h-48 items-center justify-center">
							<Spinner label="Loading page" />
						</div>
					}
				>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/jobs/:id" element={<JobDetail />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/forgot-password" element={<ForgotPassword />} />
						<Route path="/reset-password" element={<ResetPassword />} />

						<Route
							path="/dashboard"
							element={
								<ProtectedRoute>
									<RoleDashboard />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/applications/:id"
							element={
								<ProtectedRoute role="candidate">
									<ApplicationDetail />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/jobs/new"
							element={
								<ProtectedRoute role="employer">
									<PostJob />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/jobs/:id/edit"
							element={
								<ProtectedRoute role="employer">
									<EditJob />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/jobs/:id/applicants"
							element={
								<ProtectedRoute role="employer">
									<JobApplicants />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/profile/company"
							element={
								<ProtectedRoute role="employer">
									<ProfileCompany />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/saved-jobs"
							element={
								<ProtectedRoute role="candidate">
									<SavedJobs />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/profile/candidate"
							element={
								<ProtectedRoute role="candidate">
									<ProfileCandidate />
								</ProtectedRoute>
							}
						/>

						<Route path="*" element={<NotFound />} />
					</Routes>
				</Suspense>
			</main>
			<footer className="border-t border-line py-6 text-center text-xs text-ink-faint">
				Servease — find your next move, make it count
			</footer>
		</div>
	);
}

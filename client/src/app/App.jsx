import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from '../shared/components/Navbar';
import ProtectedRoute from '../shared/components/ProtectedRoute';
import { useAuth } from '../features/auth/context/AuthContext';
import PageSkeleton from '../shared/components/PageSkeleton';
import { useLanguage } from '../shared/context/LanguageContext';

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

function getPageTitle(pathname, pageTitles) {
	const exactTitles = {
		'/': pageTitles.home,
		'/login': pageTitles.login,
		'/register': pageTitles.register,
		'/forgot-password': pageTitles.forgotPassword,
		'/reset-password': pageTitles.resetPassword,
		'/dashboard': pageTitles.dashboard,
		'/jobs/new': pageTitles.postJob,
		'/saved-jobs': pageTitles.savedJobs,
		'/profile/company': pageTitles.companyProfile,
		'/profile/candidate': pageTitles.candidateProfile,
	};

	if (exactTitles[pathname]) return exactTitles[pathname];
	if (/^\/jobs\/[^/]+$/.test(pathname)) return pageTitles.jobDetails;
	if (/^\/jobs\/[^/]+\/edit$/.test(pathname)) return pageTitles.editJob;
	if (/^\/jobs\/[^/]+\/applicants$/.test(pathname))
		return pageTitles.applicants;
	if (/^\/applications\/[^/]+$/.test(pathname))
		return pageTitles.applicationDetails;
	if (pathname === '*') return pageTitles.pageNotFound;

	return pageTitles.page;
}

export default function App() {
	const location = useLocation();
	const { t } = useLanguage();

	useEffect(() => {
		document.title = `Servease | ${getPageTitle(location.pathname, t.pageTitles)}`;
	}, [location.pathname, t.pageTitles]);

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:px-5">
				<Suspense
					fallback={
						<div className="min-h-48 py-4">
							<PageSkeleton />
						</div>
					}
				>
					<div key={location.pathname} className="page-transition">
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
					</div>
				</Suspense>
			</main>
			<footer className="border-t border-line py-6 text-center text-xs text-ink-faint">
				{t.footer}
			</footer>
		</div>
	);
}

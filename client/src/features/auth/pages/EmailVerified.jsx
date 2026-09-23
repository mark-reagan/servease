import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../../../shared/context/LanguageContext';

export default function EmailVerified() {
	const [searchParams] = useSearchParams();
	const { loginWithToken } = useAuth();
	const { t } = useLanguage();
	const navigate = useNavigate();
	const [state, setState] = useState('verifying');
	const ran = useRef(false);

	useEffect(() => {
		if (ran.current) return;
		ran.current = true;

		const status = searchParams.get('status');
		const token = searchParams.get('token');

		if (status !== 'success' || !token) {
			setState('invalid');
			return;
		}

		// Strip the token out of the URL/history immediately so it isn't retained.
		window.history.replaceState(null, '', window.location.pathname);

		loginWithToken(token)
			.then(() => {
				setState('success');
				navigate('/', { replace: true });
			})
			.catch(() => setState('invalid'));
	}, [searchParams, loginWithToken, navigate]);

	if (state === 'invalid') {
		return (
			<div className="max-w-sm mx-auto py-10 text-center">
				<h1 className="font-display text-3xl mb-2">{t.verificationFailed}</h1>
				<p className="text-ink-muted text-sm mb-6">{t.verificationInvalid}</p>
				<Link to="/login" className="btn-primary inline-block">
					{t.goToLogin}
				</Link>
			</div>
		);
	}

	return (
		<div className="max-w-sm mx-auto py-10 text-center">
			<h1 className="font-display text-3xl mb-2">{t.verifyingEmail}</h1>
			<p className="text-ink-muted text-sm">{t.oneMoment}</p>
		</div>
	);
}

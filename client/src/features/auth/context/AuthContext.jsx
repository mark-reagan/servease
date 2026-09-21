import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
} from 'react';
import { api } from '../../../shared/api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const loadMe = useCallback(async () => {
		const token = localStorage.getItem('token');
		if (!token) {
			setLoading(false);
			return;
		}
		try {
			const me = await api.get('/me');
			setUser(me.data ?? me);
		} catch {
			localStorage.removeItem('token');
			setUser(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadMe();
	}, [loadMe]);

	async function login(email, password) {
		const res = await api.post('/login', { email, password });
		localStorage.setItem('token', res.token);
		setUser(res.user.data ?? res.user);
		return res.user;
	}

	async function register(payload) {
		const res = await api.post('/register', payload);
		localStorage.setItem('token', res.token);
		setUser(res.user.data ?? res.user);
		return res.user;
	}

	async function logout() {
		try {
			await api.post('/logout');
		} catch {
			// token may already be invalid — clear locally regardless
		}
		localStorage.removeItem('token');
		setUser(null);
	}

	async function forgotPassword(email) {
		return api.post('/forgot-password', { email });
	}

	async function resetPassword({
		token,
		email,
		password,
		password_confirmation,
	}) {
		return api.post('/reset-password', {
			token,
			email,
			password,
			password_confirmation,
		});
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
				loading,
				login,
				register,
				logout,
				forgotPassword,
				resetPassword,
				refresh: loadMe,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
}

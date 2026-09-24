import { useCallback, useEffect, useState } from 'react';

const STORAGE_PREFIX = 'verification_resend_until:';

function storageKey(email) {
	return `${STORAGE_PREFIX}${(email || '').trim().toLowerCase()}`;
}

// Reads remaining seconds from a wall-clock deadline so the cooldown stays in
// sync even if the component unmounts/remounts (e.g. navigating from register to login).
function readRemaining(email) {
	const until = parseInt(localStorage.getItem(storageKey(email)), 10);
	if (Number.isNaN(until)) return 0;
	return Math.max(0, Math.ceil((until - Date.now()) / 1000));
}

export function useResendCooldown(email, seconds) {
	const [remaining, setRemaining] = useState(() => readRemaining(email));

	useEffect(() => {
		setRemaining(readRemaining(email));
	}, [email]);

	useEffect(() => {
		if (remaining <= 0) return;
		const timer = setInterval(() => setRemaining(readRemaining(email)), 1000);
		return () => clearInterval(timer);
	}, [remaining, email]);

	const start = useCallback(() => {
		localStorage.setItem(
			storageKey(email),
			String(Date.now() + seconds * 1000),
		);
		setRemaining(readRemaining(email));
	}, [email, seconds]);

	return [remaining, start];
}

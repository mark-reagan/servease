const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

class ApiError extends Error {
	constructor(message, status, errors) {
		super(message);
		this.status = status;
		this.errors = errors || {};
	}
}

function getToken() {
	return localStorage.getItem('token');
}

/**
 * Core request helper. Pass `body` as a plain object for JSON, or a
 * FormData instance for file uploads (skills[]=, resume, logo, etc).
 * Pass `responseType: 'blob'` to fetch a binary file (e.g. resume downloads).
 */
async function request(
	path,
	{ method = 'GET', body, params, responseType } = {},
) {
	let url = `${BASE_URL}${path}`;

	if (params) {
		const query = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			if (value === undefined || value === null || value === '') return;
			if (Array.isArray(value)) {
				value.forEach((v) => query.append(`${key}[]`, v));
			} else {
				query.append(key, value);
			}
		});
		const qs = query.toString();
		if (qs) url += `?${qs}`;
	}

	const isFormData = body instanceof FormData;
	const headers = { Accept: 'application/json' };
	if (!isFormData) headers['Content-Type'] = 'application/json';
	const token = getToken();
	if (token) headers['Authorization'] = `Bearer ${token}`;

	const res = await fetch(url, {
		method,
		headers,
		body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
	});

	if (responseType === 'blob') {
		if (!res.ok) {
			let data = null;
			try {
				data = JSON.parse(await res.text());
			} catch {
				data = null;
			}
			throw new ApiError(
				data?.message || 'Something went wrong. Please try again.',
				res.status,
				data?.errors,
			);
		}

		const disposition = res.headers.get('Content-Disposition') || '';
		const match = disposition.match(/filename="?([^"]+)"?/);
		return { blob: await res.blob(), filename: match?.[1] };
	}

	let data = null;
	const text = await res.text();
	if (text) {
		try {
			data = JSON.parse(text);
		} catch {
			data = null;
		}
	}

	if (!res.ok) {
		const message = data?.message || 'Something went wrong. Please try again.';
		throw new ApiError(message, res.status, data?.errors);
	}

	return data;
}

export const api = {
	get: (path, params, options) =>
		request(path, { method: 'GET', params, ...options }),
	post: (path, body) => request(path, { method: 'POST', body }),
	put: (path, body) => request(path, { method: 'PUT', body }),
	patch: (path, body) => request(path, { method: 'PATCH', body }),
	delete: (path, body) => request(path, { method: 'DELETE', body }),
};

export { ApiError, getToken };

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
 */
async function request(path, { method = 'GET', body, params } = {}) {
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
	get: (path, params) => request(path, { method: 'GET', params }),
	post: (path, body) => request(path, { method: 'POST', body }),
	put: (path, body) => request(path, { method: 'PUT', body }),
	patch: (path, body) => request(path, { method: 'PATCH', body }),
	delete: (path) => request(path, { method: 'DELETE' }),
};

export { ApiError, getToken };

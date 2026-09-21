import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, ApiError } from '../../../shared/api/client';
import JobForm from '../components/JobForm';
import Spinner from '../../../shared/components/Spinner';

export default function EditJob() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [job, setJob] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;
		async function load() {
			try {
				const res = await api.get(`/jobs/${id}`);
				if (!cancelled) setJob(res.data ?? res);
			} finally {
				if (!cancelled) setLoading(false);
			}
		}
		load();
		return () => {
			cancelled = true;
		};
	}, [id]);

	async function handleSubmit(payload) {
		try {
			await api.put(`/jobs/${id}`, payload);
			navigate(`/jobs/${id}`);
		} catch (err) {
			if (err instanceof ApiError) throw err;
			throw new Error('Could not update this posting.', { cause: err });
		}
	}

	if (loading) {
		return (
			<div className="py-24 flex justify-center">
				<Spinner />
			</div>
		);
	}

	if (!job)
		return (
			<p className="text-ink-muted text-sm py-12 text-center">
				Posting not found.
			</p>
		);

	return (
		<div>
			<h1 className="font-display text-3xl mb-1">Edit posting</h1>
			<p className="text-ink-muted text-sm mb-8">
				Update the listing candidates see.
			</p>
			<JobForm
				initial={job}
				onSubmit={handleSubmit}
				submitLabel="Save changes"
			/>
		</div>
	);
}

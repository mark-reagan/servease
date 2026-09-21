import { useNavigate } from 'react-router-dom';
import { api, ApiError } from '../../../shared/api/client';
import JobForm from '../components/JobForm';

export default function PostJob() {
	const navigate = useNavigate();

	async function handleSubmit(payload) {
		try {
			const res = await api.post('/jobs', payload);
			const job = res.data ?? res;
			navigate(`/jobs/${job.id}`);
		} catch (err) {
			if (err instanceof ApiError) throw err;
			throw new Error('Could not publish this posting.', { cause: err });
		}
	}

	return (
		<div>
			<h1 className="font-display text-3xl mb-1">Post a job</h1>
			<p className="text-ink-muted text-sm mb-8">
				Fill in the details candidates will see on the listing.
			</p>
			<JobForm onSubmit={handleSubmit} submitLabel="Publish posting" />
		</div>
	);
}

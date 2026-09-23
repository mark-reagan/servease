import { useNavigate } from 'react-router-dom';
import { api, ApiError } from '../../../shared/api/client';
import JobForm from '../components/JobForm';
import { useLanguage } from '../../../shared/context/LanguageContext';

export default function PostJob() {
	const navigate = useNavigate();
	const { t } = useLanguage();

	async function handleSubmit(payload) {
		try {
			const res = await api.post('/jobs', payload);
			const job = res.data ?? res;
			navigate(`/jobs/${job.id}`);
		} catch (err) {
			if (err instanceof ApiError) throw err;
			throw new Error(t.couldNotPublish, { cause: err });
		}
	}

	return (
		<div>
			<h1 className="font-display text-3xl mb-1">{t.postJob}</h1>
			<p className="text-ink-muted text-sm mb-8">{t.postJobDescription}</p>
			<JobForm onSubmit={handleSubmit} submitLabel={t.publishPosting} />
		</div>
	);
}

import { Link } from 'react-router-dom';
import { useLanguage } from '../../shared/context/LanguageContext';

export default function NotFound() {
	const { t } = useLanguage();
	return (
		<div className="py-24 text-center">
			<p className="font-display text-2xl mb-2">{t.nothingHere}</p>
			<Link to="/" className="text-amber-dark hover:underline text-sm">
				{t.backToJobs}
			</Link>
		</div>
	);
}

import { useLanguage } from '../context/LanguageContext';

export default function Spinner({ label }) {
	const { t } = useLanguage();
	return (
		<div className="flex items-center gap-2 text-ink-muted text-sm">
			<span
				className="h-4 w-4 border-2 border-line border-t-ink rounded-full animate-spin"
				aria-hidden="true"
			/>
			{label || t.loading}
		</div>
	);
}

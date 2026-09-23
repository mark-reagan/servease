import { useLanguage } from '../context/LanguageContext';

export default function Pagination({ meta, onPageChange }) {
	const { t } = useLanguage();
	if (!meta || meta.last_page <= 1) return null;

	const { current_page, last_page } = meta;

	return (
		<div className="flex items-center justify-between pt-6 text-sm">
			<button
				className="btn-outline"
				disabled={current_page <= 1}
				onClick={() => onPageChange(current_page - 1)}
			>
				{t.previous}
			</button>
			<span className="text-ink-muted">
				{t.pageOf
					.replace('{current}', current_page)
					.replace('{last}', last_page)}
			</span>
			<button
				className="btn-outline"
				disabled={current_page >= last_page}
				onClick={() => onPageChange(current_page + 1)}
			>
				{t.next}
			</button>
		</div>
	);
}

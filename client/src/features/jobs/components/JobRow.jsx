import { Link } from 'react-router-dom';
import {
	employmentLabel,
	workModeLabel,
	formatSalary,
	timeAgo,
} from '../../../shared/lib/format';
import { useLanguage } from '../../../shared/context/LanguageContext';

export default function JobRow({ job }) {
	const { t } = useLanguage();
	const salary = formatSalary(job);

	return (
		<Link
			to={`/jobs/${job.id}`}
			className="group flex gap-4 border-b border-line py-5 hover:bg-panel/60 transition-colors -mx-2 px-2"
		>
			<div
				className={`w-1 shrink-0 ${job.work_mode === 'remote' ? 'bg-teal' : 'bg-amber'}`}
				aria-hidden="true"
			/>

			<div className="flex-1 min-w-0">
				<div className="flex items-baseline justify-between gap-4">
					<h3 className="font-display text-lg text-ink group-hover:text-amber-dark transition-colors truncate">
						{job.title}
					</h3>
					{salary && (
						<span className="text-sm text-ink-muted whitespace-nowrap">
							{salary}
						</span>
					)}
				</div>

				<p className="text-sm text-ink-muted mt-0.5">
					{job.company?.name || t.companyFallback}{' '}
					{job.location && `· ${job.location}`}
				</p>

				<div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-ink-faint">
					<span>
						{t[
							{
								full_time: 'fullTime',
								part_time: 'partTime',
								contract: 'contract',
								internship: 'internship',
								temporary: 'temporary',
							}[job.employment_type]
						] || employmentLabel(job.employment_type)}
					</span>
					<span aria-hidden="true">·</span>
					<span>
						{t[
							{ on_site: 'onSite', remote: 'remote', hybrid: 'hybrid' }[
								job.work_mode
							]
						] || workModeLabel(job.work_mode)}
					</span>
					{job.created_at && (
						<>
							<span aria-hidden="true">·</span>
							<span>{timeAgo(job.created_at, t.timeUnits)}</span>
						</>
					)}
				</div>
			</div>
		</Link>
	);
}

const EMPLOYMENT_LABELS = {
	full_time: 'Full-time',
	part_time: 'Part-time',
	contract: 'Contract',
	internship: 'Internship',
	temporary: 'Temporary',
};

const WORK_MODE_LABELS = {
	on_site: 'On-site',
	remote: 'Remote',
	hybrid: 'Hybrid',
};

export function employmentLabel(value) {
	return EMPLOYMENT_LABELS[value] || value;
}

export function workModeLabel(value) {
	return WORK_MODE_LABELS[value] || value;
}

export function formatSalary(job) {
	const { salary_min, salary_max, salary_currency } = job;
	if (!salary_min && !salary_max) return null;

	const fmt = (n) =>
		new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: salary_currency || 'USD',
			maximumFractionDigits: 0,
		}).format(n);

	if (salary_min && salary_max)
		return `${fmt(salary_min)} – ${fmt(salary_max)}`;
	return fmt(salary_min || salary_max);
}

export function timeAgo(dateString, labels = {}) {
	if (!dateString) return '';
	const date = new Date(dateString);
	const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
	const units = [
		['year', 31536000],
		['month', 2592000],
		['week', 604800],
		['day', 86400],
		['hour', 3600],
		['minute', 60],
	];
	for (const [name, secs] of units) {
		const value = Math.floor(seconds / secs);
		if (value >= 1) {
			const unit = labels[name] || name;
			const pluralUnit = value > 1 ? labels.plural?.[name] || unit : unit;
			return `${value} ${pluralUnit} ${labels.ago || 'ago'}`;
		}
	}
	return labels.justNow || 'just now';
}

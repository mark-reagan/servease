export default function PageSkeleton() {
	return (
		<div className="space-y-8" aria-busy="true" aria-label="Loading page">
			<span className="sr-only">Loading page</span>
			<div className="space-y-3">
				<div className="h-9 w-2/3 max-w-sm animate-pulse bg-line" />
				<div className="h-4 w-full max-w-md animate-pulse bg-line" />
			</div>
			<div className="space-y-4 border-t border-line pt-6">
				<div className="h-24 animate-pulse bg-panel" />
				<div className="h-24 animate-pulse bg-panel" />
				<div className="h-24 animate-pulse bg-panel" />
			</div>
		</div>
	);
}

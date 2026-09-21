import { Component } from 'react';

export default class ErrorBoundary extends Component {
	state = { hasError: false };

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	render() {
		if (this.state.hasError) {
			return (
				<main className="min-h-screen flex items-center justify-center px-5 text-center">
					<div>
						<h1 className="text-2xl font-semibold text-ink">
							Something went wrong
						</h1>
						<p className="mt-2 text-sm text-ink-faint">
							Please refresh the page and try again.
						</p>
						<button
							type="button"
							className="mt-5 rounded bg-ink px-4 py-2 text-sm font-medium text-white"
							onClick={() => window.location.reload()}
						>
							Refresh page
						</button>
					</div>
				</main>
			);
		}

		return this.props.children;
	}
}

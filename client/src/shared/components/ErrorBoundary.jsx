import { Component } from 'react';
import { useLanguage } from '../context/LanguageContext';

class ErrorBoundaryBase extends Component {
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
							{this.props.t.somethingWrong}
						</h1>
						<p className="mt-2 text-sm text-ink-faint">
							{this.props.t.refreshTryAgain}
						</p>
						<button
							type="button"
							className="mt-5 rounded bg-ink px-4 py-2 text-sm font-medium text-white"
							onClick={() => window.location.reload()}
						>
							{this.props.t.refreshPage}
						</button>
					</div>
				</main>
			);
		}

		return this.props.children;
	}
}

export default function ErrorBoundary(props) {
	const { t } = useLanguage();
	return <ErrorBoundaryBase {...props} t={t} />;
}

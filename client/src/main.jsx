import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App.jsx';
import { AuthProvider } from './features/auth/context/AuthContext.jsx';
import ErrorBoundary from './shared/components/ErrorBoundary.jsx';
import { LanguageProvider } from './shared/context/LanguageContext.jsx';
import { ThemeProvider } from './shared/context/ThemeContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<ErrorBoundary>
			<BrowserRouter>
				<ThemeProvider>
					<LanguageProvider>
						<AuthProvider>
							<App />
						</AuthProvider>
					</LanguageProvider>
				</ThemeProvider>
			</BrowserRouter>
		</ErrorBoundary>
	</React.StrictMode>,
);

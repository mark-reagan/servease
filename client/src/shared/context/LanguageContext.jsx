import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext(null);

const translations = {
	en: {
		language: 'Language',
		findWork: 'Find work',
		logIn: 'Log in',
		getStarted: 'Get started',
		savedJobs: 'Saved jobs',
		myApplications: 'My applications',
		profile: 'Profile',
		myPostings: 'My postings',
		postJob: 'Post a job',
		companyProfile: 'Company profile',
		logOut: 'Log out',
		closeMenu: 'Close menu',
		openMenu: 'Open menu',
		logOutTitle: 'Log out?',
		logOutDescription: 'Are you sure you want to log out of your account?',
		cancel: 'Cancel',
		servingLocation: 'Serving Quezon, Palawan',
		homeTitle: 'Find the right job. Hire the right person.',
		homeDescription:
			'Servease connects people in Quezon, Palawan with local opportunities and trusted candidates.',
		serviceOrKeyword: 'Service or keyword',
		location: 'Location',
		anyType: 'Any type',
		fullTime: 'Full-time',
		partTime: 'Part-time',
		contract: 'Contract',
		internship: 'Internship',
		temporary: 'Temporary',
		anyMode: 'Any mode',
		onSite: 'On-site',
		remote: 'Remote',
		hybrid: 'Hybrid',
		findJobs: 'Find jobs',
		fetchingListings: 'Fetching listings...',
		listingsLoadError: 'Could not load listings right now.',
		noRoles: 'No roles match those filters yet. Try widening your search.',
		footer: 'Servease - find your next move, make it count',
		pageTitles: {
			home: 'Find Your Next Gig',
			login: 'Welcome Back',
			register: 'Join the Crew',
			forgotPassword: 'Forgot Your Password',
			resetPassword: 'Reset Your Password',
			dashboard: 'Your Workspace',
			postJob: 'Post a New Opportunity',
			savedJobs: 'Your Saved Roles',
			companyProfile: 'Company Profile',
			candidateProfile: 'Candidate Profile',
			jobDetails: 'Job Details',
			editJob: 'Edit Job',
			applicants: 'Applicants',
			applicationDetails: 'Application Details',
			pageNotFound: 'Page Not Found',
			page: 'Page',
		},
	},
	fil: {
		language: 'Wika',
		findWork: 'Maghanap ng trabaho',
		logIn: 'Mag-log in',
		getStarted: 'Magsimula',
		savedJobs: 'Nai-save na trabaho',
		myApplications: 'Aking mga aplikasyon',
		profile: 'Profile',
		myPostings: 'Aking mga post',
		postJob: 'Mag-post ng trabaho',
		companyProfile: 'Profile ng kumpanya',
		logOut: 'Mag-log out',
		closeMenu: 'Isara ang menu',
		openMenu: 'Buksan ang menu',
		logOutTitle: 'Mag-log out?',
		logOutDescription:
			'Sigurado ka bang gusto mong mag-log out sa iyong account?',
		cancel: 'Kanselahin',
		servingLocation: 'Para sa Quezon, Palawan',
		homeTitle: 'Hanapin ang tamang trabaho. Kuhanin ang tamang tao.',
		homeDescription:
			'Ikinokonekta ng Servease ang mga tao sa Quezon, Palawan sa lokal na oportunidad at mapagkakatiwalaang kandidato.',
		serviceOrKeyword: 'Serbisyo o keyword',
		location: 'Lokasyon',
		anyType: 'Anumang uri',
		fullTime: 'Full-time',
		partTime: 'Part-time',
		contract: 'Kontrata',
		internship: 'Internship',
		temporary: 'Pansamantala',
		anyMode: 'Anumang paraan',
		onSite: 'On-site',
		remote: 'Remote',
		hybrid: 'Hybrid',
		findJobs: 'Maghanap ng trabaho',
		fetchingListings: 'Kinukuha ang mga listahan...',
		listingsLoadError: 'Hindi ma-load ang mga listahan sa ngayon.',
		noRoles:
			'Wala pang trabahong tugma sa mga filter na iyon. Subukang palawakin ang paghahanap.',
		footer: 'Servease - hanapin ang susunod mong hakbang',
		pageTitles: {
			home: 'Hanapin ang Susunod Mong Trabaho',
			login: 'Maligayang Pagbabalik',
			register: 'Sumali sa Crew',
			forgotPassword: 'Nakalimutan ang Password',
			resetPassword: 'I-reset ang Password',
			dashboard: 'Iyong Workspace',
			postJob: 'Mag-post ng Bagong Oportunidad',
			savedJobs: 'Iyong Nai-save na Trabaho',
			companyProfile: 'Profile ng Kumpanya',
			candidateProfile: 'Profile ng Kandidato',
			jobDetails: 'Detalye ng Trabaho',
			editJob: 'I-edit ang Trabaho',
			applicants: 'Mga Aplikante',
			applicationDetails: 'Detalye ng Aplikasyon',
			pageNotFound: 'Hindi Nahanap ang Pahina',
			page: 'Pahina',
		},
	},
};

function getInitialLanguage() {
	return localStorage.getItem('servease-language') === 'fil' ? 'fil' : 'en';
}

export function LanguageProvider({ children }) {
	const [language, setLanguageState] = useState(getInitialLanguage);
	const setLanguage = (nextLanguage) => {
		const languageCode = nextLanguage === 'fil' ? 'fil' : 'en';
		localStorage.setItem('servease-language', languageCode);
		setLanguageState(languageCode);
	};

	return (
		<LanguageContext.Provider
			value={{ language, setLanguage, t: translations[language] }}
		>
			{children}
		</LanguageContext.Provider>
	);
}

export function useLanguage() {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error('useLanguage must be used within a LanguageProvider');
	}

	return context;
}

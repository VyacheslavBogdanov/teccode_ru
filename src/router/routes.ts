export const ROUTES = {
	home: { name: 'Home', path: '/' },
	directions: { name: 'Directions', path: '/directions' },
	softwareSolutions: { name: 'SoftwareSolutions', path: '/software-solutions' },
	contacts: { name: 'Contacts', path: '/contacts' },
	contactForm: { name: 'ContactForm', path: '/contact-form' },
	module: { name: 'Module', path: '/products/:slug' },
	moduleDoc: { name: 'ModuleDoc', path: '/products/:slug/docs/:docId' },
} as const;

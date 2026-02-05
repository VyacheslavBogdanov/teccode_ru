import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { ROUTES } from './routes';

import HomePage from '@/pages/HomePage.vue';
import DirectionsPage from '@/pages/DirectionsPage.vue';
import SoftwareSolutionsPage from '@/pages/SoftwareSolutionsPage.vue';
import ContactsPage from '@/pages/ContactsPage.vue';
import ContactFormPage from '@/pages/ContactFormPage.vue';
import ProductModulePage from '@/pages/ProductModulePage.vue';
import ModuleDocumentPage from '@/pages/ModuleDocumentPage.vue';

const routes: RouteRecordRaw[] = [
	{ path: ROUTES.home.path, name: ROUTES.home.name, component: HomePage },
	{ path: ROUTES.directions.path, name: ROUTES.directions.name, component: DirectionsPage },
	{
		path: ROUTES.softwareSolutions.path,
		name: ROUTES.softwareSolutions.name,
		component: SoftwareSolutionsPage,
	},
	{ path: ROUTES.contacts.path, name: ROUTES.contacts.name, component: ContactsPage },
	{ path: ROUTES.contactForm.path, name: ROUTES.contactForm.name, component: ContactFormPage },

	{ path: ROUTES.module.path, name: ROUTES.module.name, component: ProductModulePage },
	{ path: ROUTES.moduleDoc.path, name: ROUTES.moduleDoc.name, component: ModuleDocumentPage },

	{ path: '/sofware-solutions', redirect: ROUTES.softwareSolutions.path },
];

export default createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior() {
		return { top: 0 };
	},
});

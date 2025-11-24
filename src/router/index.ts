import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import DirectionsPage from '@/pages/DirectionsPage.vue';
import ContactFormPage from '@/pages/ContactFormPage.vue';
import ContactsPage from '@/pages/ContactsPage.vue';
import SoftwareSolutionsPage from '@/pages/SoftwareSolutionsPage.vue';
import ProductModulePage from '@/pages/ProductModulePage.vue';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'Home',
		component: HomePage,
	},
	{
		path: '/directions',
		name: 'Directions',
		component: DirectionsPage,
	},
	{
		path: '/contact-form',
		name: 'ContactForm',
		component: ContactFormPage,
	},
	{
		path: '/contacts',
		name: 'Contacts',
		component: ContactsPage,
	},
	{
		path: '/sofware-solutions',
		name: 'SoftwareSolutions',
		component: SoftwareSolutionsPage,
	},
	{
		path: '/products/:slug',
		name: 'ProductModule',
		component: ProductModulePage,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;

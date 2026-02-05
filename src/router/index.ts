import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { ROUTES } from './routes';
import { isAdminAuthed } from '@/admin/auth';

const routes: RouteRecordRaw[] = [
	{ path: ROUTES.home.path, name: ROUTES.home.name, component: () => import('@/pages/HomePage.vue') },
	{
		path: ROUTES.directions.path,
		name: ROUTES.directions.name,
		component: () => import('@/pages/DirectionsPage.vue'),
	},
	{
		path: ROUTES.softwareSolutions.path,
		name: ROUTES.softwareSolutions.name,
		component: () => import('@/pages/SoftwareSolutionsPage.vue'),
	},
	{ path: ROUTES.contacts.path, name: ROUTES.contacts.name, component: () => import('@/pages/ContactsPage.vue') },
	{
		path: ROUTES.contactForm.path,
		name: ROUTES.contactForm.name,
		component: () => import('@/pages/ContactFormPage.vue'),
	},
	{ path: ROUTES.module.path, name: ROUTES.module.name, component: () => import('@/pages/ProductModulePage.vue') },
	{
		path: ROUTES.moduleDoc.path,
		name: ROUTES.moduleDoc.name,
		component: () => import('@/pages/ModuleDocumentPage.vue'),
	},
	{
		path: ROUTES.adminLogin.path,
		name: ROUTES.adminLogin.name,
		component: () => import('@/admin/pages/AdminLoginPage.vue'),
		meta: { guestOnly: true },
	},
	{
		path: ROUTES.admin.path,
		name: ROUTES.admin.name,
		component: () => import('@/admin/pages/AdminPanelPage.vue'),
		meta: { requiresAdmin: true },
	},
	{
		path: ROUTES.adminModule.path,
		name: ROUTES.adminModule.name,
		component: () => import('@/admin/pages/AdminModuleEditPage.vue'),
		meta: { requiresAdmin: true },
	},
	{ path: '/sofware-solutions', redirect: ROUTES.softwareSolutions.path },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior() {
		return { top: 0 };
	},
});

router.afterEach((to) => {
	try {
		if (typeof document === 'undefined') return;
		const isAdmin = String(to.path ?? '').startsWith('/admin');
		document.body.classList.toggle('admin-mode', isAdmin);
	} catch {
		return;
	}
});

router.beforeEach((to) => {
	const needsAdmin = to.matched.some((r) => Boolean(r.meta.requiresAdmin));
	const guestOnly = to.matched.some((r) => Boolean(r.meta.guestOnly));
	const authed = isAdminAuthed();

	if (needsAdmin && !authed) {
		return { name: ROUTES.adminLogin.name, query: { redirect: to.fullPath } };
	}
	if (guestOnly && authed) {
		return { name: ROUTES.admin.name };
	}
	return true;
});

export default router;

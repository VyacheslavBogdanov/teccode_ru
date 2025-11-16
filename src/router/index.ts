import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import ProductDetail from '@/pages/ProductDetail.vue';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'Home',
		component: HomePage,
	},
	{
		path: '/products/:id',
		name: 'ProductDetail',
		component: ProductDetail,
		props: true,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;

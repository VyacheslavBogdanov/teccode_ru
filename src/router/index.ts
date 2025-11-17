import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import ProductDetail from '@/pages/ProductDetail.vue';
import DirectionsPage from '@/pages/DirectionsPage.vue';

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
	{
		path: '/directions',
		name: 'Directions',
		component: DirectionsPage,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;

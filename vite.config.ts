import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const raw = String(env.VITE_API_BASE_URL ?? 'http://localhost:3001').trim();
	const base = raw.replace(/\/+$/, '');
	const target = base.endsWith('/api') ? base.slice(0, -4) : base;

	return {
		plugins: [vue(), ...(mode === 'development' ? [vueDevTools()] : [])],
		resolve: {
			alias: {
				'@': '/src',
			},
		},
		server: {
			proxy: {
				'/api': {
					target,
					changeOrigin: true,
				},
				'/uploads': {
					target,
					changeOrigin: true,
				},
			},
		},
	};
});

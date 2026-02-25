import { defineStore } from 'pinia';
import { adminApi } from '@/admin/api/admin';
import {
	clearStoredAdminSession,
	readStoredAdminSession,
	writeStoredAdminSession,
} from '@/admin/auth';

export const useAdminStore = defineStore('admin', {
	state: () => {
		const { token, expiresAt } = readStoredAdminSession();
		return {
			token,
			expiresAt,
			loginError: '' as string,
		};
	},

	getters: {
		isAuthed: (s) => Boolean(s.token) && (s.expiresAt ? s.expiresAt > Date.now() : true),
	},

	actions: {
		async login(login: string, password: string) {
			this.loginError = '';
			const { token, expiresAt } = await adminApi.login(login, password);
			this.token = token;
			this.expiresAt = expiresAt;
			writeStoredAdminSession(token, expiresAt);
		},

		async logout() {
			try {
				if (this.token) await adminApi.logout(this.token);
			} catch {}
			this.token = '';
			this.expiresAt = 0;
			clearStoredAdminSession();
		},
	},
});

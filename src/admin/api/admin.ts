import { http } from '@/api/http';
import type { ModuleDetail, ModuleListItem, DocumentItem } from '@/api/software';

export const adminApi = {
	login: (login: string, password: string) =>
		http.post<{ token: string; expiresAt: number }>('/api/auth/login', { login, password }),
	logout: (token: string) => http.post<{ ok: true }>('/api/auth/logout', undefined, token),

	getModules: (token: string) =>
		http.get<{ modules: ModuleListItem[] }>(`/api/admin/modules?ts=${Date.now()}`, token),
	getModule: (id: string, token: string) =>
		http.get<{ module: ModuleDetail }>(
			`/api/admin/modules/${encodeURIComponent(id)}?ts=${Date.now()}`,
			token,
		),

	createModule: (
		payload: { title: string; preview?: string; description?: string; slug?: string },
		token: string,
	) => http.post<{ module: ModuleDetail }>('/api/admin/modules', payload, token),
	updateModule: (
		id: string,
		payload: { title?: string; preview?: string; description?: string },
		token: string,
	) =>
		http.put<{ module: ModuleDetail }>(
			`/api/admin/modules/${encodeURIComponent(id)}`,
			payload,
			token,
		),
	deleteModule: (id: string, token: string) =>
		http.delete<{ ok: true }>(`/api/admin/modules/${encodeURIComponent(id)}`, token),

	createDocument: (
		moduleId: string,
		payload: { title: string; content?: string },
		token: string,
	) =>
		http.post<{ document: DocumentItem }>(
			`/api/admin/modules/${encodeURIComponent(moduleId)}/documents`,
			payload,
			token,
		),
	updateDocument: (
		id: string,
		payload: { title?: string; content?: string },
		token: string,
	) =>
		http.put<{ document: DocumentItem }>(
			`/api/admin/documents/${encodeURIComponent(id)}`,
			payload,
			token,
		),
	deleteDocument: (id: string, token: string) =>
		http.delete<{ ok: true }>(`/api/admin/documents/${encodeURIComponent(id)}`, token),

	uploadImage: (dataUrl: string, token: string) =>
		http.post<{ url: string }>('/api/uploads', { dataUrl }, token),
};

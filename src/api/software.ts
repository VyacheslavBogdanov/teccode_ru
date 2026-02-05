import { http } from './http';

export interface ModuleListItem {
	id: string;
	slug: string;
	title: string;
	preview: string;
}

export interface ModuleDocumentLink {
	id: string;
	title: string;
	updatedAt?: string;
}

export interface ModuleDetail {
	id: string;
	slug: string;
	title: string;
	preview: string;
	description: string;
	documents: ModuleDocumentLink[];
}

export interface DocumentItem {
	id: string;
	moduleId: string;
	title: string;
	content: string;
	updatedAt?: string;
}

export const softwareApi = {
	getModules: () => http.get<{ modules: ModuleListItem[] }>('/api/modules'),
	getModule: (slug: string) =>
		http.get<{ module: ModuleDetail }>(`/api/modules/${encodeURIComponent(slug)}`),
	getDocument: (id: string) =>
		http.get<{ document: DocumentItem }>(`/api/documents/${encodeURIComponent(id)}`),
};

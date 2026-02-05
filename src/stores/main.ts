import { defineStore } from 'pinia';
import { DOCUMENTS_CATALOG } from '@/data/documents';
import type { DocId, DocMeta } from '@/data/documents';
import { DEFAULT_MODULE_DOC_IDS } from '@/data/modules';
import type { ModuleSlug } from '@/data/modules';

type DocumentsCatalog = Record<DocId, DocMeta>;
type ModuleDocsMap = Partial<Record<ModuleSlug, DocId[]>>;

export const useMainStore = defineStore('main', {
	state: () => ({
		companyName: 'TechCode',
		year: new Date().getFullYear(),

		// общий каталог ВСЕХ типов документов
		documentsCatalog: { ...DOCUMENTS_CATALOG } as DocumentsCatalog,

		// какие документы есть у конкретного модуля (если не задано — берём дефолт)
		moduleDocs: {} as ModuleDocsMap,
	}),

	getters: {
		fullCompanyName: (state) => `ООО "${state.companyName}"`,

		documentById:
			(state) =>
			(id: DocId): DocMeta =>
				state.documentsCatalog[id],

		documentsByIds:
			(state) =>
			(ids: DocId[]): DocMeta[] =>
				ids.map((id) => state.documentsCatalog[id]).filter(Boolean),

		docIdsForModule:
			(state) =>
			(slug: ModuleSlug): DocId[] =>
				state.moduleDocs[slug] ?? DEFAULT_MODULE_DOC_IDS,
	},

	actions: {
		setCompanyName(name: string) {
			this.companyName = name;
		},

		// если позже появятся разные наборы документов по модулям
		setModuleDocs(slug: ModuleSlug, docIds: DocId[]) {
			this.moduleDocs[slug] = docIds;
		},
	},
});

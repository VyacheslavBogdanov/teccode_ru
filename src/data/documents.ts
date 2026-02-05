export const DOC_IDS = [
	'source-storage',
	'install',
	'operation',
	'activation-requirements',
	'functional-specs',
	'lifecycle',
	'program-info',
	'architecture',
] as const;

export type DocId = (typeof DOC_IDS)[number];

export interface DocMeta {
	id: DocId;
	title: string;
	badge?: string;
}

export const DOCUMENTS_CATALOG: Record<DocId, DocMeta> = {
	'source-storage': {
		id: 'source-storage',
		title: 'Описание технических средств хранения исходного текста и объектного кода',
		badge: 'PDF',
	},
	install: { id: 'install', title: 'Инструкция по установке', badge: 'PDF' },
	operation: { id: 'operation', title: 'Инструкция по эксплуатации', badge: 'PDF' },
	'activation-requirements': {
		id: 'activation-requirements',
		title: 'Описание технических средств необходимых для активации',
		badge: 'PDF',
	},
	'functional-specs': {
		id: 'functional-specs',
		title: 'Описание функциональных характеристик',
		badge: 'PDF',
	},
	lifecycle: { id: 'lifecycle', title: 'Процессы жизненного цикла', badge: 'PDF' },
	'program-info': { id: 'program-info', title: 'Сведения о программе', badge: 'PDF' },
	architecture: { id: 'architecture', title: 'Описание технической архитектуры', badge: 'PDF' },
};

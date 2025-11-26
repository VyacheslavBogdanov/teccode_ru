// src/stores/mainStore.ts
import { defineStore } from 'pinia';

export interface DocItem {
	id: string;
	title: string;
	url: string;
}

interface MainState {
	companyName: string;
	year: number;
	documents: DocItem[];
}

export const useMainStore = defineStore('main', {
	state: (): MainState => ({
		companyName: 'TechCode',
		year: new Date().getFullYear(),
		// полный список всех типов документов, общих для всех модулей
		documents: [
			{
				id: 'source-storage-description',
				title: 'Описание технических средств хранения исходного текста и объектного кода',
				url: 'about:blank',
			},
			{
				id: 'installation-manual',
				title: 'Инструкция по установке',
				url: 'about:blank',
			},
			{
				id: 'operation-manual',
				title: 'Инструкция по эксплуатации',
				url: 'about:blank',
			},
			{
				id: 'activation-hardware-description',
				title: 'Описание технических средств необходимых для активации',
				url: 'about:blank',
			},
			{
				id: 'functional-spec',
				title: 'Описание функциональных характеристик',
				url: 'about:blank',
			},
			{
				id: 'lifecycle-processes',
				title: 'Процессы жизненного цикла',
				url: 'about:blank',
			},
			{
				id: 'program-info',
				title: 'Сведения о программе',
				url: 'about:blank',
			},
			{
				id: 'technical-architecture',
				title: 'Описание технической архитектуры',
				url: 'about:blank',
			},
		],
	}),
	getters: {
		fullCompanyName: (state) => `ООО "${state.companyName}"`,
		// вернуть весь список документов
		allDocuments: (state): DocItem[] => state.documents,
		// получить документ по id (удобно для выбора нужных документов в модуле)
		getDocumentById: (state) => {
			return (id: string): DocItem | undefined =>
				state.documents.find((doc) => doc.id === id);
		},
	},
	actions: {
		setCompanyName(name: string) {
			this.companyName = name;
		},
		// на будущее: заменить весь набор документов
		setAllDocuments(docs: DocItem[]) {
			this.documents = docs;
		},
		// на будущее: обновить ссылку на конкретный документ
		setDocumentUrl(id: string, url: string) {
			const doc = this.documents.find((d) => d.id === id);
			if (doc) {
				doc.url = url;
			}
		},
	},
});

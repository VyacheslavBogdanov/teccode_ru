import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
	state: () => ({
		companyName: 'TechCode',
		year: new Date().getFullYear(),
	}),
	getters: {
		fullCompanyName: (state) => `ООО "${state.companyName}"`,
	},
	actions: {
		setCompanyName(name: string) {
			this.companyName = name;
		},
	},
});

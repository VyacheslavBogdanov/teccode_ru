import { http } from './http';

export interface ContactFormData {
	name: string;
	email: string;
	message: string;
}

export const contactApi = {
	sendMessage: (data: ContactFormData) => http.post<{ ok: true }>('/api/contact', data),
};

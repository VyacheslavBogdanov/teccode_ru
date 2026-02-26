export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const DEFAULT_TIMEOUT_MS = 15000;

function humanizeError(raw: unknown): string {
	const code = String(raw ?? '').trim();
	if (!code) return 'Ошибка';

	const map: Record<string, string> = {
		title_required: 'Добавьте текст',
		invalid_credentials: 'Неверный логин или пароль',
		unauthorized: 'Требуется авторизация',
		not_found: 'Не найдено',
		module_not_found: 'Модуль не найден',
		auth_failed: 'Ошибка авторизации',
		too_many_attempts: 'Слишком много попыток. Попробуйте позже.',
		invalid_image: 'Неверный файл изображения',
		file_too_large: 'Слишком большой файл (макс. 3 МБ)',
		name_required: 'Укажите ваше имя (минимум 2 символа)',
		invalid_email: 'Укажите корректный email',
		message_required: 'Напишите сообщение (минимум 10 символов)',
		email_send_failed: 'Не удалось отправить сообщение. Попробуйте позже.',
		'HTTP 404': 'Не найдено (404)',
		'HTTP 401': 'Требуется авторизация (401)',
		'HTTP 500': 'Ошибка сервера (500)',
	};

	return map[code] ?? code;
}

function getBaseUrl() {
	const v = String(import.meta.env.VITE_API_BASE_URL ?? '').trim();
	return v.endsWith('/') ? v.slice(0, -1) : v;
}

function extractError(payload: unknown): string {
	if (!payload || typeof payload !== 'object') return '';
	if (!('error' in payload)) return '';
	return String((payload as { error?: unknown }).error ?? '');
}

function isAbortError(err: unknown): boolean {
	return (
		!!err &&
		typeof err === 'object' &&
		'name' in err &&
		String((err as { name?: unknown }).name ?? '') === 'AbortError'
	);
}

async function request<T>(
	method: HttpMethod,
	url: string,
	body?: unknown,
	token?: string,
): Promise<T> {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

	try {
		const res = await fetch(`${getBaseUrl()}${url}`, {
			method,
			signal: controller.signal,
			headers: {
				'Content-Type': 'application/json',
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
			body: body == null ? undefined : JSON.stringify(body),
		});

		if (!res.ok) {
			let payload: unknown = null;
			try {
				payload = await res.json();
			} catch {
				payload = null;
			}
			const msg = humanizeError(extractError(payload) || `HTTP ${res.status}`);
			throw new Error(msg);
		}

		return (await res.json()) as T;
	} catch (e: unknown) {
		if (isAbortError(e)) {
			throw new Error('Превышено время ожидания ответа');
		}
		throw e instanceof Error ? e : new Error(humanizeError(e));
	} finally {
		clearTimeout(timer);
	}
}

export const http = {
	get: <T>(url: string, token?: string) => request<T>('GET', url, undefined, token),
	post: <T>(url: string, body?: unknown, token?: string) => request<T>('POST', url, body, token),
	put: <T>(url: string, body?: unknown, token?: string) => request<T>('PUT', url, body, token),
	delete: <T>(url: string, token?: string) => request<T>('DELETE', url, undefined, token),
};

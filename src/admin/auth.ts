export const ADMIN_TOKEN_KEY = 'admin_token';
export const ADMIN_EXPIRES_KEY = 'admin_expiresAt';

function safeGet(key: string): string {
	try {
		return sessionStorage.getItem(key) ?? '';
	} catch {
		return '';
	}
}

function safeGetNumber(key: string): number {
	try {
		const v = Number(sessionStorage.getItem(key) ?? '0');
		return Number.isFinite(v) ? v : 0;
	} catch {
		return 0;
	}
}

export function readStoredAdminSession() {
	const token = safeGet(ADMIN_TOKEN_KEY);
	const expiresAt = safeGetNumber(ADMIN_EXPIRES_KEY);
	return { token, expiresAt };
}

export function isAdminAuthed() {
	const { token, expiresAt } = readStoredAdminSession();
	if (!token) return false;
	if (expiresAt && expiresAt <= Date.now()) return false;
	return true;
}

export function writeStoredAdminSession(token: string, expiresAt: number) {
	try {
		sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
		sessionStorage.setItem(ADMIN_EXPIRES_KEY, String(expiresAt));
	} catch {
		return;
	}
}

export function clearStoredAdminSession() {
	try {
		sessionStorage.removeItem(ADMIN_TOKEN_KEY);
		sessionStorage.removeItem(ADMIN_EXPIRES_KEY);
	} catch {
		return;
	}
}

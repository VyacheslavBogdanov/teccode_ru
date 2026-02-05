import { v4 as uuidv4 } from 'uuid';
import { query } from './db.js';

const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

function now() {
	return Date.now();
}

async function cleanupExpiredSessions() {
	const t = new Date(now()).toISOString();
	await query('DELETE FROM sessions WHERE expires_at <= $1', [t]);
}

export async function createSession() {
	const token = uuidv4();
	const createdAt = now();
	const expiresAt = createdAt + SESSION_TTL_MS;

	await cleanupExpiredSessions();
	await query(
		'INSERT INTO sessions (token, created_at, expires_at) VALUES ($1, $2, $3)',
		[token, new Date(createdAt).toISOString(), new Date(expiresAt).toISOString()],
	);

	return { token, expiresAt };
}

export async function deleteSession(token) {
	await cleanupExpiredSessions();
	await query('DELETE FROM sessions WHERE token = $1', [token]);
}

export async function isTokenValid(token) {
	if (!token) return false;
	await cleanupExpiredSessions();
	const { rowCount } = await query(
		'SELECT 1 FROM sessions WHERE token = $1 AND expires_at > NOW() LIMIT 1',
		[token],
	);
	return rowCount > 0;
}

export function getAdminCredentials() {
	const login = String(process.env.ADMIN_LOGIN ?? '').trim();
	const password = String(process.env.ADMIN_PASSWORD ?? '').trim();

	if (process.env.NODE_ENV === 'production') {
		if (!login || login.length < 3) {
			throw new Error('ADMIN_LOGIN must be set (min 3 chars) in production');
		}
		if (!password || password.length < 12) {
			throw new Error('ADMIN_PASSWORD must be set (min 12 chars) in production');
		}
		const weak = new Set(['change-me', 'admin123', 'password', '12345678', 'qwerty123']);
		if (weak.has(password.toLowerCase())) {
			throw new Error('ADMIN_PASSWORD is too weak for production');
		}
	}

	return {
		login: login || 'admin',
		password: password || 'admin123',
	};
}

export function extractBearerToken(req) {
	const header = req.headers['authorization'] ?? '';
	const m = String(header).match(/^Bearer\s+(.+)$/i);
	return m?.[1] ?? null;
}

export function requireAuth() {
	return async (req, res, next) => {
		try {
			const token = extractBearerToken(req);
			const ok = await isTokenValid(token);
			if (!ok) return res.status(401).json({ error: 'unauthorized' });
			next();
		} catch {
			res.status(500).json({ error: 'auth_failed' });
		}
	};
}

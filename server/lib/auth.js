import { v4 as uuidv4 } from 'uuid';
import { readDb, writeDb } from './db.js';

const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

function now() {
	return Date.now();
}

async function cleanupExpiredSessions(db) {
	const t = now();
	const before = db.sessions?.length ?? 0;
	db.sessions = (db.sessions ?? []).filter((s) => (s.expiresAt ?? 0) > t);
	if ((db.sessions?.length ?? 0) !== before) {
		await writeDb(db);
	}
}

export async function createSession() {
	const db = await readDb();
	await cleanupExpiredSessions(db);

	const token = uuidv4();
	const createdAt = now();
	const expiresAt = createdAt + SESSION_TTL_MS;

	db.sessions = db.sessions ?? [];
	db.sessions.push({ token, createdAt, expiresAt });
	await writeDb(db);

	return { token, expiresAt };
}

export async function deleteSession(token) {
	const db = await readDb();
	await cleanupExpiredSessions(db);
	const before = db.sessions?.length ?? 0;
	db.sessions = (db.sessions ?? []).filter((s) => s.token !== token);
	if ((db.sessions?.length ?? 0) !== before) {
		await writeDb(db);
	}
}

export async function isTokenValid(token) {
	if (!token) return false;
	const db = await readDb();
	await cleanupExpiredSessions(db);
	return (db.sessions ?? []).some((s) => s.token === token);
}

export function getAdminCredentials() {
	const login = String(process.env.ADMIN_LOGIN ?? '').trim();
	const password = String(process.env.ADMIN_PASSWORD ?? '').trim();

	if (process.env.NODE_ENV === 'production' && (!login || !password)) {
		throw new Error('ADMIN_LOGIN and ADMIN_PASSWORD must be set in production');
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
		} catch (e) {
			res.status(500).json({ error: 'auth_failed' });
		}
	};
}

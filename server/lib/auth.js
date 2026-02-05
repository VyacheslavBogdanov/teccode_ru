import { v4 as uuidv4 } from 'uuid';
import { prisma } from './prisma.js';

const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

function now() {
	return Date.now();
}

async function cleanupExpiredSessions() {
	const t = new Date();
	await prisma.session.deleteMany({
		where: { expiresAt: { lt: t } },
	});
}

export async function createSession() {
	await cleanupExpiredSessions();

	const token = uuidv4();
	const createdAt = now();
	const expiresAt = createdAt + SESSION_TTL_MS;

	await prisma.session.create({
		data: {
			token,
			createdAt: new Date(createdAt),
			expiresAt: new Date(expiresAt),
		},
	});

	return { token, expiresAt };
}

export async function deleteSession(token) {
	await cleanupExpiredSessions();
	await prisma.session.deleteMany({ where: { token } });
}

export async function isTokenValid(token) {
	if (!token) return false;
	await cleanupExpiredSessions();
	const session = await prisma.session.findUnique({ where: { token } });
	if (!session) return false;
	return session.expiresAt.getTime() > now();
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
		} catch {
			res.status(500).json({ error: 'auth_failed' });
		}
	};
}

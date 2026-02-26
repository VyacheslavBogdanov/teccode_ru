import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { prisma } from './lib/prisma.js';
import {
	getAdminCredentials,
	createSession,
	deleteSession,
	requireAuth,
	extractBearerToken,
} from './lib/auth.js';
import { slugify } from './lib/slugify.js';
import { isMailConfigured, sendContactEmail } from './lib/mailer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, 'uploads');
const distDir = path.resolve(__dirname, '..', 'dist');

await fs.mkdir(uploadsDir, { recursive: true });

const app = express();

const port = Number(process.env.PORT ?? 3001);

function isProd() {
	return String(process.env.NODE_ENV ?? '').trim() === 'production';
}

function validateEnv() {
	if (isProd()) {
		getAdminCredentials();

		const dbUrl = String(process.env.DATABASE_URL ?? '').trim();
		if (!dbUrl) {
			throw new Error('DATABASE_URL must be set in production');
		}
	}
}

validateEnv();

app.disable('x-powered-by');
app.use(express.json({ limit: '15mb' }));

if (String(process.env.TRUST_PROXY ?? '').trim() === '1') {
	app.set('trust proxy', 1);
}

function setSecurityHeaders(_req, res, next) {
	res.setHeader('X-Content-Type-Options', 'nosniff');
	res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
	res.setHeader('X-Frame-Options', 'SAMEORIGIN');
	res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

	if (String(process.env.HSTS ?? '').trim() === '1') {
		res.setHeader('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
	}

	next();
}

app.use(setSecurityHeaders);

const corsOriginRaw = String(process.env.CORS_ORIGIN ?? '').trim();
const corsAllowAll = corsOriginRaw === '*';
const corsAllowList = corsAllowAll
	? null
	: corsOriginRaw.split(',').map((s) => s.trim()).filter(Boolean);

if (corsOriginRaw) {
	if (isProd() && corsAllowAll) {
		console.warn('[server] WARNING: CORS_ORIGIN="*" in production. Consider using an explicit allowlist.');
	}

	const corsOptions = {
		origin(origin, cb) {
			if (!origin) return cb(null, true);
			if (corsAllowAll) return cb(null, true);
			if (corsAllowList?.includes(origin)) return cb(null, true);
			return cb(new Error('cors_not_allowed'));
		},
		credentials: false,
	};

	app.use(cors(corsOptions));
	app.options('*', cors(corsOptions));
}

function asyncHandler(fn) {
	return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

app.use('/uploads', express.static(uploadsDir));

try {
	await fs.access(distDir);
	app.use(express.static(distDir));
	app.get(/^\/(?!api\/|uploads\/).*/, async (_req, res) => {
		res.sendFile(path.join(distDir, 'index.html'));
	});
} catch {

}

const loginAttempts = new Map();

function rateLimitLogin(req, res, next) {
	const ip = String(req.ip ?? req.connection?.remoteAddress ?? 'unknown');
	const now = Date.now();
	const windowMs = 10 * 60 * 1000;
	const max = 20;

	const entry = loginAttempts.get(ip) ?? { count: 0, resetAt: now + windowMs };
	if (now > entry.resetAt) {
		entry.count = 0;
		entry.resetAt = now + windowMs;
	}
	entry.count += 1;
	loginAttempts.set(ip, entry);

	if (entry.count > max) {
		return res.status(429).json({ error: 'too_many_attempts' });
	}
	return next();
}

function parseImageDataUrl(dataUrl) {
	const raw = String(dataUrl ?? '').trim();
	const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(raw);
	if (!m) return null;
	return { mime: m[1], base64: m[2] };
}

const mimeExt = {
	'image/png': 'png',
	'image/jpeg': 'jpg',
	'image/webp': 'webp',
	'image/gif': 'gif',
};

async function handleImageUpload(req, res) {
	const { dataUrl } = req.body ?? {};
	const parsed = parseImageDataUrl(dataUrl);
	if (!parsed) return res.status(400).json({ error: 'invalid_image' });

	const ext = mimeExt[parsed.mime];
	if (!ext) return res.status(400).json({ error: 'invalid_image' });

	let buffer;
	try {
		buffer = Buffer.from(parsed.base64, 'base64');
	} catch {
		return res.status(400).json({ error: 'invalid_image' });
	}

	if (buffer.length > 3 * 1024 * 1024) {
		return res.status(400).json({ error: 'file_too_large' });
	}

	const name = `${uuidv4()}.${ext}`;
	await fs.writeFile(path.join(uploadsDir, name), buffer);
	res.status(201).json({ url: `/uploads/${name}` });
}

app.post('/api/uploads', requireAuth(), asyncHandler(handleImageUpload));
app.post('/api/admin/uploads', requireAuth(), asyncHandler(handleImageUpload));

async function computeUniqueSlug(baseSlug) {
	let finalSlug = baseSlug;
	for (let i = 2; ; i += 1) {
		const exists = await prisma.module.findUnique({
			where: { slug: finalSlug },
			select: { id: true },
		});
		if (!exists) return finalSlug;
		finalSlug = `${baseSlug}-${i}`;
	}
}

function toPublicModule(module, documents) {
	return {
		id: module.id,
		slug: module.slug,
		title: module.title,
		preview: module.preview,
		description: module.description,
		documents: (documents ?? []).map((d) => ({
			id: d.id,
			title: d.title,
			updatedAt: d.updatedAt,
		})),
	};
}

function toAdminModule(module, documents) {
	return {
		...toPublicModule(module, documents),
		updatedAt: module.updatedAt,
		createdAt: module.createdAt,
	};
}

app.get('/api/health', asyncHandler(async (_req, res) => {
	try {
		await prisma.$queryRaw`SELECT 1`;
		return res.json({
			ok: true,
			port,
			uploads: true,
			db: true,
			version: 'pg_prisma_v1',
		});
	} catch {
		return res.status(500).json({ ok: false, db: false });
	}
}));

app.get('/api/modules', asyncHandler(async (_req, res) => {
	const modules = await prisma.module.findMany({
		select: { id: true, slug: true, title: true, preview: true },
		orderBy: { updatedAt: 'desc' },
	});
	res.json({ modules });
}));

app.get('/api/modules/:slug', asyncHandler(async (req, res) => {
	const module = await prisma.module.findUnique({
		where: { slug: req.params.slug },
	});
	if (!module) return res.status(404).json({ error: 'not_found' });

	const documents = await prisma.document.findMany({
		where: { moduleId: module.id },
		select: { id: true, title: true, updatedAt: true },
		orderBy: { updatedAt: 'desc' },
	});

	res.json({ module: toPublicModule(module, documents) });
}));

app.get('/api/documents/:id', asyncHandler(async (req, res) => {
	const document = await prisma.document.findUnique({ where: { id: req.params.id } });
	if (!document) return res.status(404).json({ error: 'not_found' });
	res.json({ document });
}));

const contactAttempts = new Map();

function rateLimitContact(req, res, next) {
	const ip = String(req.ip ?? req.connection?.remoteAddress ?? 'unknown');
	const now = Date.now();
	const windowMs = 15 * 60 * 1000;
	const max = 5;

	const entry = contactAttempts.get(ip) ?? { count: 0, resetAt: now + windowMs };
	if (now > entry.resetAt) {
		entry.count = 0;
		entry.resetAt = now + windowMs;
	}
	entry.count += 1;
	contactAttempts.set(ip, entry);

	if (entry.count > max) {
		return res.status(429).json({ error: 'too_many_attempts' });
	}
	return next();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.post('/api/contact', rateLimitContact, asyncHandler(async (req, res) => {
	const rawName = String(req.body?.name ?? '').trim().slice(0, 200);
	const rawEmail = String(req.body?.email ?? '').trim().slice(0, 200);
	const rawMessage = String(req.body?.message ?? '').trim().slice(0, 5000);

	if (rawName.length < 2) {
		return res.status(400).json({ error: 'name_required' });
	}
	if (!EMAIL_RE.test(rawEmail)) {
		return res.status(400).json({ error: 'invalid_email' });
	}
	if (rawMessage.length < 10) {
		return res.status(400).json({ error: 'message_required' });
	}

	const submission = await prisma.contactSubmission.create({
		data: { name: rawName, email: rawEmail, message: rawMessage },
	});

	if (!isMailConfigured()) {
		return res.json({ ok: true });
	}

	try {
		await sendContactEmail({ name: rawName, email: rawEmail, message: rawMessage });
		await prisma.contactSubmission.update({
			where: { id: submission.id },
			data: { emailSent: true },
		});
		return res.json({ ok: true });
	} catch (err) {
		console.error('[server] email send failed:', err);
		return res.status(500).json({ error: 'email_send_failed' });
	}
}));

app.post('/api/auth/login', rateLimitLogin, asyncHandler(async (req, res) => {
	const { login, password } = req.body ?? {};
	const creds = getAdminCredentials();
	if (login !== creds.login || password !== creds.password) {
		return res.status(401).json({ error: 'invalid_credentials' });
	}
	const { token, expiresAt } = await createSession();
	res.json({ token, expiresAt });
}));

app.post('/api/auth/logout', asyncHandler(async (req, res) => {
	const token = extractBearerToken(req);
	if (token) await deleteSession(token);
	res.json({ ok: true });
}));

app.get('/api/admin/modules', requireAuth(), asyncHandler(async (_req, res) => {
	const modules = await prisma.module.findMany({
		select: { id: true, slug: true, title: true, preview: true, updatedAt: true },
		orderBy: { updatedAt: 'desc' },
	});
	res.json({ modules });
}));

app.get('/api/admin/modules/:id', requireAuth(), asyncHandler(async (req, res) => {
	const module = await prisma.module.findUnique({ where: { id: req.params.id } });
	if (!module) return res.status(404).json({ error: 'not_found' });

	const documents = await prisma.document.findMany({
		where: { moduleId: module.id },
		select: { id: true, title: true, updatedAt: true },
		orderBy: { updatedAt: 'desc' },
	});

	res.json({ module: toAdminModule(module, documents) });
}));

app.post('/api/admin/modules', requireAuth(), asyncHandler(async (req, res) => {
	const { title, preview, description, slug } = req.body ?? {};
	if (!title || String(title).trim().length < 2) {
		return res.status(400).json({ error: 'title_required' });
	}

	const baseSlug = String(slug ?? slugify(title) ?? '').trim() || uuidv4().slice(0, 8);
	const finalSlug = await computeUniqueSlug(baseSlug);

	const now = new Date();
	const module = await prisma.module.create({
		data: {
			slug: finalSlug,
			title: String(title).trim(),
			preview: String(preview ?? '🧩'),
			description: String(description ?? ''),
			createdAt: now,
			updatedAt: now,
		},
	});

	res.status(201).json({ module: toAdminModule(module, []) });
}));

app.put('/api/admin/modules/:id', requireAuth(), asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { title, preview, description } = req.body ?? {};

	const existing = await prisma.module.findUnique({ where: { id }, select: { id: true } });
	if (!existing) return res.status(404).json({ error: 'not_found' });

	const module = await prisma.module.update({
		where: { id },
		data: {
			...(title != null ? { title: String(title).trim() } : {}),
			...(preview != null ? { preview: String(preview) } : {}),
			...(description != null ? { description: String(description) } : {}),
			updatedAt: new Date(),
		},
	});

	const documents = await prisma.document.findMany({
		where: { moduleId: module.id },
		select: { id: true, title: true, updatedAt: true },
		orderBy: { updatedAt: 'desc' },
	});

	res.json({ module: toAdminModule(module, documents) });
}));

app.delete('/api/admin/modules/:id', requireAuth(), asyncHandler(async (req, res) => {
	const { id } = req.params;

	const existing = await prisma.module.findUnique({ where: { id }, select: { id: true } });
	if (!existing) return res.status(404).json({ error: 'not_found' });

	await prisma.module.delete({ where: { id } });
	res.json({ ok: true });
}));

app.post('/api/admin/modules/:moduleId/documents', requireAuth(), asyncHandler(async (req, res) => {
	const { moduleId } = req.params;
	const { title, content } = req.body ?? {};
	if (!title || String(title).trim().length < 2) {
		return res.status(400).json({ error: 'title_required' });
	}

	const module = await prisma.module.findUnique({ where: { id: moduleId }, select: { id: true } });
	if (!module) return res.status(404).json({ error: 'module_not_found' });

	const doc = await prisma.document.create({
		data: {
			moduleId,
			title: String(title).trim(),
			content: String(content ?? ''),
			updatedAt: new Date(),
		},
	});

	res.status(201).json({ document: doc });
}));

app.put('/api/admin/documents/:id', requireAuth(), asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { title, content } = req.body ?? {};

	const existing = await prisma.document.findUnique({ where: { id }, select: { id: true } });
	if (!existing) return res.status(404).json({ error: 'not_found' });

	const document = await prisma.document.update({
		where: { id },
		data: {
			...(title != null ? { title: String(title).trim() } : {}),
			...(content != null ? { content: String(content) } : {}),
			updatedAt: new Date(),
		},
	});

	res.json({ document });
}));

app.delete('/api/admin/documents/:id', requireAuth(), asyncHandler(async (req, res) => {
	const { id } = req.params;
	const existing = await prisma.document.findUnique({ where: { id }, select: { id: true } });
	if (!existing) return res.status(404).json({ error: 'not_found' });

	await prisma.document.delete({ where: { id } });
	res.json({ ok: true });
}));

app.use('/api', (_req, res) => {
	res.status(404).json({ error: 'not_found' });
});

app.use((err, req, res, next) => {
	const code = err?.message === 'cors_not_allowed' ? 403 : 500;
	if (code !== 403) {
		console.error('[server] error:', err);
	}
	if (res.headersSent) return next(err);
	res.status(code).json({ error: code === 403 ? 'cors_not_allowed' : 'internal_error' });
});

const server = app.listen(port, () => {
	console.log(`[server] http://localhost:${port}`);
});

server.on('error', (err) => {
	if (err && err.code === 'EADDRINUSE') {
		console.error(`[server] Порт ${port} уже занят. Останови старый процесс или задай PORT в .env (например PORT=3002).`);
		process.exit(1);
	}
	throw err;
});

async function shutdown(signal) {
	try {
		console.log(`[server] ${signal} received, shutting down...`);
		server.close(() => {
			console.log('[server] http server closed');
		});
		await prisma.$disconnect();
	} catch (e) {
		console.error('[server] shutdown failed:', e);
	} finally {
		process.exit(0);
	}
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { closePool, query, withTransaction } from './lib/db.js';
import { migrate } from './lib/migrate.js';
import {
	getAdminCredentials,
	createSession,
	deleteSession,
	requireAuth,
	extractBearerToken,
} from './lib/auth.js';
import { slugify } from './lib/slugify.js';

process.on('unhandledRejection', (reason) => {
	console.error('[server] unhandledRejection', reason);
});

process.on('uncaughtException', (err) => {
	console.error('[server] uncaughtException', err);
	process.exit(1);
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, 'uploads');

async function readAppVersion() {
	try {
		const raw = await fs.readFile(path.join(__dirname, '..', 'package.json'), 'utf8');
		const pkg = JSON.parse(raw);
		return String(pkg?.version ?? '').trim() || 'unknown';
	} catch {
		return 'unknown';
	}
}

function requireProductionEnv() {
	if (process.env.NODE_ENV !== 'production') return;

	const corsOriginRaw = String(process.env.CORS_ORIGIN ?? '').trim();
	if (!corsOriginRaw || corsOriginRaw === '*') {
		throw new Error('CORS_ORIGIN must be set to explicit origins in production');
	}

	getAdminCredentials();
}

await fs.mkdir(uploadsDir, { recursive: true });
requireProductionEnv();
await migrate();
const appVersion = await readAppVersion();

const app = express();

const port = Number(process.env.PORT ?? 3001);

app.disable('x-powered-by');
if (process.env.TRUST_PROXY) {
	app.set('trust proxy', process.env.TRUST_PROXY === 'true' ? 1 : Number(process.env.TRUST_PROXY));
}
app.use(helmet());
app.use(express.json({ limit: '15mb' }));

const corsOriginRaw = String(process.env.CORS_ORIGIN ?? '').trim();
const allowAllOrigins = !corsOriginRaw || corsOriginRaw === '*';
const allowList = allowAllOrigins
	? undefined
	: corsOriginRaw.split(',').map((s) => s.trim()).filter(Boolean);

function expandOriginVariants(origin) {
	try {
		const u = new URL(origin);
		const port = u.port ? `:${u.port}` : '';
		const base = (host) => `${u.protocol}//${host}${port}`;

		const out = [origin];
		if (u.hostname === 'localhost') {
			out.push(base('127.0.0.1'));
			out.push(base('[::1]'));
		} else if (u.hostname === '127.0.0.1' || u.hostname === '[::1]' || u.hostname === '::1') {
			out.push(base('localhost'));
		}
		return out;
	} catch {
		return [origin];
	}
}

const allowListExpanded = allowList
	? Array.from(new Set(allowList.flatMap((o) => expandOriginVariants(o))))
	: undefined;

const corsOptions = {
	origin: allowListExpanded ?? true,
	credentials: false,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

const apiLimiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	limit: 600,
	standardHeaders: true,
	legacyHeaders: false,
	message: { error: 'too_many_requests' },
	skip: (req) => req.path === '/health' || req.path === '/ready',
});
app.use('/api', apiLimiter);

app.use('/uploads', (_req, res, next) => {
	res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
	next();
});
app.use('/uploads', express.static(uploadsDir));

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
			updatedAt: d.updated_at ?? d.updatedAt,
		})),
	};
}

function toAdminModule(module, documents) {
	return {
		...toPublicModule(module, documents),
		updatedAt: module.updated_at ?? module.updatedAt,
	};
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

app.get('/api/health', (_req, res) =>
	query('SELECT 1')
		.then(() =>
			res.json({
				ok: true,
				port,
				uploads: true,
				db: 'postgres',
				cwd: process.cwd(),
				pid: process.pid,
				version: appVersion,
			}),
		)
		.catch(() =>
			res.status(503).json({
				ok: false,
				port,
				uploads: true,
				db: 'postgres',
				cwd: process.cwd(),
				pid: process.pid,
				version: appVersion,
				error: 'db_unavailable',
			}),
		),
);

app.get('/api/ready', (_req, res) =>
	query('SELECT 1')
		.then(() => res.json({ ready: true }))
		.catch(() => res.status(503).json({ ready: false })),
);

app.get('/api/modules', async (_req, res) => {
	const { rows } = await query(
		'SELECT id, slug, title, preview FROM modules ORDER BY updated_at DESC',
	);
	const modules = rows.map((r) => ({
		id: r.id,
		slug: r.slug,
		title: r.title,
		preview: r.preview,
	}));
	res.json({ modules });
});

app.get('/api/modules/:slug', async (req, res) => {
	const slug = String(req.params.slug ?? '').trim();
	const moduleRes = await query(
		'SELECT id, slug, title, preview, description, updated_at FROM modules WHERE slug = $1 LIMIT 1',
		[slug],
	);
	const module = moduleRes.rows[0];
	if (!module) return res.status(404).json({ error: 'not_found' });

	const docsRes = await query(
		'SELECT id, title, updated_at FROM documents WHERE module_id = $1 ORDER BY updated_at DESC',
		[module.id],
	);

	res.json({ module: toPublicModule(module, docsRes.rows) });
});

app.get('/api/documents/:id', async (req, res) => {
	const id = String(req.params.id ?? '').trim();
	const { rows } = await query(
		'SELECT id, module_id AS "moduleId", title, content, updated_at AS "updatedAt" FROM documents WHERE id = $1 LIMIT 1',
		[id],
	);
	const doc = rows[0];
	if (!doc) return res.status(404).json({ error: 'not_found' });
	res.json({ document: doc });
});

app.post('/api/auth/login', rateLimitLogin, async (req, res) => {
	const { login, password } = req.body ?? {};
	const creds = getAdminCredentials();
	if (login !== creds.login || password !== creds.password) {
		return res.status(401).json({ error: 'invalid_credentials' });
	}
	const { token, expiresAt } = await createSession();
	res.json({ token, expiresAt });
});

app.post('/api/auth/logout', async (req, res) => {
	const token = extractBearerToken(req);
	if (token) await deleteSession(token);
	res.json({ ok: true });
});

app.get('/api/admin/modules', requireAuth(), async (_req, res) => {
	const { rows } = await query(
		'SELECT id, slug, title, preview, updated_at AS "updatedAt" FROM modules ORDER BY updated_at DESC',
	);
	const modules = rows.map((r) => ({
		id: r.id,
		slug: r.slug,
		title: r.title,
		preview: r.preview,
		updatedAt: r.updatedAt,
	}));
	res.json({ modules });
});

app.get('/api/admin/modules/:id', requireAuth(), async (req, res) => {
	const id = String(req.params.id ?? '').trim();
	const moduleRes = await query(
		'SELECT id, slug, title, preview, description, updated_at FROM modules WHERE id = $1 LIMIT 1',
		[id],
	);
	const module = moduleRes.rows[0];
	if (!module) return res.status(404).json({ error: 'not_found' });

	const docsRes = await query(
		'SELECT id, title, updated_at FROM documents WHERE module_id = $1 ORDER BY updated_at DESC',
		[module.id],
	);
	res.json({ module: toAdminModule(module, docsRes.rows) });
});

app.post('/api/admin/modules', requireAuth(), async (req, res) => {
	const { title, preview, description, slug } = req.body ?? {};
	if (!title || String(title).trim().length < 2) {
		return res.status(400).json({ error: 'title_required' });
	}

	const baseSlug = String(slug ?? slugify(title) ?? '').trim() || uuidv4().slice(0, 8);
	let finalSlug = baseSlug;
	let i = 2;
	while (true) {
		const { rowCount } = await query('SELECT 1 FROM modules WHERE slug = $1 LIMIT 1', [
			finalSlug,
		]);
		if (rowCount === 0) break;
		finalSlug = `${baseSlug}-${i++}`;
	}

	const moduleId = uuidv4();
	const nowIso = new Date().toISOString();
	const module = {
		id: moduleId,
		slug: finalSlug,
		title: String(title).trim(),
		preview: String(preview ?? '🧩'),
		description: String(description ?? ''),
		created_at: nowIso,
		updated_at: nowIso,
	};

	await query(
		`INSERT INTO modules (id, slug, title, preview, description, created_at, updated_at)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		[
			module.id,
			module.slug,
			module.title,
			module.preview,
			module.description,
			module.created_at,
			module.updated_at,
		],
	);

	res.status(201).json({ module: toAdminModule(module, []) });
});

app.put('/api/admin/modules/:id', requireAuth(), async (req, res) => {
	const { id } = req.params;
	const { title, preview, description } = req.body ?? {};
	const nowIso = new Date().toISOString();

	const current = await query(
		'SELECT id, slug, title, preview, description, updated_at FROM modules WHERE id = $1 LIMIT 1',
		[String(id).trim()],
	);
	const module = current.rows[0];
	if (!module) return res.status(404).json({ error: 'not_found' });

	const nextTitle = title != null ? String(title).trim() : module.title;
	const nextPreview = preview != null ? String(preview) : module.preview;
	const nextDescription = description != null ? String(description) : module.description;

	await query(
		`UPDATE modules
		 SET title = $2, preview = $3, description = $4, updated_at = $5
		 WHERE id = $1`,
		[String(id).trim(), nextTitle, nextPreview, nextDescription, nowIso],
	);

	const docsRes = await query(
		'SELECT id, title, updated_at FROM documents WHERE module_id = $1 ORDER BY updated_at DESC',
		[String(id).trim()],
	);
	res.json({
		module: toAdminModule(
			{
				id: module.id,
				slug: module.slug,
				title: nextTitle,
				preview: nextPreview,
				description: nextDescription,
				updated_at: nowIso,
			},
			docsRes.rows,
		),
	});
});

app.delete('/api/admin/modules/:id', requireAuth(), async (req, res) => {
	const { id } = req.params;
	const result = await query('DELETE FROM modules WHERE id = $1', [String(id).trim()]);
	if (result.rowCount === 0) return res.status(404).json({ error: 'not_found' });
	res.json({ ok: true });
});

app.post('/api/admin/modules/:moduleId/documents', requireAuth(), async (req, res) => {
	const { moduleId } = req.params;
	const { title, content } = req.body ?? {};
	if (!title || String(title).trim().length < 2) {
		return res.status(400).json({ error: 'title_required' });
	}

	const moduleIdTrim = String(moduleId).trim();
	const moduleRes = await query('SELECT id FROM modules WHERE id = $1 LIMIT 1', [moduleIdTrim]);
	if (moduleRes.rowCount === 0) return res.status(404).json({ error: 'module_not_found' });

	const doc = {
		id: uuidv4(),
		moduleId: moduleIdTrim,
		title: String(title).trim(),
		content: String(content ?? ''),
		updatedAt: new Date().toISOString(),
	};

	await withTransaction(async (client) => {
		await client.query(
			`INSERT INTO documents (id, module_id, title, content, updated_at)
			 VALUES ($1, $2, $3, $4, $5)`,
			[doc.id, doc.moduleId, doc.title, doc.content, doc.updatedAt],
		);
		await client.query('UPDATE modules SET updated_at = $2 WHERE id = $1', [
			doc.moduleId,
			doc.updatedAt,
		]);
	});

	res.status(201).json({ document: doc });
});

app.put('/api/admin/documents/:id', requireAuth(), async (req, res) => {
	const { id } = req.params;
	const { title, content } = req.body ?? {};
	const idTrim = String(id).trim();
	const current = await query(
		'SELECT id, module_id AS "moduleId", title, content FROM documents WHERE id = $1 LIMIT 1',
		[idTrim],
	);
	const doc = current.rows[0];
	if (!doc) return res.status(404).json({ error: 'not_found' });

	const nextTitle = title != null ? String(title).trim() : doc.title;
	const nextContent = content != null ? String(content) : doc.content;
	const nowIso = new Date().toISOString();

	await withTransaction(async (client) => {
		await client.query(
			'UPDATE documents SET title = $2, content = $3, updated_at = $4 WHERE id = $1',
			[idTrim, nextTitle, nextContent, nowIso],
		);
		await client.query('UPDATE modules SET updated_at = $2 WHERE id = $1', [
			doc.moduleId,
			nowIso,
		]);
	});

	res.json({
		document: {
			id: idTrim,
			moduleId: doc.moduleId,
			title: nextTitle,
			content: nextContent,
			updatedAt: nowIso,
		},
	});
});

app.delete('/api/admin/documents/:id', requireAuth(), async (req, res) => {
	const { id } = req.params;
	const idTrim = String(id).trim();
	const docRes = await query(
		'SELECT id, module_id AS "moduleId" FROM documents WHERE id = $1 LIMIT 1',
		[idTrim],
	);
	const doc = docRes.rows[0];
	if (!doc) return res.status(404).json({ error: 'not_found' });

	const nowIso = new Date().toISOString();
	await withTransaction(async (client) => {
		await client.query('DELETE FROM documents WHERE id = $1', [idTrim]);
		await client.query('UPDATE modules SET updated_at = $2 WHERE id = $1', [
			doc.moduleId,
			nowIso,
		]);
	});

	res.json({ ok: true });
});

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
	const relativeUrl = `/uploads/${name}`;
	const baseRaw = String(process.env.PUBLIC_BASE_URL ?? '').trim().replace(/\/+$/, '');
	let base = baseRaw;
	if (!base) {
		const xfProto = String(req.headers['x-forwarded-proto'] ?? '')
			.split(',')[0]
			.trim()
			.toLowerCase();
		const xfHost = String(req.headers['x-forwarded-host'] ?? '')
			.split(',')[0]
			.trim();
		if ((xfProto === 'http' || xfProto === 'https') && xfHost) {
			base = `${xfProto}://${xfHost}`;
		} else {
			base = `${req.protocol}://${req.get('host')}`;
		}
	}
	res.status(201).json({ url: `${base}${relativeUrl}`, path: relativeUrl });
}

app.post('/api/uploads', requireAuth(), handleImageUpload);
app.post('/api/admin/uploads', requireAuth(), handleImageUpload);

app.use((err, req, res, next) => {
	try {
		console.error('[server] error', {
			method: req.method,
			path: req.path,
			error: String(err?.message ?? err),
		});
	} catch {
	}
	if (res.headersSent) return next(err);
	res.status(500).json({ error: process.env.NODE_ENV === 'production' ? 'internal_error' : 'error' });
});

app.use((_req, res) => res.status(404).json({ error: 'not_found' }));

const server = app.listen(port, () => {
	console.log(`[server] http://localhost:${port}`);
	console.log(`[server] db: postgres (DATABASE_URL=${process.env.DATABASE_URL ? 'set' : 'missing'})`);
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
		console.log(`[server] shutdown (${signal})`);
		const timer = setTimeout(() => {
			console.error('[server] shutdown timeout');
			process.exit(1);
		}, 30_000);
		await new Promise((resolve) => server.close(resolve));
		await closePool();
		clearTimeout(timer);
		process.exit(0);
	} catch (e) {
		console.error('[server] shutdown failed', e);
		process.exit(1);
	}
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

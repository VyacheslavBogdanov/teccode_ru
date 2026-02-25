import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { DB_FILE, ensureDbFile, readDb, writeDb } from './lib/db.js';
import { buildDefaultDb } from './seed/defaultData.js';
import {
	getAdminCredentials,
	createSession,
	deleteSession,
	requireAuth,
	extractBearerToken,
} from './lib/auth.js';
import { slugify } from './lib/slugify.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, 'uploads');

await fs.mkdir(uploadsDir, { recursive: true });
await ensureDbFile(async () => buildDefaultDb());

const app = express();

const port = Number(process.env.PORT ?? 3001);

app.disable('x-powered-by');
app.use(express.json({ limit: '15mb' }));

const corsOriginRaw = String(process.env.CORS_ORIGIN ?? '').trim();
const allowAllOrigins = !corsOriginRaw || corsOriginRaw === '*';
const allowList = allowAllOrigins
	? undefined
	: corsOriginRaw.split(',').map((s) => s.trim()).filter(Boolean);

const corsOptions = {
	origin: allowList ?? true,
	credentials: false,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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

function expandDocuments(module, db) {
	return (module.documents ?? [])
		.map((id) => (db.documents ?? []).find((d) => d.id === id))
		.filter(Boolean)
		.map((d) => ({ id: d.id, title: d.title, updatedAt: d.updatedAt }));
}

function toPublicModule(module, db) {
	return {
		id: module.id,
		slug: module.slug,
		title: module.title,
		preview: module.preview,
		description: module.description,
		documents: expandDocuments(module, db),
	};
}

function toAdminModule(module, db) {
	return {
		...toPublicModule(module, db),
		updatedAt: module.updatedAt,
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
	res.json({
		ok: true,
		port,
		uploads: true,
		dbFile: DB_FILE,
		cwd: process.cwd(),
		pid: process.pid,
		version: 'fix3_patch2',
	}),
);

app.get('/api/modules', async (_req, res) => {
	const db = await readDb();
	const modules = (db.modules ?? []).map(({ id, slug, title, preview }) => ({
		id,
		slug,
		title,
		preview,
	}));
	res.json({ modules });
});

app.get('/api/modules/:slug', async (req, res) => {
	const db = await readDb();
	const module = (db.modules ?? []).find((m) => m.slug === req.params.slug);
	if (!module) return res.status(404).json({ error: 'not_found' });
	res.json({ module: toPublicModule(module, db) });
});

app.get('/api/documents/:id', async (req, res) => {
	const db = await readDb();
	const doc = (db.documents ?? []).find((d) => d.id === req.params.id);
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
	const db = await readDb();
	const modules = (db.modules ?? []).map(({ id, slug, title, preview, updatedAt }) => ({
		id,
		slug,
		title,
		preview,
		updatedAt,
	}));
	res.json({ modules });
});

app.get('/api/admin/modules/:id', requireAuth(), async (req, res) => {
	const db = await readDb();
	const module = (db.modules ?? []).find((m) => m.id === req.params.id);
	if (!module) return res.status(404).json({ error: 'not_found' });
	res.json({ module: toAdminModule(module, db) });
});

app.post('/api/admin/modules', requireAuth(), async (req, res) => {
	const { title, preview, description, slug } = req.body ?? {};
	if (!title || String(title).trim().length < 2) {
		return res.status(400).json({ error: 'title_required' });
	}

	const db = await readDb();
	const baseSlug = String(slug ?? slugify(title) ?? '').trim() || uuidv4().slice(0, 8);
	let finalSlug = baseSlug;
	let i = 2;
	while ((db.modules ?? []).some((m) => m.slug === finalSlug)) {
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
		documents: [],
		createdAt: nowIso,
		updatedAt: nowIso,
	};

	db.modules = db.modules ?? [];
	db.modules.push(module);
	await writeDb(db);

	res.status(201).json({ module: toAdminModule(module, db) });
});

app.put('/api/admin/modules/:id', requireAuth(), async (req, res) => {
	const { id } = req.params;
	const { title, preview, description } = req.body ?? {};
	const db = await readDb();
	const module = (db.modules ?? []).find((m) => m.id === id);
	if (!module) return res.status(404).json({ error: 'not_found' });

	if (title != null) module.title = String(title).trim();
	if (preview != null) module.preview = String(preview);
	if (description != null) module.description = String(description);
	module.updatedAt = new Date().toISOString();

	await writeDb(db);
	res.json({ module: toAdminModule(module, db) });
});

app.delete('/api/admin/modules/:id', requireAuth(), async (req, res) => {
	const { id } = req.params;
	const db = await readDb();
	const module = (db.modules ?? []).find((m) => m.id === id);
	if (!module) return res.status(404).json({ error: 'not_found' });

	const docSet = new Set(module.documents ?? []);
	db.documents = (db.documents ?? []).filter((d) => !docSet.has(d.id));
	db.modules = (db.modules ?? []).filter((m) => m.id !== id);

	await writeDb(db);
	res.json({ ok: true });
});

app.post('/api/admin/modules/:moduleId/documents', requireAuth(), async (req, res) => {
	const { moduleId } = req.params;
	const { title, content } = req.body ?? {};
	if (!title || String(title).trim().length < 2) {
		return res.status(400).json({ error: 'title_required' });
	}

	const db = await readDb();
	const module = (db.modules ?? []).find((m) => m.id === moduleId);
	if (!module) return res.status(404).json({ error: 'module_not_found' });

	const doc = {
		id: uuidv4(),
		moduleId,
		title: String(title).trim(),
		content: String(content ?? ''),
		updatedAt: new Date().toISOString(),
	};

	db.documents = db.documents ?? [];
	db.documents.push(doc);
	module.documents = module.documents ?? [];
	module.documents.push(doc.id);
	module.updatedAt = new Date().toISOString();

	await writeDb(db);
	res.status(201).json({ document: doc });
});

app.put('/api/admin/documents/:id', requireAuth(), async (req, res) => {
	const { id } = req.params;
	const { title, content } = req.body ?? {};
	const db = await readDb();
	const doc = (db.documents ?? []).find((d) => d.id === id);
	if (!doc) return res.status(404).json({ error: 'not_found' });

	if (title != null) doc.title = String(title).trim();
	if (content != null) doc.content = String(content);
	doc.updatedAt = new Date().toISOString();

	await writeDb(db);
	res.json({ document: doc });
});

app.delete('/api/admin/documents/:id', requireAuth(), async (req, res) => {
	const { id } = req.params;
	const db = await readDb();
	const doc = (db.documents ?? []).find((d) => d.id === req.params.id);
	if (!doc) return res.status(404).json({ error: 'not_found' });

	const module = (db.modules ?? []).find((m) => m.id === doc.moduleId);
	if (module) {
		module.documents = (module.documents ?? []).filter((x) => x !== id);
		module.updatedAt = new Date().toISOString();
	}

	db.documents = (db.documents ?? []).filter((d) => d.id !== id);
	await writeDb(db);
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
	res.status(201).json({ url: `/uploads/${name}` });
}

app.post('/api/uploads', requireAuth(), handleImageUpload);
app.post('/api/admin/uploads', requireAuth(), handleImageUpload);

const server = app.listen(port, () => {
	console.log(`[server] http://localhost:${port}`);
	console.log(`[server] db: ${DB_FILE}`);
});

server.on('error', (err) => {
	if (err && err.code === 'EADDRINUSE') {
		console.error(`[server] Порт ${port} уже занят. Останови старый процесс или задай PORT в .env (например PORT=3002).`);
		process.exit(1);
	}
	throw err;
});

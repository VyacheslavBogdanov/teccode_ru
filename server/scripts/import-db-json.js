import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { prisma } from '../lib/prisma.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DB_JSON = path.resolve(__dirname, '..', 'data', 'db.json');

function hasFlag(name) {
	return process.argv.includes(name);
}

function getFlagValue(name) {
	const i = process.argv.indexOf(name);
	if (i === -1) return null;
	return process.argv[i + 1] ?? null;
}

function toDate(value) {
	if (value == null) return null;

	if (typeof value === 'string') return new Date(value);

	if (typeof value === 'number') return new Date(value);
	return new Date(String(value));
}

async function main() {
	const wipe = hasFlag('--wipe');

	const fileFromArg = getFlagValue('--file');
	const fileFromEnv = process.env.DB_JSON_PATH ? String(process.env.DB_JSON_PATH).trim() : '';
	const dbJsonPath = (fileFromArg && String(fileFromArg).trim()) || fileFromEnv || DEFAULT_DB_JSON;

	const raw = await fs.readFile(dbJsonPath, 'utf8');
	const data = JSON.parse(raw);

	const modules = data.modules ?? [];
	const documents = data.documents ?? [];
	const sessions = data.sessions ?? [];

	console.log(`[import] db.json: ${dbJsonPath}`);
	console.log(`[import] modules=${modules.length} documents=${documents.length} sessions=${sessions.length}`);

	if (wipe) {
		console.log('[import] wiping tables (Session, Document, Module)...');
		await prisma.session.deleteMany();
		await prisma.document.deleteMany();
		await prisma.module.deleteMany();
	}

	console.log('[import] importing modules...');
	for (const m of modules) {
		await prisma.module.upsert({
			where: { id: m.id },
			update: {
				slug: String(m.slug),
				title: String(m.title),
				preview: m.preview != null ? String(m.preview) : null,
				description: m.description != null ? String(m.description) : null,
				createdAt: toDate(m.createdAt) ?? new Date(),
				updatedAt: toDate(m.updatedAt) ?? new Date(),
			},
			create: {
				id: m.id,
				slug: String(m.slug),
				title: String(m.title),
				preview: m.preview != null ? String(m.preview) : null,
				description: m.description != null ? String(m.description) : null,
				createdAt: toDate(m.createdAt) ?? new Date(),
				updatedAt: toDate(m.updatedAt) ?? new Date(),
			},
		});
	}

	console.log('[import] importing documents...');
	for (const d of documents) {
		await prisma.document.upsert({
			where: { id: d.id },
			update: {
				moduleId: String(d.moduleId),
				title: String(d.title),
				content: d.content != null ? String(d.content) : null,
				updatedAt: toDate(d.updatedAt) ?? new Date(),
			},
			create: {
				id: d.id,
				moduleId: String(d.moduleId),
				title: String(d.title),
				content: d.content != null ? String(d.content) : null,
				updatedAt: toDate(d.updatedAt) ?? new Date(),
			},
		});
	}

	console.log('[import] importing sessions...');
	for (const s of sessions) {
		if (!s?.token) continue;
		await prisma.session.upsert({
			where: { token: String(s.token) },
			update: {
				createdAt: toDate(s.createdAt) ?? new Date(),
				expiresAt: toDate(s.expiresAt) ?? new Date(Date.now() + 60_000),
			},
			create: {
				token: String(s.token),
				createdAt: toDate(s.createdAt) ?? new Date(),
				expiresAt: toDate(s.expiresAt) ?? new Date(Date.now() + 60_000),
			},
		});
	}

	const deleted = await prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });
	if (deleted.count) console.log(`[import] cleaned expired sessions: ${deleted.count}`);

	console.log('[import] done');
}

main()
	.catch((e) => {
		console.error('[import] failed:', e);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});


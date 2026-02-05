import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { withTransaction, query, closePool } from '../lib/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultJsonPath = path.resolve(__dirname, '..', 'data', 'db.json');

function isoOrNow(v) {
	const s = String(v ?? '').trim();
	return s ? s : new Date().toISOString();
}

function isUuid(v) {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
		String(v ?? ''),
	);
}

async function readJsonDb(filePath) {
	const raw = await fs.readFile(filePath, 'utf8');
	const parsed = JSON.parse(raw);
	return {
		modules: Array.isArray(parsed?.modules) ? parsed.modules : [],
		documents: Array.isArray(parsed?.documents) ? parsed.documents : [],
		sessions: Array.isArray(parsed?.sessions) ? parsed.sessions : [],
	};
}

async function getCounts() {
	const m = await query('SELECT COUNT(*)::int AS c FROM modules');
	const d = await query('SELECT COUNT(*)::int AS c FROM documents');
	return { modules: m.rows[0]?.c ?? 0, documents: d.rows[0]?.c ?? 0 };
}

async function importJsonToPostgres({ filePath }) {
	const json = await readJsonDb(filePath);

	const counts = await getCounts();
	console.log(`[import] postgres before: modules=${counts.modules} documents=${counts.documents}`);

	let importedModules = 0;
	let importedDocuments = 0;
	let skippedModules = 0;
	let skippedDocuments = 0;

	await withTransaction(async (client) => {
		for (const m of json.modules) {
			if (!isUuid(m?.id) || !String(m?.slug ?? '').trim() || !String(m?.title ?? '').trim()) {
				skippedModules += 1;
				continue;
			}

			const id = String(m.id);
			const slug = String(m.slug).trim();
			const title = String(m.title).trim();
			const preview = String(m.preview ?? '🧩');
			const description = String(m.description ?? '');
			const createdAt = isoOrNow(m.createdAt);
			const updatedAt = isoOrNow(m.updatedAt);

			try {
				await client.query(
					`INSERT INTO modules (id, slug, title, preview, description, created_at, updated_at)
					 VALUES ($1, $2, $3, $4, $5, $6, $7)
					 ON CONFLICT (id) DO UPDATE SET
					   slug = EXCLUDED.slug,
					   title = EXCLUDED.title,
					   preview = EXCLUDED.preview,
					   description = EXCLUDED.description,
					   created_at = EXCLUDED.created_at,
					   updated_at = EXCLUDED.updated_at`,
					[id, slug, title, preview, description, createdAt, updatedAt],
				);
				importedModules += 1;
			} catch {
				skippedModules += 1;
			}
		}

		for (const d of json.documents) {
			if (!isUuid(d?.id) || !isUuid(d?.moduleId) || !String(d?.title ?? '').trim()) {
				skippedDocuments += 1;
				continue;
			}

			const id = String(d.id);
			const moduleId = String(d.moduleId);
			const title = String(d.title).trim();
			const content = String(d.content ?? '');
			const updatedAt = isoOrNow(d.updatedAt);

			try {
				await client.query(
					`INSERT INTO documents (id, module_id, title, content, updated_at)
					 VALUES ($1, $2, $3, $4, $5)
					 ON CONFLICT (id) DO UPDATE SET
					   module_id = EXCLUDED.module_id,
					   title = EXCLUDED.title,
					   content = EXCLUDED.content,
					   updated_at = EXCLUDED.updated_at`,
					[id, moduleId, title, content, updatedAt],
				);
				importedDocuments += 1;
			} catch {
				skippedDocuments += 1;
			}
		}
	});

	const after = await getCounts();
	console.log(
		`[import] done. imported modules=${importedModules} documents=${importedDocuments}; skipped modules=${skippedModules} documents=${skippedDocuments}`,
	);
	console.log(`[import] postgres after: modules=${after.modules} documents=${after.documents}`);
}

async function main() {
	const filePath = process.argv[2] ? path.resolve(process.argv[2]) : defaultJsonPath;
	console.log(`[import] source: ${filePath}`);
	try {
		await fs.access(filePath);
	} catch {
		throw new Error(
			`JSON file not found: ${filePath}. Pass a path explicitly: node server/seed/import-json-to-postgres.js <path-to-db.json>`,
		);
	}
	await importJsonToPostgres({ filePath });
}

main()
	.then(async () => {
		await closePool();
		process.exit(0);
	})
	.catch(async (e) => {
		console.error('[import] failed', e);
		await closePool();
		process.exit(1);
	});


import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { withTransaction } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.resolve(__dirname, '..', 'migrations');

async function listMigrationFiles() {
	const entries = await fs.readdir(migrationsDir, { withFileTypes: true });
	return entries
		.filter((e) => e.isFile() && e.name.endsWith('.sql'))
		.map((e) => e.name)
		.sort();
}

export async function migrate() {
	const files = await listMigrationFiles();

	await withTransaction(async (client) => {
		await client.query(`
			CREATE TABLE IF NOT EXISTS schema_migrations (
				name TEXT PRIMARY KEY,
				applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
			)
		`);

		const applied = await client.query('SELECT name FROM schema_migrations');
		const appliedSet = new Set(applied.rows.map((r) => r.name));

		for (const name of files) {
			if (appliedSet.has(name)) continue;
			const sql = await fs.readFile(path.join(migrationsDir, name), 'utf8');
			if (sql.trim()) {
				await client.query(sql);
			}
			await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [name]);
		}
	});
}

const thisFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedFile && path.resolve(invokedFile) === path.resolve(thisFile)) {
	migrate()
		.then(() => {
			console.log('[migrate] ok');
			process.exit(0);
		})
		.catch((e) => {
			console.error('[migrate] failed', e);
			process.exit(1);
		});
}


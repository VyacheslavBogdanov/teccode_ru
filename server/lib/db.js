import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export async function ensureDbFile(seedFn) {
	try {
		await fs.access(DB_FILE);
		return;
	} catch {
		await fs.mkdir(DATA_DIR, { recursive: true });
		const seeded = (await seedFn?.()) ?? { modules: [], documents: [], sessions: [] };
		await fs.writeFile(DB_FILE, JSON.stringify(seeded, null, 2), 'utf8');
	}
}

export async function readDb() {
	const raw = await fs.readFile(DB_FILE, 'utf8');
	return JSON.parse(raw);
}

export async function writeDb(db) {
	const tmp = DB_FILE + '.tmp';
	await fs.writeFile(tmp, JSON.stringify(db, null, 2), 'utf8');
	await fs.rename(tmp, DB_FILE);
}

export { DB_FILE };

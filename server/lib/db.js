import pg from 'pg';

const { Pool } = pg;

let pool;

function getDatabaseUrl() {
	const url = String(process.env.DATABASE_URL ?? '').trim();
	if (!url) {
		throw new Error(
			'DATABASE_URL is not set. Example: postgresql://user:pass@localhost:5432/dbname',
		);
	}
	return url;
}

export function getPool() {
	if (!pool) {
		pool = new Pool({
			connectionString: getDatabaseUrl(),
			max: Number(process.env.PG_POOL_MAX ?? 10),
			idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT_MS ?? 30000),
			connectionTimeoutMillis: Number(process.env.PG_CONNECT_TIMEOUT_MS ?? 5000),
		});
	}
	return pool;
}

export async function query(text, params) {
	return getPool().query(text, params);
}

export async function withClient(fn) {
	const client = await getPool().connect();
	try {
		return await fn(client);
	} finally {
		client.release();
	}
}

export async function withTransaction(fn) {
	return withClient(async (client) => {
		await client.query('BEGIN');
		try {
			const result = await fn(client);
			await client.query('COMMIT');
			return result;
		} catch (e) {
			await client.query('ROLLBACK');
			throw e;
		}
	});
}

export async function closePool() {
	if (pool) {
		const p = pool;
		pool = undefined;
		await p.end();
	}
}

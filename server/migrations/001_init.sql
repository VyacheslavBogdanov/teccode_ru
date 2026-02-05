CREATE TABLE IF NOT EXISTS modules (
	id UUID PRIMARY KEY,
	slug TEXT NOT NULL UNIQUE,
	title TEXT NOT NULL,
	preview TEXT NOT NULL DEFAULT '🧩',
	description TEXT NOT NULL DEFAULT '',
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS documents (
	id UUID PRIMARY KEY,
	module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
	title TEXT NOT NULL,
	content TEXT NOT NULL DEFAULT '',
	updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS documents_module_id_idx ON documents(module_id);

CREATE TABLE IF NOT EXISTS sessions (
	token UUID PRIMARY KEY,
	created_at TIMESTAMPTZ NOT NULL,
	expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions(expires_at);


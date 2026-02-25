<template>
	<section class="doc-page" v-if="moduleItem && doc">
		<div class="doc-page__container">
			<p class="doc-page__breadcrumb">
				<RouterLink :to="ROUTES.softwareSolutions.path" class="doc-page__crumb-link">
					Программные решения
				</RouterLink>
				<span class="doc-page__crumb-sep">/</span>
				<RouterLink
					:to="{ name: ROUTES.module.name, params: { slug } }"
					class="doc-page__crumb-link"
				>
					{{ moduleItem.title }}
				</RouterLink>
				<span class="doc-page__crumb-sep">/</span>
				<span>{{ doc.title }}</span>
			</p>

			<h1 class="doc-page__title">{{ doc.title }}</h1>

			<div class="doc-page__content ui-panel">
				<div class="doc-page__blocks">
					<template v-for="(b, idx) in blocks" :key="idx">
						<p v-if="b.type === 'p'" class="doc-page__p">{{ b.text }}</p>
						<div v-else-if="b.type === 'img'" class="doc-page__img-wrap">
							<img class="doc-page__img" :src="b.src" :alt="b.alt" loading="lazy" />
						</div>
						<div v-else class="doc-page__space" />
					</template>
				</div>
			</div>

			<RouterLink :to="{ name: ROUTES.module.name, params: { slug } }" class="doc-page__back">
				← Назад к модулю
			</RouterLink>
		</div>
	</section>

	<section class="doc-page" v-else>
		<div class="doc-page__container">
			<h1 class="doc-page__title">Документ не найден</h1>
			<RouterLink :to="ROUTES.softwareSolutions.path" class="doc-page__back"
				>← К списку модулей</RouterLink
			>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { ROUTES } from '@/router/routes';
import { softwareApi, type DocumentItem, type ModuleDetail } from '@/api/software';

const route = useRoute();

const slug = computed(() => String(route.params.slug ?? ''));
const docId = computed(() => String(route.params.docId ?? ''));

const moduleItem = ref<ModuleDetail | null>(null);
const doc = ref<DocumentItem | null>(null);

function resolveUploadSrc(src: string) {
	const raw = String(import.meta.env.VITE_API_BASE_URL ?? '')
		.trim()
		.replace(/\/$/, '');
	const base = raw ? (raw.endsWith('/api') ? raw.slice(0, -4) : raw) : '';

	const localAbs = /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?(\/uploads\/.+)$/i.exec(src);
	if (localAbs?.[1]) src = localAbs[1];

	if (src.startsWith('/uploads/')) return base ? `${base}${src}` : src;
	return src;
}

function parseBlocks(raw: string) {
	const text = String(raw ?? '').replace(/\r\n/g, '\n');
	const lines = text.split('\n');
	const blocks: Array<
		{ type: 'p'; text: string } | { type: 'img'; src: string; alt: string } | { type: 'space' }
	> = [];

	function pushText(t: string) {
		const s = String(t ?? '');
		if (!s.trim()) return;
		blocks.push({ type: 'p', text: s });
	}

	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed) {
			blocks.push({ type: 'space' });
			continue;
		}

		const exact = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(trimmed);
		if (exact) {
			const alt = String(exact[1] ?? '').trim();
			const src = String(exact[2] ?? '').trim();
			const ok =
				src.startsWith('/uploads/') ||
				src.startsWith('http://') ||
				src.startsWith('https://');
			if (ok) {
				blocks.push({ type: 'img', src: resolveUploadSrc(src), alt });
				continue;
			}
		}

		const re = /!\[([^\]]*)\]\(([^)]+)\)/g;
		let last = 0;
		let matched = false;
		for (const m of line.matchAll(re)) {
			matched = true;
			const idx = m.index ?? 0;
			if (idx > last) pushText(line.slice(last, idx));

			const alt = String(m[1] ?? '').trim();
			const src = String(m[2] ?? '').trim();
			const ok =
				src.startsWith('/uploads/') ||
				src.startsWith('http://') ||
				src.startsWith('https://');
			if (ok) {
				blocks.push({ type: 'img', src: resolveUploadSrc(src), alt });
			} else {
				pushText(String(m[0] ?? ''));
			}

			last = idx + String(m[0] ?? '').length;
		}

		if (matched) {
			if (last < line.length) pushText(line.slice(last));
			continue;
		}

		pushText(line);
	}

	return blocks;
}

const blocks = computed(() => parseBlocks(String(doc.value?.content ?? '')));

async function load() {
	moduleItem.value = null;
	doc.value = null;
	try {
		const [{ module }, { document }] = await Promise.all([
			softwareApi.getModule(slug.value),
			softwareApi.getDocument(docId.value),
		]);
		moduleItem.value = module;
		doc.value = document;
	} catch {
		moduleItem.value = null;
		doc.value = null;
	}
}

onMounted(load);
watch([slug, docId], load);
</script>

<style scoped lang="scss">
@use '../assets/styles/variables.scss' as *;

.doc-page {
	padding: 6rem 1rem;
	color: $main-text-color;

	&__container {
		max-width: 960px;
		margin: 0 auto;
	}

	&__breadcrumb {
		font-size: 0.85rem;
		color: rgba($main-text-color, 0.6);
		margin-bottom: 0.75rem;
		display: flex;
		gap: 0.4rem;
		flex-wrap: wrap;
	}

	&__crumb-link {
		color: rgba($main-text-color, 0.85);
		border-bottom: 1px solid transparent;
		transition:
			color 0.2s ease,
			border-color 0.2s ease;

		&:hover {
			color: $main-red-color;
			border-bottom-color: rgba($main-red-color, 0.7);
		}
	}

	&__crumb-sep {
		opacity: 0.6;
	}

	&__title {
		font-size: 2rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-bottom: 0.75rem;
	}

	&__content {
		padding: 2rem;
		border-radius: 12px;
		margin-bottom: 1.5rem;
	}

	&__blocks {
		display: grid;
		gap: 1rem;
	}

	&__p {
		margin: 0;
		white-space: pre-wrap;
		word-break: break-word;
		font-family: inherit;
		font-size: 0.95rem;
		line-height: 1.7;
		color: rgba($main-text-color, 0.92);
	}

	&__img-wrap {
		width: 100%;
		display: grid;
		place-items: start;
	}

	&__img {
		max-width: 100%;
		height: auto;
		display: block;
		border-radius: 12px;
		border: 1px solid rgba($main-text-color, 0.1);
	}

	&__space {
		height: 0.5rem;
	}

	&__back {
		display: inline-flex;
		font-size: 0.9rem;
		color: $main-text-color;
		border-bottom: 1px solid transparent;
		transition:
			color 0.2s ease,
			border-color 0.2s ease;

		&:hover {
			color: $main-red-color;
			border-bottom-color: rgba($main-red-color, 0.7);
		}
	}
}
</style>

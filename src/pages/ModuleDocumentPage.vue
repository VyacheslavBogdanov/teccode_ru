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
			<p class="doc-page__meta">Документ: {{ doc.id }} • Модуль: {{ slug }}</p>

			<div class="doc-page__placeholder ui-panel">
				Здесь будет контент документа (изображения/страницы) для каждого модуля отдельно.
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
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { ROUTES } from '@/router/routes';
import { MODULES_BY_SLUG } from '@/data/modules';
import type { ModuleSlug } from '@/data/modules';
import type { DocId } from '@/data/documents';
import { useMainStore } from '@/stores/main';

const route = useRoute();
const store = useMainStore();

const slug = computed(() => route.params.slug as ModuleSlug);
const docId = computed(() => route.params.docId as DocId);

const moduleItem = computed(() => MODULES_BY_SLUG[slug.value]);
const doc = computed(() => {
	try {
		return store.documentById(docId.value);
	} catch {
		return null;
	}
});
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

	&__meta {
		font-size: 0.9rem;
		color: rgba($main-text-color, 0.7);
		margin-bottom: 2rem;
	}

	&__placeholder {
		padding: 2rem;
		border-radius: 12px;
		margin-bottom: 1.5rem;
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

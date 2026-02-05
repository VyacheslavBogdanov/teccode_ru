<template>
	<section class="module" v-if="moduleItem">
		<div class="module__container">
			<p class="module__breadcrumb">
				<RouterLink :to="ROUTES.softwareSolutions.path" class="module__crumb-link">
					Программные решения
				</RouterLink>
				<span class="module__crumb-sep">/</span>
				<span>{{ moduleItem.title }}</span>
			</p>

			<h1 class="module__title">{{ moduleItem.title }}</h1>

			<p class="module__subtitle">{{ moduleItem.description }}</p>

			<RouterLink :to="ROUTES.contactForm.path" class="module__cta ui-cta"
				>Запросить цену</RouterLink
			>

			<ModuleDocuments :module-slug="moduleItem.slug" :docs="moduleItem.documents" />
		</div>
	</section>

	<section v-else class="module module--not-found">
		<div class="module__container">
			<h1 class="module__title">Модуль не найден</h1>
			<RouterLink :to="ROUTES.softwareSolutions.path" class="module__cta ui-cta"
				>К списку модулей</RouterLink
			>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { ROUTES } from '@/router/routes';
import ModuleDocuments from '@/components/ProductModulePage/ModuleDocuments.vue';
import { softwareApi, type ModuleDetail } from '@/api/software';

const route = useRoute();
const slug = computed(() => String(route.params.slug ?? ''));

const moduleItem = ref<ModuleDetail | null>(null);

async function load() {
	moduleItem.value = null;
	try {
		const { module } = await softwareApi.getModule(slug.value);
		moduleItem.value = module;
	} catch {
		moduleItem.value = null;
	}
}

onMounted(load);
watch(slug, load);
</script>

<style scoped lang="scss">
@use '../assets/styles/variables.scss' as *;

.module {
	padding: 6rem 1rem;
	color: $main-text-color;

	&__container {
		max-width: 900px;
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
		font-size: 2.1rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-bottom: 1.25rem;
	}

	&__subtitle {
		font-size: 0.98rem;
		color: rgba($main-text-color, 0.9);
		line-height: 1.7;
		margin-bottom: 2rem;
	}

	&__cta {
		margin-bottom: 1.5rem;
	}
}
</style>

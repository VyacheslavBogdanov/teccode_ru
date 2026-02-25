<template>
	<section class="products" id="products">
		<div class="products__container">
			<header class="products__header">
				<h2 class="products__title">Программные решения</h2>
				<p class="products__subtitle">
					Наша команда разработала ряд программных модулей в виде standalone-решений с
					богатым API для интеграции в системы безопасности.
				</p>

				<RouterLink :to="ROUTES.contactForm.path" class="products__cta ui-cta">
					Запросить цену
				</RouterLink>
			</header>

			<p v-if="loading" class="products__muted">Загрузка…</p>
			<p v-else-if="error" class="products__error">{{ error }}</p>
			<p v-else-if="!modules.length" class="products__muted">Пока нет модулей</p>
			<div v-else class="products__grid">
				<RouterLink
					v-for="(m, i) in modules"
					:key="m.slug"
					class="products__card ui-card"
					:to="{ name: ROUTES.module.name, params: { slug: m.slug } }"
					:style="{ animationDelay: `${0.05 * i}s` }"
				>
					<div class="products__icon" aria-hidden="true">
						<img
							v-if="isImagePreview(m.preview)"
							class="products__icon-img"
							:src="m.preview"
							:alt="m.title"
							loading="lazy"
						/>
						<span v-else class="products__icon-fallback">{{ m.preview }}</span>
					</div>
					<p class="products__name">{{ m.title }}</p>
				</RouterLink>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { onMounted, ref } from 'vue';
import { ROUTES } from '@/router/routes';
import { softwareApi, type ModuleListItem } from '@/api/software';

defineOptions({ name: 'SoftwareSolutionsSoftware' });

const modules = ref<ModuleListItem[]>([]);
const loading = ref(false);
const error = ref('');

function isImagePreview(value: unknown): boolean {
	const v = String(value ?? '').trim();
	if (!v) return false;
	return (
		v.startsWith('data:image/') ||
		v.startsWith('http://') ||
		v.startsWith('https://') ||
		v.startsWith('/')
	);
}

onMounted(async () => {
	loading.value = true;
	error.value = '';
	try {
		const { modules: apiModules } = await softwareApi.getModules();
		modules.value = apiModules;
	} catch {
		error.value = 'Не удалось загрузить список модулей';
		modules.value = [];
	} finally {
		loading.value = false;
	}
});
</script>

<style scoped lang="scss">
@use '../../assets/styles/variables.scss' as *;

.products {
	padding: 6rem 1rem 7rem;
	color: $main-text-color;
	text-align: center;

	&__container {
		max-width: 1200px;
		margin: 0 auto;
	}

	&__header {
		max-width: 720px;
		margin: 0 auto 3rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	&__title {
		font-size: 2.2rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	&__subtitle {
		font-size: 0.95rem;
		color: rgba($main-text-color, 0.85);
		line-height: 1.7;
	}

	&__cta {
		margin-top: 0.75rem;
	}

	&__muted {
		color: rgba($main-text-color, 0.7);
	}

	&__error {
		color: $main-red-color;
	}

	&__grid {
		position: relative;
		margin-top: 2.5rem;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 2.5rem 3rem;

		@media (min-width: 768px) {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		@media (min-width: 1100px) {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	&__card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 1.75rem 1rem 1.5rem;
		text-decoration: none;
		color: inherit;
		cursor: pointer;
		opacity: 0;
		animation: fadeInUp 0.7s ease forwards;
		transition:
			transform 0.15s ease-out,
			border-color 0.15s ease-out,
			box-shadow 0.15s ease-out;

		&:hover {
			transform: translateY(-4px);
			border-color: rgba($main-red-color, 0.7);
			box-shadow: 0 22px 55px rgba(0, 0, 0, 0.8);
		}
	}

	&__icon {
		width: 76px;
		height: 76px;
		border-radius: 18px;
		display: grid;
		place-items: center;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(0, 0, 0, 0.25);
		box-shadow: 0 10px 26px rgba(0, 0, 0, 0.65);
		overflow: hidden;
	}

	&__icon-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	&__icon-fallback {
		font-size: 2.4rem;
		line-height: 1;
	}

	&__name {
		font-size: 0.95rem;
		font-weight: 600;
		line-height: 1.4;
		color: rgba($main-text-color, 0.95);
	}
}
</style>

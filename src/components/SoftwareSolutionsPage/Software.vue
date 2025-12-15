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

			<div class="products__grid">
				<RouterLink
					v-for="(m, i) in MODULES"
					:key="m.slug"
					class="products__card ui-card"
					:to="{ name: ROUTES.module.name, params: { slug: m.slug } }"
					:style="{ animationDelay: `${0.05 * i}s` }"
				>
					<div class="products__icon" aria-hidden="true">{{ m.icon }}</div>
					<p class="products__name">{{ m.title }}</p>
				</RouterLink>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ROUTES } from '@/router/routes';
import { MODULES } from '@/data/modules';
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

	&__grid {
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
		font-size: 2.7rem;
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
